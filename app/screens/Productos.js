import React from 'react';

import { 
	Container,
	Content,
	Grid,
	Row,
	Col,
	Text,
	Card,
	CardItem,
	Body,
	View,
	Thumbnail,
	H2,
	Spinner,
	H3,
	Left,
	Button,
	Right
} from 'native-base';
import { 
	Alert,
	Dimensions,
	StatusBar,
	Image,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';

import Product from '../classes/Product'
import { store } from '../redux/store';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Connection from '../config/connection';

import { MenuProvider } from 'react-native-popup-menu';
import { PopMenu } from '../components/PopupMenu'
const moment = require('moment')
import BackHandler from 'BackHandler';

export default class Productos extends React.Component{

	static navigationOptions = {
		title: 'Mis productos',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#02A6A4" }
	}

	constructor(props){
		super(props);
		this.state = {
			products: []
		};

		store.subscribe(()=>{
			this.setState({
				...store.getState()
			});
		});
	}

	async componentWillMount(){
		let instance = new Product;
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		const { token, user } = session;

		instance.getAll(user.id, token);
		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
	}

	_loadUrlImageResource(toLoad){
		const con = new Connection();

		var url ='';
		if( Array.isArray(toLoad.images.self) && toLoad.images.self.length > 0 ){
			url = con.getProtocol()+'//'+con.getOnlyUrl()+toLoad.images.self[0].cover_url;
			
		}
		return url;
	}

	_onUpdate = (data) =>{
		let events = this.state.products.map((event) =>{
			if(event.data.id == data.id)
				return new Product(data);
			return event;
		});

		this.setState({
			products: products
		});
	}

	_onUpdatePress = (producto) =>{
		this.props.navigation.navigate('Estandar', {producto: new Product(producto), titulo: 'Editar producto', priority: producto.priority })
	}

	_onDelete = (dato) =>{

		let events = this.state.products.filter((producto, i)=>{
			return producto.id != dato.id
		});

		this.setState({
			products: events
		})
		
		del = ( dato instanceof Product ) ? dato : new Product(dato);
		del.delete();

	}



	_renderCol(dato){
		dato = ( dato instanceof Product ) ? dato : new Product(dato);
		let day = moment(dato.data.created_at).format('DD-MM-YYYY');
		return(
			<Col style={{width: "100%"}}>
				<Card>
					<CardItem>
						<Body>
							<H3 style={{fontWeight: 'bold'}}>
								{ dato.data.name }
							</H3>
							<Text note>
								{' \n'}
								<FontAwesome>{Icons.calendar}</FontAwesome> {day}
							</Text>
						</Body>
							<Right>
								<PopMenu onDelete={this._onDelete} model={'products'} onUpdatePress={this._onUpdatePress} onUpdate={this._onUpdate}  navigation={this.props.navigation} evento={dato.data} />
							</Right>
					</CardItem>
					<CardItem cardBody>
							<Image
								source={{uri: this._loadUrlImageResource(dato.data)}}
								style={{ height: 200, width: "100%", flex: 1 }}
								/>

							<View
								style={{
									position: "absolute",
									top: 130,
									bottom: 0,
									backgroundColor: "#10181B",
									width: 220,
									paddingLeft: 9,
									paddingTop: 3
								}}
							>
							<Text style={{color: "#ffffff", fontWeight: 'bold', marginLeft: 3}} >
								{dato.data.description}
							</Text>
							</View>
					</CardItem>
					<CardItem>
						<Left>
							<Button transparent>
								<Text style={{fontWeight: 'bold', fontSize: 15, color: "#02A6A4"}}>
									$ {dato.data.price}
								</Text>
							</Button>
						</Left>
						<Body>
							<Button transparent>
								<Text>
									<FontAwesome style={{fontSize: 20, color: "#02A6A4"}}>{Icons.bookmark}</FontAwesome>
									<Text style={{fontWeight: 'bold', fontSize: 15, color: "#02A6A4"}}>{' '+dato.data.category}</Text>
								</Text>
							</Button>
						</Body>
					</CardItem>
				</Card>
			</Col>
		);
	}

	_renderCards(){
		let { products } = this.state;
		if( products.length >0){
			const cards = products.map( ( dato, i ) =>{

				return <Row>{this._renderCol( dato )}</Row>
			});
			return cards;
		}
		else{
			const cards2 = <Spinner color={'#02A6A4'} />
			return cards2;
		}

		
	}

	render(){
		const { width, height } = Dimensions.get('screen')
		
		return(
			<MenuProvider>
			<View style={styles.container}>
				<StatusBar translucent backgroundColor={'#02A6A4'} />
				<Content>
					{this._renderCards()}
				</Content>
			</View>
			</MenuProvider>
		);
	}

}

const styles = {
	container: {
		backgroundColor: "#111111",
		flex: 1,
	}
}