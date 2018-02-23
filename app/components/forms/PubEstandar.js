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
	AsyncStorage
} from 'react-native';
import Publicacion from '../../classes/Publicacion';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Product from '../../classes/Product'
import Cropper from '../../classes/Cropper';
import Connection from '../../config/connection'
var ImagePicker = require('react-native-image-picker');

const moment = require ('moment');

var options = {
  title: 'Cargar imagenes',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class PubEstandar extends React.Component{
	constructor(props){
		super(props);

		var producto = (this.props.producto) 
						? this.props.producto 
						: {images: new Array(), user_id: 2, store_id: '', priority: this.props.priority, stock: 0, name: '', category: 0, description: '', price: 0.00, start_datetime: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'), end_datetime: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD') };
		
		producto.images = ( producto.images.self != undefined )? producto.images.self : producto.images;		
		pub = new Product(producto);
		this.state = {
			images: [],
			...producto,
			stores: [],
			pub,
			con: new Connection()
		};

	}

	async componentWillMount(){
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		this.setState({
			stores: session.stores
		});
	}

	async componentDidMount(){
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		let { store } = session;
		this.setState({
			store_id: this.state.pub.setAttribute('store_id', store.id)
		});
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
				 
				
				this.state.pub.setAttribute('images', this.state.images);
			}
			
		});
	}

	_renderButton(){
		return (
			<Col>
				<TouchableOpacity 
								
					style={{
						backgroundColor: "#02A6A4",
						width: 170,
						alingSelf: "center",
						alignContent: "center",
						marginTop: 9
						}}
				>
					<FontAwesome style={{color: "#ffffff", fontSize: 52, textAlign: "center"}}>{Icons.camera}</FontAwesome>
								
				</TouchableOpacity>
			</Col>
		)
	}

	_validFormDate(date){
		var format = moment(date, 'YYYY-MM-DD');
		var format2 = moment(date, 'YYYY-MM-DD HH:MM:SS')

		if(format.isValid() || format2.isValid()){
			return format.format('YYYY-MM-DD HH:MM:SS');
		}
		return moment(new Date(), 'YYYY-MM-DD HH:MM:SS').format('YYYY-MM-DD HH:MM:SS')
	}

	_renderImages(){
		let { images } = this.state;
		let items = null;
			items = images.map( (data, i)=>{

				return (
					<Col>
						<View style={{flex: 1, width: 150, height: 150, marginTop: 10, marginBottom: 3}}>
							<Thumbnail 
								square  
								style={{
									width: 150,
									height: 160
								}}
								source={{uri: (data.cover_url != undefined ) ? this.state.con.getProtocol()+'//'+this.state.con.getOnlyUrl()+data.cover_url : data }} 
							/>
							<View style={{flex:1, position: 'absolute', top: 0, right: 0}}>
								<Button 
									rounded 
									danger 
									style={{elevation: 3, position: "absolute", right: 3}}
									onPress={()=>{
										let notDeletes = this.state.images.filter( (image, k) =>{
											return k != i;
										});
										this.setState({ images: notDeletes  });
										this.state.pub.setAttribute('images', this.state.images);

									}}
								>
									<Text>
										<FontAwesome style={{color: "#ffffff", fontSize: 15}}>{Icons.close}</FontAwesome>
									</Text>
								</Button>
							</View>
						</View>
					</Col>
				);
			});
		
			return items;
		
	}

	render(){
		return(
			<View>
				<Content>
					<Form>
						<Grid>
						<Row style={{marginLeft: 7}}>
							{this._renderImages()}
						</Row>
						<Row style={{marginLeft: 7}}>

							<Col>
								<TouchableOpacity 
									onPress={()=>{
										this.takePhoto()
									}}
									style={{
										backgroundColor: "#02A6A4",
										width: "97%",
										alignSelf: "center",
										alignContent: "center",
										marginTop: 9
									}}
								>
									<FontAwesome style={{color: "#ffffff", fontSize: 52, textAlign: "center"}}>{Icons.pictureO}</FontAwesome>
									
								</TouchableOpacity>
							</Col>
						</Row>
						<Row>
							<Col style={{width: "98%"}}>
								<Item floatingLabel>
									<Label 
										style={{ color: this.props.color }} >Titulo del aviso
									</Label>
									<Input 
										style={{ color: this.props.color }} 
										onChangeText={ text =>{this.state.pub.setAttribute('name',text); this.setState({name: text}) }} 
										value={this.state.name} 
									/>
								</Item>
							</Col>
						</Row>
						<Picker
							mode='dropdown'
							onValueChange={value => { this.state.pub.setAttribute('category', value); this.setState({category: value}); }}
							style={{ color: this.props.color }}
							selectedValue={this.state.category}
						>
							<Item style={{color: this.props.color }} label='Licores' value={0} /> 
							<Item style={{color: this.props.color }} label='Cervezas' value={1} />
							<Item style={{color: this.props.color }} label='Vinos' value={2} />
							<Item style={{color: this.props.color }} label='Tragos preparados' value={3} />
							<Item style={{color: this.props.color }} label='Insumos' value={4} />
							<Item style={{color: this.props.color }} label='Habitaciones' value={5} />
							<Item style={{color: this.props.color }} label='Comida' value={1} />
						</Picker>
						<Row>
							<Col style={{width: "98%"}}>
								<Item floatingLabel>
									<Label style={{ color: this.props.color }}>Detalles</Label>
									<Input  style={{ color: this.props.color }} value={this.state.description} onChangeText={text=>{ this.setState({description: this.state.pub.setAttribute('description', text)}); }} multiline={true} numberOfLines={4} />
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{ width: "49%" }} >
								<Item floatingLabel>
									<Label style={{ color: this.props.color }}>Stock</Label>
									<Input 
										style={{ color: this.props.color }} 
										onChangeText={ stock =>{ this.setState({ stock: this.state.pub.setAttribute('stock', stock) }) }}  
										value={this.state.stock}
									/>
								</Item>
							</Col>
							<Col style={{width: "49%"}}>
								<Item floatingLabel>
									<Label style={{ color: this.props.color }}>Precio $</Label>
									<Input 
										style={{ color: this.props.color }} 
										onChangeText={ price =>{ this.setState({ price: this.state.pub.setAttribute('price', price) }) }}  
										value={this.state.price}
									/>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{width: "49%"}}>
								<Item floatingLabel>
									<Label style={{ color: this.props.color }}>Fecha y hora de inicio</Label>
									<Input 
										style={{ color: this.props.color }} 
										onChangeText={ start_datetime =>{ this.setState({ start_datetime: this.state.pub.setAttribute('start_datetime', this._validFormDate(start_datetime)) }) }}  
										value={moment(this.state.start_datetime, 'YYYY-MM-DD').format('YYYY-MM-DD')}
									/>
								</Item>
							</Col>
							<Col style={{width: "49%"}}>
								<Item floatingLabel>
									<Label style={{ color: this.props.color }}>Fecha y hora de fin</Label>
									<Input 
										style={{ color: this.props.color }} 
										onChangeText={ end_datetime =>{ this.setState({ end_datetime: this.state.pub.setAttribute('end_datetime', this._validFormDate(end_datetime)  ) }); }}  
										value={ moment(this.state.end_datetime, 'YYYY-MM-DD').format('YYYY-MM-DD HH:MM:SS')}
									/>
								</Item>
							</Col>
						</Row>
					</Grid>
					</Form>
					</Content>

					<Button onPress={()=>{ this.state.pub.push(this.props.navigation) }}  block style={{ backgroundColor: "#02A6A4", marginBottom: 52 }}>
						<Text style={{color: this.props.color}}>PUBLICAR</Text>
					</Button>
				
			</View>
		);
	}
}