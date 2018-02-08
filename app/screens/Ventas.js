import React, { Component } from 'react';
import {
	View,
	Container,
	Content,
	Button,
	Text,
	Col,
	Row,
	Grid,
	List,
	ListItem,
	Body,
	Right,
	Left,
	H2,
	Thumbnail
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert,
	ScrollView,
	TouchableHighlight
} from 'react-native';

import Product from '../classes/Product';
import Model from '../classes/Model';
import { store } from '../redux/store';
import FontAwesome, { Icons } from 'react-native-fontawesome';

const moment = require('moment')
var BackHandler = require('BackHandler');

export default class Ventas extends Component{
	
	static navigationOptions = {
		title: 'Creacion de eventos',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#02A6A4" }
	}

	constructor(props){
		super(props);
		this.state = {
			products: [],
			pagadas: 0,
			validadas: 0,
			total: 0
		}

		store.subscribe( ()=>{
			this.loadProducts(store.getState().products);
		});
	}

	async loadProducts(products = undefined ){
		if(typeof(products) == 'object' && products !== undefined){
			let orders = await Model.getWithId('orders', null,this.props.navigation);
			let existing_products = await Model.getWithId('products');

			orders = ( typeof(orders) == 'string' ) 
					? JSON.parse(orders) 
					: orders;

			this.toState(orders, 'orders');
			existing_products = ( typeof(existing_products) == 'string' ) 
					? JSON.parse(existing_products) 
					: existing_products;

			let products = [];

			existing_products.map((product, i)=>{
				products[product.id] = product;
				products[product.id].validates = 0;
			});


			this.toState(existing_products, "products");

			this.calculate();
		}
	}

	toState( data = [], state = 'products' ){
		eval(`
			this.setState({
				${state}: data
			})
		`);
	}

	calculate(){
		var { products, orders } = this.state;
		var countPerItem = [];
		orders.map( (order, i)=>{

			if(order.order_status_id == 4){
				this.setState({ validadas: ( this.state.validadas + 1 ) });
		
				order.order_items.map( (item)=>{
					products[item.product_id].validates = ( products[item.product_id].validates  + 1);
				});

				this.setState({
					products: products
				});
			}
			

		});
	}

	componentWillMount(){

		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
		let instance = new Product;
		instance.allToRedux();		
	}

	_renderList(){
		const { products, validadas } = this.state;
		let item = null;
		if(products.length > 0){
			item = products.map((product, i)=>{
				if(product !== null){
					return(
						<ListItem>
							<Left>
								<Text style={{color :"#ffffff"}}>
									{product.name}
								</Text>
							</Left>
							<Body/>
							<Right>
								<Text style={{color: "#ffffff"}} >
									Total: {product.validates}
								</Text>
							</Right>
						</ListItem>
					);
				}
			});
		}
		return item;
	}

	render(){
		const { width } = Dimensions.get('window')
		return(
			<View style={styles.container}>
				<StatusBar translucent backgroundColor={'#02A6A4'} />	
				<Container>

					<Row>

						<Row  style={{alignSelf: "center", alignItems: "center", alignContent:"center"}}>
							<Grid>
								<Col style={{alignItems: "center", justifyContent: "center"}}>
									<TouchableHighlight style={{alignSelf: "center", alignItems: "center", alignContent:"center"}}>
										<Thumbnail
											square 
											source={require('../assets/img/cafe.jpeg')} 
											style={{
												minWidth: 200,
												minHeight: 200,
												maxWidth: 200,
												maxHeight: 200
											}}
										/>
									</TouchableHighlight>
								</Col>
							</Grid>
						</Row>
					</Row>
						<Row style={{flex: 1, height: 12, marginTop: "12%"}}>
							<Col style={{ justifyContent: "center", height: 22, backgroundColor: "green" ,alignContent: "center" ,alignItems: "center"}}>
								<Text style={{color:"#ffffff"}}>
									Pagadas
								</Text>
							</Col>
							<Col style={{ backgroundColor: "blue" , height: 22, justifyContent: "center", alignContent: "center" ,alignItems: "center"}}>
								<Text style={{color:"#ffffff"}}>
									validadas
								</Text>
							</Col>
							<Col style={{ justifyContent: "center", height: 22, alignContent: "center" ,alignItems: "center"}}>
								<Text style={{color:"#ffffff"}}>
									Total
								</Text>
							</Col>
						</Row>
					<Row style={{marginTop: "-30%", height: 270}}>
						<Col style={{flex: 1, height: 270}}>
						<ScrollView>
							<List>
								{this._renderList()}
							</List>
						</ScrollView>
						</Col>
					</Row>

				</Container>
			</View>
		);
	}
}

const styles = {
	container: {
		backgroundColor: "#111111",
		flex: 1,
	}
}