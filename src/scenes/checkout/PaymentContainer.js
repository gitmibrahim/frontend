import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectStripe } from 'react-stripe-elements';

import PaymentSection from './components/PaymentSection';
import * as actions from './actions';
import { statuses } from '../../libs/fetch_helpers';

class PaymentContainer extends React.Component {
  static propTypes = {
    onStripeTokenReceived: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.clearTripBooked();
  }

  onStripeTokenReceived = (token, complete) => {
    this.props.chargeStripeToken(token, complete);
  };

  onSubmitClick = async () => {
    const { token, error } = await this.props.stripe.createToken({ name: 'Customer name' });
    console.log('stripe token', token);
    console.log('stripe error', error);
    this.onStripeTokenReceived(token);
  };

  render() {
    const { trip, markTripBooked, isLoading } = this.props;
    const totalPrice = trip.price * (trip.numberOfPerson || 1);
    return (
      <div>
        <PaymentSection
          numberOfPerson={trip.numberOfPerson}
          pricePerPerson={trip.price}
          totalPrice={totalPrice}
          onPaymentClick={markTripBooked}
          isLoading={isLoading}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trip: state.TripsReducer.trip,
  isLoading: state.TripsReducer.bookingStatus === statuses.STARTED,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectStripe(PaymentContainer));
