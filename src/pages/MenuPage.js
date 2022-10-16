import BackgroundImg from '../assets/background.jpg'
import { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../utility/Utils';
import PopupMessage from '../components/PopupMessage';
import { ColorRing } from 'react-loader-spinner'

const MenuPage = () => {
    const [categories, setCategories] = useState([])
    const [menu, setMenu] = useState([])
    const [dishesToDisplay, setDishesToDisplay] = useState(menu);
    const [radioValue, setRadioValue] = useState(-1);
    const [errorMessage, setErrorMessage] = useState('');
    const [loaded, setLoaded] = useState(false)

    const getCategories = () => {
        Axios.get(`${API_URL}/api/menu/categories`)
            .then(res => {
                setCategories(res.data)
            }).catch(err => {
                var errMsg;
                if (err.response.data) {
                    errMsg = err.response.data.message;
                }
                else {
                    errMsg = err.message
                }
                setErrorMessage(errMsg)
            })
    }
    const getData = async () => {
        await Axios.get(`${API_URL}/api/menu`)
            .then(res => {
                let data = res.data.map(item => {
                    let category = item.category.split("_")
                        .map(word => word[0].toUpperCase() + word.substring(1).toLowerCase())
                        .join(" ")
                    item.category = category
                    return item
                })
                setMenu(data)
                setDishesToDisplay(data)
            }).catch(err => {
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
            getCategories();
            getData();
        }
    });

    const handleCategoryChanged = (index) => {
        setRadioValue(index)
        if (index === -1) {
            //show all
            setDishesToDisplay(menu)
        }
        else {
            var arr = menu.filter((i) => i.category === categories[index])
            setDishesToDisplay(arr)
        }
    }

    return (

        <section id="menu" className="menu" style={{ backgroundImage: `url(${BackgroundImg})` }}>
            <div className="text-center ">
                <ColorRing
                    visible={!loaded}
                    ariaLabel="blocks-loading"
                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                />
            </div>
            <div className="container">
                <div className="section-title">
                    <h2 className="hRestaurant">Check our tasty <span>Menu</span></h2>
                </div>
                <div className="row">
                    <div className="col-lg-12 d-flex justify-content-center">
                        <ul id="menu-flters">
                            <button type="radio" name="options" id={`option${categories.length}`} className={radioValue === -1 ? 'menu-btn-checked' : 'menu-btn'}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleCategoryChanged(-1)
                                }}>Show All</button>
                            {
                                categories.map((category, index) => <button type="radio" name="options" id={`option${index}`}
                                    className={radioValue === index ? 'menu-btn-checked' : 'menu-btn'}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleCategoryChanged(index)
                                    }} key={index}>{category}</button>)
                            }
                        </ul>
                    </div>
                </div>
                <div className="row menu-container">
                    {
                        dishesToDisplay.map((item, index) =>
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
                </div>
            </div>
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
        </section>
    );
};

export default MenuPage;