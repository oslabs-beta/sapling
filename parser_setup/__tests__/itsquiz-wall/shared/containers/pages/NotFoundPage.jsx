import React, { Component, PropTypes } from 'react';

class NotFoundPage extends Component {
    static contextTypes = { i18n: PropTypes.object };

    render() {
        const { l } = this.context.i18n;

        return (
            <div className='NotFoundPage'>

                <div className='page-content'>
                    <img src='/static/images/notFoundPage/404.png' className='image' />
                    <h1 className='text'> {l('The page you are looking for cannot be found')} </h1>
                </div>
            </div>
        );
    }
}

export default NotFoundPage;
