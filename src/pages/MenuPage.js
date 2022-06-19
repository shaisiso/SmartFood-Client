import BackgroundImg from '../assets/background.jpg'
import { useEffect, useRef, useState } from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import Axios from 'axios';
import { serverPort, WEB_URL } from '../utility/Utils';
const categories = ['Starters', 'Salads', 'Main Dishes']


const MenuPage = () => {
    const [menu, setMenu] = useState([])
    const [dishesToDisplay, setDishesToDisplay] = useState(menu);
    const [radioValue, setRadioValue] = useState(-1);
    // async function getData(){
    //     var res = await Axios.get(`${webUrl}:${serverPort}/api/menu`)
    //     setMenu(res.data)
    //     setDishesToDisplay(res.data)
    // }

    const getData = ()=>{
        Axios.get(`${WEB_URL}/api/menu`)
        .then(res=>{
            setMenu(res.data)
            setDishesToDisplay(res.data)
        }).catch(err=>{
            console.log(err)
            alert('Error')
        })
    }

    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
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
            <div className="container">
                <div className="section-title">
                    <h2>Check our tasty <span>Menu</span></h2>
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
                                    <div className='menu-name'>{item.name}</div><span>${item.price}</span>
                                </div>
                                <div className="menu-ingredients">
                                    {item.description}
                                </div>
                            </div>
                        )
                    }
                </div>

            </div>
        </section>
    );
};

export default MenuPage;