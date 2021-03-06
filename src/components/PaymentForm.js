import React, { Component } from 'react'
import moltin from '../vendor/moltin';
import { Button, Modal } from 'semantic-ui-react';
import {Link} from 'react-router';
import events from '../vendor/pub-sub';

export default class FormExampleOnSubmit extends Component {

	state = {
		cartPreparing: false,
		processingPayment: false,
		paymentComplete: false,
		cartId: null,
		email: 'test@gmail.com',
		firstName: 'Tarik',
		lastName: 'Fojnica',
		streetAddress: '2477 Friendship Lane',
		city: 'San Jose',
		country: 'US',
		zipCode: 'CA94040',
		phoneNumber: '0038762123456',
		cardNumber: '4242424242424242',
		expiryMonth: '08',
		expiryYear: '2020',
		cvv: '123',
		open: false,
		ownerName: 'Tarik Fojnica',
	};

	close = () => this.setState({ open: false });

	// Takes care of two way data binding
	handleChange = (event) => {
		const value = event.target.value;
		const name = event.target.name;

		this.setState({
			[name]: value
		});
	};

	// Triggers when the form is submitted
	handleSubmit = (event) =>{
		let _this = this;

		moltin.Authenticate(() => {
			let _this = this;
			this.setState({
				cartPreparing: true,
			});

			moltin.Cart.Complete({
				customer: {
					first_name: _this.state.firstName,
					last_name:  _this.state.lastName,
					email:      _this.state.email,
				},
				shipping: '1456721508712841263', // hardcoded shipping method. TODO: allow user to select a shipping method
				gateway: 'stripe', // hardcoded payment method. TODO: allow user to select a payment method
				bill_to: {
					first_name: _this.state.firstName,
					last_name:  _this.state.lastName,
					address_1:  _this.state.streetAddress,
					city:       _this.state.city,
					county:     'California',
					country:    _this.state.country,
					postcode:   _this.state.zipCode,
					phone:      _this.state.phoneNumber
				},
				ship_to: 'bill_to',
			}, function(order) {
				_this.setState({
					open: true,
					cartPreparing: false,
					cartId: order.id
				});

			}, function(error) {
				// Something went wrong...
			});
		});
		event.preventDefault();
	};

	handlePayment = () => {
		let _this = this;
		this.setState({
			processingPayment: true,
		});

		moltin.Authenticate(() => {
			moltin.Checkout.Payment('purchase', this.state.cartId, {
				data: {
					first_name:   this.state.firstName,
					last_name:    this.state.lastName,
					number:       this.state.cardNumber,
					expiry_month: this.state.expiryMonth,
					expiry_year:  this.state.expiryYear,
					cvv:          this.state.cvv
				}
			}, function(payment) {

				// Reset the input values
				_this.setState({
					paymentComplete: true,
					processingPayment: false,
					firstName: '',
					lastName: '',
					cardNumber: '',
					expiryMonth: '',
					expiryYear: '',
					cvv: ''
				})

				moltin.Cart.Delete(function() {
					// Clear the cart once the payment is successful
					//TODO: pass the cart object manually without the API call
					moltin.Cart.Contents(function(items) {
						events.publish('CART_UPDATED', {
							cart: items // any argument
						});

						_this.setState({
							currentCart: items
						})
					}, function(error) {
						// Something went wrong...
					});
				}, function(error) {
					// Something went wrong...
				});
			}, function(error) {
				// Something went wrong...
			});
		});
	};

