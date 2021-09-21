import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';

import './Dialog.less';


export default class Dialog extends Component {
    static propTypes = {
        title          : PropTypes.string,
        isOpen         : PropTypes.bool,
        children       : PropTypes.any,
        onRequestClose : PropTypes.func
    };

    render() {
        const { isOpen, title, children, onRequestClose } = this.props;

        const styles = {
            overlay : {
                backgroundColor : 'rgba(0, 0, 0, 0.5)'
            },
            content : {
                position : 'static',
                outline  : 'none'
            }
        };

        return (
            <ReactModal
                isOpen         = {isOpen}
                style          = {styles}
                onRequestClose = {onRequestClose}
            >
                {
                    title
                    ? <h1 className = 'Dialog__title'>{title}</h1>
                    : null
                }
                {children}
            </ReactModal>
        );
    }
}
