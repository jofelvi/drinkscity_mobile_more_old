import React from 'react';
import {
	View,
	Container,
	Content,
	Grid,
	Row,
	Col,
	H2,
	Spinner,
	List,
	ListItem,
	Text,
	Right,
	Left,
	Body,
	Form,
	Item,
	Picker,
	Label,
	Input,
	CheckBox
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	Image,
	TouchableOpacity,
	Alert,
	AsyncStorage,
	ScrollView,
	PermissionsAndroid,
	View as ModalView,
	StyleSheet
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';

import {
	Thumbnail,
	Button
} from 'native-base'

import Connection from '../config/connection';
import Model from '../classes/Model'
import BackHandler from 'BackHandler';
import Cropper from '../classes/Cropper';
import FontAwesome, {Icons} from 'react-native-fontawesome';

import GooglePlacesInput from '../components/Autocomplete';
import Modal from "react-native-modal";

const moment = require('moment');
const ImagePicker = require('react-native-image-picker');
var options = {
	title: 'Seleccionar imagen',
  	cancelButtonTitle: 'Cancelar',
  	takePhotoButtonTitle: 'Tomar desde la camara',
  	chooseFromLibraryButtonTitle: 'Elegir una desde la galeria',
	storageOptions: {
		skipBackup: true,
		path: 'images'
	}
}

export default class StoreRegister extends React.Component{

	static navigationOptions = {
		title: 'Registro de tienda',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	}


	constructor(props){
		super(props);

		const { user } = this.props.navigation.state.params;

		this.state = {
			logo: '',
			images: [],
			portada_name: '',
			perfil_name: '',
			statusBarColor: "#02A6A4",
			statusBarStyle: 'default',
			currentRegion: {
				latitude: 37.78825,
				longitude: -122.4324,
				latitudeDelta: 0.015,
				longitudeDelta: 0.0121,
			},
			markers: [],
			longitude: '--',
			latitude: '--',
			name: '',
			address: '',
			kind: 0,
			status: 1,
			delivery: false,
			rut: '',
			phone: '',
			email: '',
			region: '',
			description: '',
			days_opened: '',
			time_opened: '',
			legal_agent: '',
			legal_agent_rut: '',
			legal_agent_phone: '',
			legal_agent_email: '',
			user_id: user.id,
			salvar: false
		}
		navigator.geolocation.getCurrentPosition(
		    (position) => {
		    	var { markers } = this.state;
		    	markers[0] = this.regionFrom(
		        		position.coords.latitude, 
		        		position.coords.longitude, 
		        		position.coords.accuracy
		        	);
		    	markers[1] = { ...markers[0] };
		        this.setState({
		        	markers: markers,
		        	currentRegion: {
		        		...markers[0]
		        	}, 
		        	longitude:  markers[0].longitude,
		        	latitude: 	markers[0].latitude
		        })

		       	//Alert.alert("coords", "longitud: "+position.coords.longitude+' Longitud State: '+this.state.currentRegion.longitudeDelta+' latitude: '+position.coords.latitude+' accuracy: '+position.coords.accuracy)
		    },
		    (error) => alert(error.message),
		    {enableHighAccuracy: false, timeout: 40000, maximumAge: 20000}
		);
	}

	async salvar(){
		const con =new Connection();
		const model = new Model;

		if(this.state.images.length == 0){
			delete this.state.images;
		}
		if(this.state.logo == ''){
			delete this.state.logo;
		}
		const body = '{ "store" : '+JSON.stringify(this.state)+' }';

		resp = await fetch( con.getUrlApi('stores'), {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				Accept: 'json'
			},
			body
		}).then( data =>{
			this.setState({ salvar: false });
			if(data.status == '200' || data.status == 200 || data.status == '201' || data.status == 201){

				Alert.alert('Proceso correcto', 'El proceso se ha realizado de manera correcta', [
					{
						text: 'Aceptar',
						onPress: ()=> { this.props.navigation.goBack(); }
					}
				]);
			}
		} );
	}

	componentWillMount(){

		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());	
	}



	regionFrom(lat, lon, accuracy) {
	    const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
	    const circumference = (40075 / 360) * 1000;

	    const latDelta = accuracy * (1 / (Math.cos(lat) * circumference));
	    const lonDelta = (accuracy / oneDegreeOfLongitudeInMeters);
	    return {
	      latitude: lat,
	      longitude: lon,
	      latitudeDelta: Math.max(0, latDelta),
	      longitudeDelta: Math.max(0, lonDelta),
	    };
	}

	_onDragMarker(coords){
		const { coordinate } = coords.nativeEvent;
		this.setState({
			latitude:  coordinate.latitude,
			longitude: coordinate.longitude
		})
	}

	_renderMarkers(){
		let {markers} = this.state;


		const marks = markers.map((data, i) =>{
			if( i > 0)
			{
				return <Marker 
						draggable={ (i > 0) } 
						onDragEnd={ coords =>{this._onDragMarker(coords)} } 
						coordinate={{...data}}
					/>
			}
		});

		return marks;
	}
	_onImageSelect = (response) =>{

		if(response.didCancel){
			console.log('CANCELADA');
		}
		else{
			
			const crop = new Cropper();
			let img = null;
			img = crop.cropping(response.path, 300, 400);
			setTimeout(()=>{
				//'data:image/jpeg;base64,'+img._55.data
				this.setState(prevState=>{
					let imagen = 'data:image/jpeg;base64,'+img._55.data;
					if(this.state.img_kind == 1){
						prevState.logo = imagen;
					}
					else{
						prevState.images.push(imagen);
					}
					return prevState;
				});
			}, 3000);
		}
	}

	_onPressPositionMap(coord){
		var { coordinate } = coord.nativeEvent
		var { markers } = this.state
		markers[1] = {longitude: coordinate.longitude, latitude: coordinate.latitude};
		this.setState({
			markers: markers,
			longitude: coordinate.longitude,
			latitude: coordinate.latitude
		});
	}

	region(){
		const { markers } = this.state;
		if(markers.length > 1){

			var coords = markers[1];
			return {
				...coords
			};
		}

		return {
			...this.state.currentRegion
		}

	}
	getGoogleDescription = (data, details) =>{
		this.setState({
			address: data.description
		});
		Alert.alert('DEBUG-ADDRESS', JSON.stringify(data));
	}

	render(){
		const { width, height } = Dimensions.get('screen')
		return(
			<View style={styles.container}>
				<StatusBar translucent backgroundColor={'#02A6A4'} />
				<Container>


				<ModalView>
			        <Modal isVisible={this.state.togleModal} backdropColor={'transparent'} >
			          <View style={{ flex: 1, position: 'relative' }}>
			            <TouchableOpacity 
			            	style={{
			            		alignSelf: "flex-end"
			            	}}
			            	onPress={()=>{
			            		this.setState({togleModal: !this.state.togleModal});
			            		this.setState({ 
			            			statusBarColor: "#02A6A4"
			            		});
			            	}}
			            >
			            	<Text>
			            		<FontAwesome style={{fontSize: 26}}>{Icons.close}</FontAwesome>
			            	</Text>
			            </TouchableOpacity>
					      <View style ={styles.containerMap}>
					        <MapView
					          style={styles.map}
					          initialRegion={this.state.currentRegion}
					          onPress={ point => this._onPressPositionMap(point)  }
					        >
								<Marker   
									coordinate={{...this.state.currentRegion}}
								/>
					        	{this._renderMarkers()}
					        </MapView>
					      </View>
			          </View>

			        </Modal>
		      	</ModalView>
					<Content>
						<Form>
							<Grid>
								<Row>
									<Col style={{width: "95%"}}>
										<H2 style={{color: "#02A6A4", marginLeft: 14, marginTop: 4}} >Datos de la Tienda</H2>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Nombre de la Tienda</Label>
										<Input  onChangeText={text => this.setState({ name: text }) } value={this.state.name} style={{color: "#ffffff"}} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Reseña de la Tienda</Label>
										<Input onChangeText={text=>{ this.setState({ description: text }) }} style={{color: "#ffffff"}} multiline numberOfLines={3} />
									</Item>
									</Col>

								</Row>
								<Row style={{ marginTop: 10 }}>
									<Col style={{width: "95%", marginLeft: "2%"}}>
										<Label style={{ color: "#ffffff", marginLeft: 7 }}>Ciudad</Label>
										<Picker
											 style={{color: "#ffffff"}}
											 onValueChange={value=> { this.setState({ region : value }); }}
											 selectedValue={this.state.region}
										>
											<Item style={{color: "#ffffff"}}  label={'Seleccione una Ciudad'} value={''} />
											
											<Item  style={{color: "#ffffff"}} label={'Arica y parinacot'} value={'arica_y_parinacota'} />
											<Item  style={{color: "#ffffff"}} label={'Tarapaca'} value={'tarapaca'} />
											<Item  style={{color: "#ffffff"}} label={'Antofagasta'} value={'antofagasta'} />
											<Item  style={{color: "#ffffff"}} label={'Atacama'} value={'atacama'} />
											<Item  style={{color: "#ffffff"}} label={'Coquimbo'} value={'coquimbo'} />
											<Item  style={{color: "#ffffff"}} label={'Valparaiso'} value={'valparaiso'} />
											<Item  style={{color: "#ffffff"}} label={'Area metropolitana de Santiago'} value={'metropolitana_de_santiago'} />
											<Item  style={{color: "#ffffff"}} label={'Libertador general Bernardo o Higgins'} value={'libertador_general_bernardo_o_higgins'} />
											<Item  style={{color: "#ffffff"}} label={'Maule'} value={'maule'} />
											<Item  style={{color: "#ffffff"}} label={'Biobio'} value={'biobio'} />
											<Item  style={{color: "#ffffff"}} label={'La Araucania'} value={'la_araucania'} />
											<Item  style={{color: "#ffffff"}} label={'Los Lagos'} value={'los_lagos'} />
											<Item  style={{color: "#ffffff"}} label={'Aisen del general Carlos Ibanez del Campo'} value={'aisen_del_general_carlos_ibanez_del_campo'} />
											<Item  style={{color: "#ffffff"}} label={'Magallanes y dela antartica Chilena'} value={'magallanes_y_de_la_antartica_chilena'} />
										
										</Picker>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "47%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Rut de la Tienda</Label>
										<Input onChangeText={ value => { this.setState({ rut: value }) } } style={{color: "#ffffff"}} />
									</Item>
									</Col>
									<Col style={{width: "47%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Telefono de la Tienda</Label>
										<Input onChangeText={text => { this.setState({ phone: text }) }} style={{color: "#ffffff"}} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "47%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Dias Laborales</Label>
										<Input onChangeText={ value => { this.setState({  days_opened : value }) } } style={{color: "#ffffff"}} />
									</Item>
									</Col>
									<Col style={{width: "47%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Horas de Apertura</Label>
										<Input onChangeText={text => { this.setState({ time_opened: text }) }} style={{color: "#ffffff"}} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
										<Label style={{ color: "#ffffff", marginLeft: 14 }}>Direccion de la Tienda</Label>
										<View style={{marginLeft: 14, alignSelf: "center", alignContent: "center", alignItems: "center"}} >
											<GooglePlacesInput onDirectionSelect={this.getGoogleDescription} />
										</View>
									</Col>

								</Row>
								<Row>
									<Col style={{width: "95%"}}>
										<H2 style={{color: "#02A6A4", marginLeft: 14, marginTop: 4}} >Datos del Representante</H2>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Representante Legal de la Tienda</Label>
										<Input onChangeText={text=> { this.setState({ legal_agent: text }) } }  style={{color: "#ffffff"}} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "90%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Correo del Representante Legal de la Tienda</Label>
										<Input  onChangeText={ text=>{ this.setState({ legal_agent_email: text }) } } style={{color: "#ffffff"}} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "47%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Rut del Representante</Label>
										<Input  onChangeText={ text=>{ this.setState({ legal_agent_rut: text }) } } style={{color: "#ffffff"}} />
									</Item>
									</Col>
									<Col style={{width: "47%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Tlfno / Rep.</Label>
										<Input  onChangeText={ text=>{ this.setState({ legal_agent_phone: text }) } } style={{color: "#ffffff"}} />
									</Item>
									</Col>
								</Row>
								<Row style={{marginTop: 7, marginBottom: 4}}>	
									<Col style={{width: "9%"}}>
										<CheckBox checked={this.state.delivery} onPress={()=>{ this.setState({ delivery: !this.state.delivery }) }} />
									</Col>
									<Col>
										<Text style={{color: "#ffffff"}}>
											Tiene delivery
										</Text>
									</Col>
								</Row>	
								<Row>
									<Col style={{width: "100%"}}>
										<Button 
											onPress={()=>{ this.setState({salvar:true}); this.salvar(); } } 
											block 
											style={{marginTop: 9, marginBottom:9, backgroundColor: "#02A6A4"}} 
											disabled={this.state.salvar}
										>
											<Text> 
												{this.state.salvar ? 'Cargando...':'Terminar registro'}
											</Text>
										</Button>
									</Col>
								</Row>
							</Grid>
						</Form>
					</Content>
				</Container>
			</View>
		);
	}

}

const styles = {
	container: {
		backgroundColor: "#111111",
		flex: 1,
	},
	  containerMap: {
	    ...StyleSheet.absoluteFillObject,
	    height: 400,
	    width: 400,
	    justifyContent: 'flex-end',
	    alignItems: 'center',
	    marginTop: "10%"
	  },
	  map: {
	    ...StyleSheet.absoluteFillObject,
	  },
}