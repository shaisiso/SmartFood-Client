import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Error404 } from '../assets/img/error-404-monochrome.svg'
const NotFound404 = () => {
    return (
        <div className="container-fluid" style={{backgroundColor:'white', minHeight:'93vh'}}>
            <div className="text-center">
                <div className="error mx-auto" data-text="404">404</div>

                <Error404 height="256" width="256" />
                <p className="lead text-black-800 mt-5 ">Page Not Found</p>
                <p className="lead mb-5">This requested URL was not found on this server.</p>
                <p className="text-black-500 mb-0">It looks like you found a glitch in the matrix...</p>
                <Link to={"/"}>&larr; Back to Homepage</Link>
            </div>

        </div>
    );
};

export default NotFound404;