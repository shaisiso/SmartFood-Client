import React, { Fragment, useEffect, useRef, useState } from 'react';
import {  categoryForReading, categoryForClass, extractHttpError } from '../utility/Utils';
import { ColorRing } from 'react-loader-spinner'
import PopupMessage from './PopupMessage';
import EditableRow from './EditableRow';
import ReadOnlyRow from './ReadOnlyRow';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ReactComponent as UpSvg } from '../assets/icons/up.svg'
import { ReactComponent as DownSvg } from '../assets/icons/down.svg'
import MenuService from '../services/MenuService';


const MenuManagement = ({tokensDetails}) => {
    const [categories, setCategories] = useState([])
    const [menu, setMenu] = useState([])
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [loaded, setLoaded] = useState(false)
    const [showNewItemForm, setShowNewItemForm] = useState(false)
    const [newItem, setNewItem] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
    });
    const [editItemId, setEditItemId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        itemId: "",
        name: "",
        category: "",
        description: "",
        price: "",
    });
    const [sortDirection, setSortDirection] = useState({name:null, category:null,price:null})
    const getCategories = () => {
       MenuService.getCategories()
            .then(res => {
                setCategories(res.data)
            }).catch(err => {
                console.log(err)
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: [errMsg] })
            })

    }
    const getDirectionImg=(field)=>sortDirection[field] === null ? null : sortDirection[field] === 'up' ? <UpSvg height="20" width="20"/>  :  <DownSvg height="20" width="20"/>
    const getDirection = (field) => sortDirection[field] === null ? 'up' : sortDirection[field] === 'up' ? 'down' : 'up' 
    const sortByCategory = () => {
        setSortDirection({
            name:null,
            category: getDirection('category'),
            price:null
        })
        let sortMenu = menu
        let ascendingSort = sortDirection.category === null || sortDirection.category === 'down' ? 1 : -1
        sortMenu.sort((a, b) => a.category.localeCompare(b.category) * ascendingSort)
        setMenu(sortMenu)

    }
    const sortByName = ()=>{
        setSortDirection({
            name:getDirection('name'),
            category: null,
            price:null
        })
        let sortMenu = menu
        let ascendingSort = sortDirection.name === null || sortDirection.name === 'down' ? 1 : -1
        sortMenu.sort((a, b) => a.name.localeCompare(b.name) * ascendingSort)
        setMenu(sortMenu)
    }
    const sortByPrice = ()=>{
        setSortDirection({
            name:null,
            category: null,
            price: getDirection('price')
        })
        let sortMenu = menu
        let ascendingSort = sortDirection.price === null || sortDirection.price === 'down' ? 1 : -1
        sortMenu.sort((a, b) => (a.price - b.price) * ascendingSort)
        setMenu(sortMenu)
    }
    const getData = async () => {
        await MenuService.getMenu()
            .then(res => {
                let data = res.data.map(item => {
                    let category = categoryForReading(item.category)
                    item.category = category
                    return item
                })
                setMenu(data)
               
            }).catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: [errMsg] })
            })
        setLoaded(true)
    }
    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getCategories();
            getData();
        }
    });

    const addItem = async event => {
        event.preventDefault()
        setLoaded(false)
        if (!newItem.category)
            newItem.category = categories[0]
        var itemForAPI = { ...newItem, category: categoryForClass(newItem.category) }
        await MenuService.addItem(itemForAPI)
            .then(res => {
                console.log(res)
                setPopupMessage({ title: 'New item was added to menu', messages: [`Name: ${newItem.name}`, `Category: ${newItem.category}`, `Price: ${newItem.price}`, `Description: ${newItem.description}`] })
                setShowNewItemForm(false)
                getData();
            })
            .catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: [errMsg] })
            })
        setLoaded(true)
    }
    const onChangeNewItem = e => {
        let fieldName = e.target.getAttribute("name")
        let newItemChange = { ...newItem }
        newItemChange[fieldName] = e.target.value
        setNewItem({ ...newItemChange })
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

    const handleDeleteClick = async (item) => {
       await MenuService.deleteItem(item,tokensDetails)
            .then(response => {
                console.log(response)
                const newMenu = [...menu];
                const index = menu.findIndex((i) => i.itemId === item.itemId);
                newMenu.splice(index, 1);
                setMenu(newMenu);
            })
            .catch(err => {
                console.log(err)
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: [errMsg] })
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
        console.log('submit')
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

    const updateItemClick = async event => {
        event.preventDefault();
        setLoaded(false)
        let item = { ...editFormData, category: categoryForClass(editFormData.category) }

        await MenuService.updateItem(item)
            .then(response => {
                const newMenu = [...menu];

                const index = menu.findIndex((item) => item.itemId === editItemId);

                newMenu[index] = editFormData;

                setMenu(newMenu);
                setEditItemId(null);
            })
            .catch(err => {
                console.log(err)
                var errMsg = extractHttpError(err)
                console.log(errMsg)
                setPopupMessage(errMsg)
            })


        setLoaded(true)
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
                <button className="btn btn-primary mx-auto mt-5" onClick={(e) => {
                    e.preventDefault();
                    setShowNewItemForm(!showNewItemForm)
                }}>New item</button>
                {
                    showNewItemForm ?
                        <form onSubmit={addItem}>
                            <div className="col-md-6 mx-auto my-5">
                                <div className="col-md-12 form-group">
                                    <FloatingLabel label="*Name">
                                        <input type="text" className="form-control" name="name" placeholder="*Name" required
                                            value={newItem.name} onChange={onChangeNewItem} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="Choose Category">
                                        <Form.Select aria-label="Select Category" onChange={onChangeNewItem} name="category" >
                                            {
                                                categories.map((category, key) => (
                                                    <option key={key} value={category} >{category}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="Description" >
                                        <textarea className="form-control" name="description" rows="2" placeholder="Description"
                                            value={newItem.description} onChange={onChangeNewItem} style={{ height: '10rem' }} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="*Price">
                                        <input type="number" className="form-control" min={1} name="price" required placeholder="*Price"
                                            value={newItem.price} onChange={onChangeNewItem} />
                                    </FloatingLabel>
                                </div>
                                <input type="submit" className="btn btn-primary mx-auto " value="Add item to menu" visible={showNewItemForm} />
                            </div>
                        </form>
                        :
                        null
                }


                <div className="row mt-5">
                    <form onSubmit={handleEditFormSubmit}>
                        <table className="table table-striped table-bordered" style={{ backgroundColor: 'white' }}>
                            <thead>
                                <tr>
                                    <th style={{ cursor: 'pointer' }}  onClick={sortByName}> Name  {getDirectionImg('name')}</th>
                                    <th style={{ cursor: 'pointer' }}  onClick={sortByCategory}>Category {getDirectionImg('category')}</th>
                                    <th>Description</th>
                                    <th style={{ cursor: 'pointer' }}  onClick={sortByPrice} >Price {getDirectionImg('price')}</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menu.map((item, key) => (
                                    <Fragment key={key}>
                                        {editItemId === item.itemId ? (
                                            <EditableRow
                                                editFormData={editFormData}
                                                categories={categories}
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
                popupMessage.title ?
                    <PopupMessage
                        title={popupMessage.title}
                        body={
                            <ul>
                                {
                                    popupMessage.messages.map((message, key) => (
                                        <li key={key} className="mt-2" style={{ fontSize: '1.2rem' }}>
                                            {message}
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                        onClose={() => {
                            setPopupMessage({ title: '', messages: [''] })
                            setNewItem({
                                name: "",
                                category: "",
                                description: "",
                                price: "",
                            })
                        }}
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            popupMessage.title.includes('New item') ?
                                'success'
                                :
                                'info'
                        }
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
            {/* {
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
            } */}
        </div>
    );
};

export default MenuManagement;