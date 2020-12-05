import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ModalCore from './ModalCore';
import api from 'src/helpers/api';

const BuyTokens = ({ close, match, title }) => {

    const handleSubmit = e => {
        e.preventDefault();
        const amount = e.target.amount.value;
        const { params: { id } } = match;
        // api('user/tipModel', {
        //     amount,
        //     modelUrl: id,
        //     eventId: "5c90f31db0e338396048aae9"
        // }).then((res) => {

        api('user/buyTokens', {
            amount,
            modelUrl: id
        }).then((res) => {
            if(res) close();
        }).catch(e => console.log(e))
    }

    return (
        <ModalCore closeModal={close}>
            <h3>{title}</h3>
            <form onSubmit={handleSubmit}>
                <input name="amount" type="number" defaultValue="10" />
                <button>Buy</button>
            </form>
        </ModalCore>
    )
}

BuyTokens.defaultProps = {
    title: 'Please enter amount of tokens you want to buy'
}

BuyTokens.propTypes = {
    close: PropTypes.func.isRequired
}

export default connect(({ session: { user } }) => ({ user }))(BuyTokens);