	render() {
		const { open } = this.state;

		return (
			<div className="payment-form">
				<form className="ui form" onSubmit={this.handleSubmit}>

					<div className="field">
						<label>Contact Email</label>
						<input type="text" name="email" placeholder="Email"  value={this.state.email}  onChange={this.handleChange} />
					</div>

					<div className="field">
						<label>Shipping Information</label>
						<div className="two fields">
							<div className="field">
								<input
									name="firstName"
									placeholder="First Name"
									type="text"
									value={this.state.firstName}
									onChange={this.handleChange} />
							</div>
							<div className="field">
								<input
									name="lastName"
									placeholder="Last Name"
									type="text"
									value={this.state.lastName}
									onChange={this.handleChange} />
							</div>
						</div>
					</div>

					<div className="field">
						<input type="text" name="streetAddress" placeholder="Address"  value={this.state.streetAddress} onChange={this.handleChange} />
					</div>

					<div className="field">
						<input type="text" name="city" placeholder="City"  value={this.state.city}  onChange={this.handleChange}/>
					</div>

					<div className="field">
						<div className="two fields">
							<div className="field">
								<select className="ui fluid" name="country" value={this.state.country} onChange={this.handleChange}>
									<option value="AF">Afghanistan</option>
									<option value="AX">??land Islands</option>
									<option value="AL">Albania</option>
									<option value="DZ">Algeria</option>
									<option value="AS">American Samoa</option>
									<option value="AD">Andorra</option>
									<option value="AO">Angola</option>
									<option value="AI">Anguilla</option>
									<option value="AQ">Antarctica</option>
									<option value="AG">Antigua and Barbuda</option>
									<option value="AR">Argentina</option>
									<option value="AM">Armenia</option>
									<option value="AW">Aruba</option>
									<option value="AU">Australia</option>
									<option value="AT">Austria</option>
									<option value="AZ">Azerbaijan</option>
									<option value="BS">Bahamas</option>
									<option value="BH">Bahrain</option>
									<option value="BD">Bangladesh</option>
									<option value="BB">Barbados</option>
									<option value="BY">Belarus</option>
									<option value="BE">Belgium</option>
									<option value="BZ">Belize</option>
									<option value="BJ">Benin</option>
									<option value="BM">Bermuda</option>
									<option value="BT">Bhutan</option>
									<option value="BO">Bolivia, Plurinational State of</option>
									<option value="BQ">Bonaire, Sint Eustatius and Saba</option>
									<option value="BA">Bosnia and Herzegovina</option>
									<option value="BW">Botswana</option>
									<option value="BV">Bouvet Island</option>
									<option value="BR">Brazil</option>
									<option value="IO">British Indian Ocean Territory</option>
									<option value="BN">Brunei Darussalam</option>
									<option value="BG">Bulgaria</option>
									<option value="BF">Burkina Faso</option>
									<option value="BI">Burundi</option>
									<option value="KH">Cambodia</option>
									<option value="CM">Cameroon</option>
									<option value="CA">Canada</option>
									<option value="CV">Cape Verde</option>
									<option value="KY">Cayman Islands</option>
									<option value="CF">Central African Republic</option>
									<option value="TD">Chad</option>
									<option value="CL">Chile</option>
									<option value="CN">China</option>
									<option value="CX">Christmas Island</option>
									<option value="CC">Cocos (Keeling) Islands</option>
									<option value="CO">Colombia</option>
									<option value="KM">Comoros</option>
									<option value="CG">Congo</option>
									<option value="CD">Congo, the Democratic Republic of the</option>
									<option value="CK">Cook Islands</option>
									<option value="CR">Costa Rica</option>
									<option value="CI">C??te d'Ivoire</option>
									<option value="HR">Croatia</option>
									<option value="CU">Cuba</option>
									<option value="CW">Cura??ao</option>
									<option value="CY">Cyprus</option>
									<option value="CZ">Czech Republic</option>
									<option value="DK">Denmark</option>
									<option value="DJ">Djibouti</option>
									<option value="DM">Dominica</option>
									<option value="DO">Dominican Republic</option>
									<option value="EC">Ecuador</option>
									<option value="EG">Egypt</option>
									<option value="SV">El Salvador</option>
									<option value="GQ">Equatorial Guinea</option>
									<option value="ER">Eritrea</option>
									<option value="EE">Estonia</option>
									<option value="ET">Ethiopia</option>
									<option value="FK">Falkland Islands (Malvinas)</option>
									<option value="FO">Faroe Islands</option>
									<option value="FJ">Fiji</option>
									<option value="FI">Finland</option>
									<option value="FR">France</option>
									<option value="GF">French Guiana</option>
									<option value="PF">French Polynesia</option>
									<option value="TF">French Southern Territories</option>
									<option value="GA">Gabon</option>
									<option value="GM">Gambia</option>
									<option value="GE">Georgia</option>
									<option value="DE">Germany</option>
									<option value="GH">Ghana</option>
									<option value="GI">Gibraltar</option>
									<option value="GR">Greece</option>
									<option value="GL">Greenland</option>
									<option value="GD">Grenada</option>
									<option value="GP">Guadeloupe</option>
									<option value="GU">Guam</option>
									<option value="GT">Guatemala</option>
									<option value="GG">Guernsey</option>
									<option value="GN">Guinea</option>
									<option value="GW">Guinea-Bissau</option>
									<option value="GY">Guyana</option>
									<option value="HT">Haiti</option>
									<option value="HM">Heard Island and McDonald Islands</option>
									<option value="VA">Holy See (Vatican City State)</option>
									<option value="HN">Honduras</option>
									<option value="HK">Hong Kong</option>
									<option value="HU">Hungary</option>
									<option value="IS">Iceland</option>
									<option value="IN">India</option>
									<option value="ID">Indonesia</option>
									<option value="IR">Iran, Islamic Republic of</option>
									<option value="IQ">Iraq</option>
									<option value="IE">Ireland</option>
									<option value="IM">Isle of Man</option>
									<option value="IL">Israel</option>
									<option value="IT">Italy</option>
									<option value="JM">Jamaica</option>
									<option value="JP">Japan</option>
									<option value="JE">Jersey</option>
									<option value="JO">Jordan</option>
									<option value="KZ">Kazakhstan</option>
									<option value="KE">Kenya</option>
									<option value="KI">Kiribati</option>
									<option value="KP">Korea, Democratic People's Republic of</option>
									<option value="KR">Korea, Republic of</option>
									<option value="KW">Kuwait</option>
									<option value="KG">Kyrgyzstan</option>
									<option value="LA">Lao People's Democratic Republic</option>
									<option value="LV">Latvia</option>
									<option value="LB">Lebanon</option>
									<option value="LS">Lesotho</option>
									<option value="LR">Liberia</option>
									<option value="LY">Libya</option>
									<option value="LI">Liechtenstein</option>
									<option value="LT">Lithuania</option>
									<option value="LU">Luxembourg</option>
									<option value="MO">Macao</option>
									<option value="MK">Macedonia, the former Yugoslav Republic of</option>
									<option value="MG">Madagascar</option>
									<option value="MW">Malawi</option>
									<option value="MY">Malaysia</option>
									<option value="MV">Maldives</option>
									<option value="ML">Mali</option>
									<option value="MT">Malta</option>
									<option value="MH">Marshall Islands</option>
									<option value="MQ">Martinique</option>
									<option value="MR">Mauritania</option>
									<option value="MU">Mauritius</option>
									<option value="YT">Mayotte</option>
									<option value="MX">Mexico</option>
									<option value="FM">Micronesia, Federated States of</option>
									<option value="MD">Moldova, Republic of</option>
									<option value="MC">Monaco</option>
									<option value="MN">Mongolia</option>
									<option value="ME">Montenegro</option>
									<option value="MS">Montserrat</option>
									<option value="MA">Morocco</option>
									<option value="MZ">Mozambique</option>
									<option value="MM">Myanmar</option>
									<option value="NA">Namibia</option>
									<option value="NR">Nauru</option>
									<option value="NP">Nepal</option>
									<option value="NL">Netherlands</option>
									<option value="NC">New Caledonia</option>
									<option value="NZ">New Zealand</option>
									<option value="NI">Nicaragua</option>
									<option value="NE">Niger</option>
									<option value="NG">Nigeria</option>
									<option value="NU">Niue</option>
									<option value="NF">Norfolk Island</option>
									<option value="MP">Northern Mariana Islands</option>
									<option value="NO">Norway</option>
									<option value="OM">Oman</option>
									<option value="PK">Pakistan</option>
									<option value="PW">Palau</option>
									<option value="PS">Palestinian Territory, Occupied</option>
									<option value="PA">Panama</option>
									<option value="PG">Papua New Guinea</option>
									<option value="PY">Paraguay</option>
									<option value="PE">Peru</option>
									<option value="PH">Philippines</option>
									<option value="PN">Pitcairn</option>
									<option value="PL">Poland</option>
									<option value="PT">Portugal</option>
									<option value="PR">Puerto Rico</option>
									<option value="QA">Qatar</option>
									<option value="RE">R??union</option>
									<option value="RO">Romania</option>
									<option value="RU">Russian Federation</option>
									<option value="RW">Rwanda</option>
									<option value="BL">Saint Barth??lemy</option>
									<option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
									<option value="KN">Saint Kitts and Nevis</option>
									<option value="LC">Saint Lucia</option>
									<option value="MF">Saint Martin (French part)</option>
									<option value="PM">Saint Pierre and Miquelon</option>
									<option value="VC">Saint Vincent and the Grenadines</option>
									<option value="WS">Samoa</option>
									<option value="SM">San Marino</option>
									<option value="ST">Sao Tome and Principe</option>
									<option value="SA">Saudi Arabia</option>
									<option value="SN">Senegal</option>
									<option value="RS">Serbia</option>
									<option value="SC">Seychelles</option>
									<option value="SL">Sierra Leone</option>
									<option value="SG">Singapore</option>
									<option value="SX">Sint Maarten (Dutch part)</option>
									<option value="SK">Slovakia</option>
									<option value="SI">Slovenia</option>
									<option value="SB">Solomon Islands</option>
									<option value="SO">Somalia</option>
									<option value="ZA">South Africa</option>
									<option value="GS">South Georgia and the South Sandwich Islands</option>
									<option value="SS">South Sudan</option>
									<option value="ES">Spain</option>
									<option value="LK">Sri Lanka</option>
									<option value="SD">Sudan</option>
									<option value="SR">Suriname</option>
									<option value="SJ">Svalbard and Jan Mayen</option>
									<option value="SZ">Swaziland</option>
									<option value="SE">Sweden</option>
									<option value="CH">Switzerland</option>
									<option value="SY">Syrian Arab Republic</option>
									<option value="TW">Taiwan, Province of China</option>
									<option value="TJ">Tajikistan</option>
									<option value="TZ">Tanzania, United Republic of</option>
									<option value="TH">Thailand</option>
									<option value="TL">Timor-Leste</option>
									<option value="TG">Togo</option>
									<option value="TK">Tokelau</option>
									<option value="TO">Tonga</option>
									<option value="TT">Trinidad and Tobago</option>
									<option value="TN">Tunisia</option>
									<option value="TR">Turkey</option>
									<option value="TM">Turkmenistan</option>
									<option value="TC">Turks and Caicos Islands</option>
									<option value="TV">Tuvalu</option>
									<option value="UG">Uganda</option>
									<option value="UA">Ukraine</option>
									<option value="AE">United Arab Emirates</option>
									<option value="GB">United Kingdom</option>
									<option value="US">United States</option>
									<option value="UM">United States Minor Outlying Islands</option>
									<option value="UY">Uruguay</option>
									<option value="UZ">Uzbekistan</option>
									<option value="VU">Vanuatu</option>
									<option value="VE">Venezuela, Bolivarian Republic of</option>
									<option value="VN">Viet Nam</option>
									<option value="VG">Virgin Islands, British</option>
									<option value="VI">Virgin Islands, U.S.</option>
									<option value="WF">Wallis and Futuna</option>
									<option value="EH">Western Sahara</option>
									<option value="YE">Yemen</option>
									<option value="ZM">Zambia</option>
									<option value="ZW">Zimbabwe</option>
								</select>
							</div>

							<div className="field">
								<input type="text" name="zipCode" placeholder="City"  value={this.state.zipCode}  onChange={this.handleChange}/>
							</div>
						</div>
					</div>

					<div className="field">
						<div className="field">
							<input type="text" name="phoneNumber" placeholder="Phone Number"  value={this.state.phoneNumber}  onChange={this.handleChange} />
						</div>
					</div>

					<div className="grouped fields">
						<label htmlFor="fruit">Payment Type:</label>
						<div className="field">
							<div className="ui radio checkbox">
								<input type="radio" name="fruit" defaultChecked className="hidden" />
								<label>Credit Card</label>
							</div>
						</div>
					</div>

					<button type="submit" className={`large ui button green ${this.state.cartPreparing ? 'loading' : ''}`}>Complete Your Order</button>
				</form>

				<div className={`${this.state.paymentComplete ? 'hidden' : ''}`}>
					<Modal dimmer='blurring' open={open} onClose={this.close} size={`small`}>
						<Modal.Header>Complete your order <br/><small>Feel free to use the provided test values</small></Modal.Header>

						<Modal.Content>
							<Modal.Description>
								<form className="ui form" onSubmit={this.handleSubmit}>
									<div className="field cc-field">
										<label>
											<i className="credit card alternative icon"></i>
											Card Number <br/>
											<small className="color-green">Your payment details are secure</small>
										</label>

										<div className="field">
											<input type="email" name="email" placeholder="Card Number"  value={this.state.cardNumber}  onChange={this.handleChange}/>
										</div>

										<div className="field">
											<label>Owner Name</label>
											<input type="text" name="phoneNumber" placeholder="Owner Name"  value={this.state.ownerName}  onChange={this.handleChange} />
										</div>
									</div>

									<div className="field cc-field">
										<div className="field">
											<div className="three fields">
												<div className="field">
													<label>Card Expiry Month</label>
													<input type="text" name="phoneNumber" placeholder="Expiry Month"  value={this.state.expiryMonth}  onChange={this.handleChange} />
												</div>

												<div className="field">
													<label>Card Expiry Year</label>
													<input type="text" name="phoneNumber" placeholder="Expiry Year"  value={this.state.expiryYear}  onChange={this.handleChange} />
												</div>

												<div className="field">
													<label>CVV</label>
													<input type="text" name="zipCode" placeholder="CVV"  value={this.state.cvv}  onChange={this.handleChange}/>
												</div>
											</div>
										</div>
									</div>
								</form>
							</Modal.Description>
						</Modal.Content>
						<Modal.Actions>
							<Button className={this.state.paymentComplete ? 'disabled' : ''} color='black' onClick={this.close}>
								Cancel
							</Button>
							<Button onClick={this.handlePayment} className={`right floated ${this.state.processingPayment ? 'loading' : this.state.paymentComplete ? 'disabled' : ''}`} positive icon='checkmark' labelPosition='left' content="Order Now"/>
						</Modal.Actions>

						<div className={`order-successful ${!this.state.paymentComplete ? 'hidden' : ''}`}>
							<div className="ui positive message">
								<div className="header">
									<div className="header">
										Success
									</div>
									<p>Your order was successful. Please check your email for more details</p>
									<Link className="ui button black" to="/">Back to our site</Link>
								</div>
							</div>
						</div>
					</Modal>
				</div>
			</div>
		)
	}
}
