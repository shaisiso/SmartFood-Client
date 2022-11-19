import React, { Fragment, useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { API_URL, categoryForReading, categoryForClass } from '../utility/Utils';
import { ColorRing } from 'react-loader-spinner'
import PopupMessage from './PopupMessage';
import EditableRow from './EditableRow';
import ReadOnlyRow from './ReadOnlyRow';

const MenuManagement = () => {
    //  const [categories, setCategories] = useState([])
    const [menu, setMenu] = useState([])
    const [errorMessage, setErrorMessage] = useState('');
    const [loaded, setLoaded] = useState(false)

    const [editItemId, setEditItemId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        itemId: "",
        name: "",
        category: "",
        description: "",
        price: "",
    });
    // const getCategories = () => {
    //     Axios.get(`${API_URL}/api/menu/categories`)
    //         .then(res => {
    //             setCategories(res.data)
    //         }).catch(err => {
    //             var errMsg;
    //             if (err.response.data) {
    //                 errMsg = err.response.data.message;
    //             }
    //             else {
    //                 errMsg = err.message
    //             }
    //             setErrorMessage(errMsg)
    //         })
    // }
    const sortMenuByCategory=(menu)=>{
        menu.sort((a, b) => b.category - a.category )
    }
    const getData = async () => {
        await Axios.get(`${API_URL}/api/menu`)
            .then(res => {
                let data = res.data.map(item => {
                    let category = categoryForReading(item.category)
                    item.category = category
                    return item
                })
                sortMenuByCategory(data)
        setMenu(data)
    }).catch (err => {
    var errMsg;
    if (err.response.data) {
        errMsg = err.response.data.message;
    }
    else {
        errMsg = err.message
    }
    setErrorMessage(errMsg)
})
setLoaded(true)
    }
const mounted = useRef();
useEffect(() => {
    if (!mounted.current) {
        mounted.current = true;
        //    getCategories();
        getData();
    }
});

const addItem = item => {
    console.log('add')
    getData();
}

const handleEditClick = (event, item) => {
    event.preventDefault();
    console.log(item)
    setEditItemId(item.itemId);

    const formValues = {
        itemId: item.itemId,
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
    };

    setEditFormData(formValues);
};

const handleCancelClick = () => {
    setEditItemId(null);
};

const handleDeleteClick = (item) => {
    Axios.delete(`${API_URL}/api/menu/${item.itemId}`)
    .then(response => { 
        console.log(response) 
        const newMenu = [...menu];
        const index = menu.findIndex((i) => i.itemId === item.itemId);
        newMenu.splice(index, 1);
        setMenu(newMenu);
    })
    .catch(err => {
        console.log(err)
    })
};
//
const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
};

const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedItem = {
        itemId: editItemId,
        name: editFormData.name,
        category: editFormData.category,
        description: editFormData.description,
        price: editFormData.price,
    };

    const newMenu = [...menu];

    const index = menu.findIndex((item) => item.itemId === editItemId);

    newMenu[index] = editedItem;

    setMenu(newMenu);
    setEditItemId(null);
};

const updateItemClick = event => {
    event.preventDefault();
    let item = { ...editFormData, category: categoryForClass(editFormData.category) }

    Axios.put(`${API_URL}/api/menu`, item)
        .then(response => { console.log(response) })
        .catch(err => {
            console.log(err)
        })
    const newMenu = [...menu];

    const index = menu.findIndex((item) => item.itemId === editItemId);

    newMenu[index] = editFormData;

    setMenu(newMenu);
    setEditItemId(null);
}
return (
    <div className="container mx-auto text-center">
        <div className="text-center ">
            <ColorRing
                visible={!loaded}
                ariaLabel="blocks-loading"
                colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
            />
        </div>
        <div>
            <button className="btn btn-primary mx-auto my-5" onClick={addItem}>Add new item</button>
            <div className="row mt-5">
                <form onSubmit={handleEditFormSubmit}>
                    <table className="table table-striped table-bordered" style={{ backgroundColor: 'white' }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menu.map((item, key) => (
                                <Fragment key={key}>
                                    {editItemId === item.itemId ? (
                                        <EditableRow
                                            editFormData={editFormData}
                                            handleEditFormChange={handleEditFormChange}
                                            handleCancelClick={handleCancelClick}
                                            handleSaveClick={updateItemClick}
                                        />
                                    ) : (
                                        <ReadOnlyRow
                                            item={item}
                                            handleEditClick={handleEditClick}
                                            handleDeleteClick={handleDeleteClick}
                                        />
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </form>
                {/* <table className="table table-striped table-bordered" style={{ backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'yellow' }}>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                menu.map((item, index) =>
                                    <tr key={index} >
                                        <td>
                                            <input type="text" className="form-control" 
                                                value={item.name} onChange={event=>onChangeItemName(item,event.target.value)} 
                                                disabled = {item.itemId !== selectedItem.itemId}/>
                                            {item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.description}</td>
                                        <td>{item.price}</td>
                                        <td>
                                            <button className="form-control btn btn-info mx-auto" onClick={() => updateItem(item)}>Update</button>
                                            <button className="form-control btn btn-danger mt-1 mx-auto" onClick={() => deleteItem(item)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table> */}
            </div>
        </div>
        {/* <div className="row menu-container">
                    {
                        menu.map((item, index) =>
                            <div className="col-lg-6 menu-item filter-starters" key={index}>
                                <div className="menu-content">
                                    <div className='menu-name'>{item.name}</div><span>₪{item.price}</span>
                                </div>
                                <div className="menu-ingredients">
                                    {item.description}
                                </div>
                            </div>
                        )
                    }
                </div> */}
        {
            errorMessage ?
                <PopupMessage
                    title="Error"
                    body={
                        <div className="text-black" style={{ fontSize: '1.2rem' }}>{errorMessage}</div>
                    }
                    onClose={() => {
                        setErrorMessage('')
                    }}
                    status='error'
                >

                </PopupMessage>
                :
                null
        }
    </div>
);
};

export default MenuManagement;