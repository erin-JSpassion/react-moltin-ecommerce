import React from 'react'
import moltin from '../vendor/moltin';
import events from '../vendor/pub-sub'

export default class Cart extends React.Component {
	state = {
		currentCart : {
			total_items: null
		}
	};

	componentDidMount() {
		let _this = this;

		// Listen to the CART_UPDATED event, and update the header cart content accordingly
		events.subscribe('CART_UPDATED', function(obj) {
			console.log('updated cart', obj);
			_this.setState({
				currentCart: {
					total_items: obj.cart.total_items
				}
			})
		});
	}

	render() {
		console.log(this.state.currentCart);

		return (
			<span className="cart">
				{this.state.currentCart.total_items}
				<i className="in cart icon"></i>
			</span>
		);
	}
}
