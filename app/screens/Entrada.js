import React from 'react';

import {
	View,
	Container,
	Content,
	Button,
	Text,
	Form,
	Item,
	Input,
	Label,
	List,
	ListItem,
	Picker,
	Grid,
	Row,
	Col,
	Thumbnail
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert,
	Image,
	ScrollView,
	AsyncStorage,
	Keyboard
} from 'react-native';
import Publicacion from '../classes/Publicacion';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Ticket from '../classes/Ticket'
import Cropper from '../classes/Cropper';
import Connection from '../config/connection'
var ImagePicker = require('react-native-image-picker');
import DateTimePicker from 'react-native-modal-datetime-picker';


var BackHandler = require('BackHandler')
const moment = require ('moment');

var options = {
  title: 'Cargar imagenes',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class Entrada extends React.Component{


	static navigationOptions = ({navigation}) => ({
		title: `ENTRADAS`,
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" },
	});


	constructor(props){
		super(props);
		pub = new Ticket();
		this.state = {
			stores: [],
			pub,
			con: new Connection(),
			showPicker: false,
			from: '',
			ref_startdatetime: null,
			ref_enddatetime: null,
			event: null,
			savePress: false
		};

	}
	async takePhoto(){
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				let source = { uri: response.uri };
				let format = {
					filename: response.fileName,
					content: response.data,
					content_type: 'image/jpeg'
				};
				let image = this.state.images;
				const crop = new Cropper();
				//image[ (image.length) ] = 'data:image/jpeg;base64,' +  response.data

				let b64Crop = crop.cropping(response.path, 600, 500);

				setTimeout(()=>{
						image[ (image.length) ] = 'data:image/jpeg;base64,' + b64Crop._55.data; 

						this.setState({
							images: image
						});
				}, 3000)
				 
				
				this.setState({
					images: this.state.images
				});
			}
			
		});
	}

	async saveTicket(){
		let con = new Connection();
		let { event } = this.props.navigation.state.params;
		let session = await AsyncStorage.getItem('@session');
		let { token } = await JSON.parse(session);

		let body= `{ "ticket": { "name": "${this.state.name}", "price": ${this.state.price}, "stock": ${this.state.stock}, "event_id": ${event.data.id} } } `;
		let request =await fetch( con.getUrlApi('tickets'), {
			method: 'POST',
			headers: {
				Authorization:token.token,
				'Content-Type': 'application/json',
				Accept: 'json'
			},
			body
		} ).then(resp => {
			if(resp.status == 200 || resp.status== '200' || resp.status == 201 || resps.status == '201'){
				Alert.alert('Confirmacion', 'La entrada ha sido creada de manera correcta',[
					{
						text: 'Aceptar',
						onPress: ()=>{ this.props.navigation.goBack(); }
					}
				]);
			}
		});
		this.setState({
			savePress: false
		});
	}

	async componentWillMount(){
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		let { state } = this.props.navigation
		this.setState({
			event: state.params.event
		});
		//Alert.alert('D-2', JSON.stringify(state.params.event.data))
	}


	async componentDidMount(){

		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		let { store } = session;
		
	}
	_hideDateTimePicker = () => this.setState({ showPicker: false });

	_handleDatePicked = (date) => {
		let dateParser = ( typeof(date) == 'object' ) ? date: JSON.parse(date);
	   switch(this.state.from){
	   		case 'start_datetime': {
	   			this.setState({ start_datetime: moment(date, 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS') });
	   			break;
	   		}
	   		case 'end_datetime':{
	   			this.setState({ end_datetime: moment(date, 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS') })
	   			break;
	   		}
	   }
	   this._hideDateTimePicker();
	};
	render(){
		return(
			<View style={styles.container}>
				<Content>
					<Form>
						<Grid>
						<Row>
							<Col style={{width: "98%"}}>
								<Item floatingLabel>
									<Label 
										style={{ color: "#ffffff" }} >Nombre de la entrada
									</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ text =>{this.state.pub.setAttribute('name',text); this.setState({name: text}) }} 
										value={this.state.name} 
									/>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{ width: "49%" }} >
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>Stock</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ stock =>{ this.setState({ stock: this.state.pub.setAttribute('stock', stock) }) }}  
										value={this.state.stock}
									/>
								</Item>
							</Col>
							<Col style={{width: "49%"}}>
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>Precio $</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ price =>{ this.setState({ price: this.state.pub.setAttribute('price', price) }) }}  
										value={this.state.price}
									/>
								</Item>
							</Col>
						</Row>
					      <View style={{ flex: 1 }}>
					        <DateTimePicker
					          isVisible={this.state.showPicker}
					          onConfirm={this._handleDatePicked}
					          onCancel={this._hideDateTimePicker}
					          mode={'datetime'}
					        />
					      </View>
					</Grid>
					</Form>
					</Content>

					<Button 
						onPress={()=>{
							this.setState({ savePress: true })
							if(this.props.navigation.state.params.action == 'POST'){
								this.setState({
									tickets_attributes: this.state.event.setAttribute('tickets_attributes', [this.state.pub.data])
								})
								//Alert.alert('D-3', JSON.stringify(this.state.event.data));
						 		this.state.event.push(this.props.navigation, 'POST'); 
							}
						 	else{
						 		this.saveTicket();
								//Alert.alert('D-3', JSON.stringify(event.data.tickets));
						 	}
						}}  
						block 
						disabled={this.state.savePress}
						style={{ backgroundColor: "#02A6A4", marginBottom: 52 }}
					>
						<Text style={{color: "#ffffff"}}> { this.state.savePress ? 'CARGANDO ...' : 'PUBLICAR' } </Text>
					</Button>
				
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