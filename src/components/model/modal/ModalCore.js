import React from 'react';
import PropTypes from 'prop-types';

const ModalCore = (props) => {

    const close = e => {
        e.stopPropagation();
        const overlayOrButton = e.target.classList.contains('modal-overlay') || e.target.classList.contains('close-btn')
        if (!overlayOrButton ) return;
        
        props.closeModal();
    }

    return (
    <div className="modal-core" onClick={close}>
        <div className="modal-overlay">
            <div className="modal-main">
                <span className="close-btn" onClick={close}>+</span>
                {props.children}
            </div>
        </div>
    </div>)
};

ModalCore.propTypes = {
    closeModal: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
}

export default ModalCore;