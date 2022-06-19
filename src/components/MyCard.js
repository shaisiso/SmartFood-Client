import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Card extends Component {
    basicCard = () => {
        return (
            <div className="card shadow mb-4 ">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-center ">
                    <h6 className="m-0 font-weight-bold ">{this.props.header}</h6>
                </div>
                <div className="card-body">
                    <img src={this.props.image} className="img-fluid" alt={this.props.header} />
                </div>
            </div>

            // <div className="card" style={{width:'18rem'}}>
            //     <img src={this.props.image} class="card-img-top" alt={this.props.header} />
            //     <div className="card-body">
            //         <p className="card-text">{this.props.header}</p>
            //     </div>
            // </div>
        )
    }
    render() {
        return (
            <div className="col-xl-5 col-lg-4">
                {this.props.linkTo ? <Link to={this.props.linkTo}>{this.basicCard()}</Link>
                    :
                    this.basicCard()
                }

            </div>

        );
    }
}

export default Card;