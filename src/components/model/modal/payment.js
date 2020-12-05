import React from 'react';
import { connect } from 'react-redux';
import {
  CardElement,
  StripeProvider,
  Elements,
} from 'react-stripe-elements';

import config from '../../../config';
import ModalCore from './ModalCore';
import api from 'src/helpers/api';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '18px',
      color: '#424770',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#f00'
    }
  }
};

class Payment extends React.Component {
  state = {
    stripe: null
  }

  componentDidMount() {
    const { stripe } = config;
    if ( !window.Stripe ) this.loadStripe(stripe);
    else  this.setState({ stripe: window.Stripe(stripe.pk) });
  }

  loadStripe = (stripe) => {
    const stripeJs = document.createElement('script');
    stripeJs.src = 'https://js.stripe.com/v3/';
    stripeJs.async = true;
    stripeJs.onload = () => {
      this.setState({
        stripe: window.Stripe(stripe.pk)
      });
    };
    document.body && document.body.appendChild(stripeJs);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { models } = this.props;
    const { profile: { _id: modelId } } = Object.values(models)[0];
    const modelLink = Object.keys(models)[0];
    api('model/setExpireDate', { modelId }).then(res => {
      this.props.modelLoaded(res.value, modelLink, "profile");
      setTimeout(()=>{
        this.setState({ profileLoaded: true });
        this.handleClose(e);
      }, 0)
    })
  }

  handleClose = (e) => {
    if (this.modal !== null) {
      if (!this.modal.contains(e.target)) {
        this.props.closeModal(e);
      }
    }
  }

  render() {
    const modelId = Object.keys(this.props.models)[0];
    return (
      <ModalCore closeModal={this.handleClose}>
        <div className="payment-form">
          <StripeProvider stripe={this.state.stripe}>
            <div className="Checkout" ref={node => (this.modal = node)}>
              <Elements>
                <form onSubmit={this.handleSubmit}>
                  <h2>You are now following {modelId}, to access her fan content, please subscribe below</h2>
                  <br />
                  <label>Card details</label>
                  {this.state.stripe ? (
                    <CardElement
                      {...CARD_ELEMENT_OPTIONS}
                    />
                  ) : (
                    <div className="StripeElement loading" />
                  )}
                  <button disabled={!this.state.stripe}>Pay</button>
                </form>
              </Elements>
            </div>
          </StripeProvider>
        </div>
      </ModalCore>
    );
  }
}

export default connect(
  ({ discover }) => ({
    models: discover.models
  }),
  {
    modelLoaded: (data,id,field) => ({
      type: "model_profile_loaded",
      id: id,
      field: field,
      data: data
    })
  })(Payment);
