import React from 'react';
import {
	Row,
	Grid,
	Container,
	Content,
	Col,
	Text,
	View,
	Input,
	Form,
	Item,
	Picker,
	Label,
	Button,
	Thumbnail
} from 'native-base';

import {
	Alert,
	TouchableOpacity,
	ScrollView,
	WebView,
	StatusBar,
	StyleSheet,
	AsyncStorage,
	PermissionsAndroid
} from 'react-native'
import MapView, { Marker } from 'react-native-maps';

import Event from '../../classes/Event';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Modal from "react-native-modal";

const moment = require('moment');

var ImagePicker = require('react-native-image-picker');
var options = {
  title: 'Cargar imagenes',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class FormEvent extends React.Component{


	static navigationOptions = {
		title: 'Crear evento',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#02A6A4" }
	}


	constructor(props){
		super(props);

		const { navigation } = this.props;

		let event = (navigation.state.params.evento != false) 
					? navigation.state.params.evento
					: new Event({
						'name' : '', 
						'category' :'',
						'address': '',
						'video_link': '',
						'start_datetime': moment((new Date()), 'YYYY-MM-DD').format('YYYY-MM-DD'),
						'end_datetime': moment((new Date()), 'YYYY-MM-DD').format('YYYY-MM-DD'),
						'description': '',
						'user_id': 1,
						'store_id': 2,
						'active': '',
						'longitude': '-',
						'latitude': '-',
						'priority': navigation.state.params.priority
					});

		this.state = {
			...event.data,
			event: event,
			meth: (navigation.state.params.evento != false)  ? 'PUT' : 'POST',
			togleModal: false,
			statusBarColor: "#02A6A4",
			statusBarStyle: 'default',
			currentRegion: {
				latitude: 37.78825,
				longitude: -122.4324,
				latitudeDelta: 0.015,
				longitudeDelta: 0.0121,
			},
			markers: [],
			stores: []
		}
		this.componentWillMount()

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

	async componentWillMount(){
		try{
			const permission = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
					'title': 'Solicitud de permisos para el uso de geolocalizacion',
					'message': `Esta app requiere de permisos especiales para el uso de geolocalizacion`
				}
			);
			if(permission === PermissionsAndroid.RESULTS.DENIED ){
				this.props.navigation.goBack();
			}
		}catch(err){
			console.log(err);
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
		        	longitude: this.state.event.setAttribute('longitude', markers[0].longitude),
		        	latitude: this.state.event.setAttribute('latitude', markers[0].latitude)
		        })
		    },
		    (error) => alert(error.message),
		    {enableHighAccuracy: false, timeout: 40000, maximumAge: 20000}
		);

		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);
		this.setState({
			stores: session.stores
		});
	}

	_onDragMarker(coords){
		const { coordinate } = coords.nativeEvent;
		this.setState({
			latitude: this.state.event.setAttribute('latitude', coordinate.latitude),
			longitude: this.state.event.setAttribute('longitude', coordinate.longitude)
		})
	    this._getDirection( 
		    { lat: this.state.latitude, lon: this.state.longitude }, 
		    { lat: this.state.latitude, lon: this.state.longitude } 
		);
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

	_showVideoByLink(link = null){
		let video = new String(link);
		let id =  video.split('watch?v=');
		return 'https://youtube.com/embed/'+id[1];
	}

	async _getDirection(origin = null, destination = null){
		this.setState({
			address: 'Cargando direccion...'
		})
		if(origin != null & destination != null){
			fetch(`https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyDVY2in9_CGre6PDYzILjfi_YCSNrgLQRo&origin=${origin.lat+','+origin.lon}&destination=${destination.lat+','+destination.lon}`,{

			}).then(data => {
				let { _bodyInit } = data;
				_bodyInit = ( typeof(_bodyInit) == 'string' ) ? JSON.parse(_bodyInit): _bodyInit;
				let destination = _bodyInit.routes[0].legs[0];
				this.setState({
					address: this.state.event.setAttribute('address', destination.end_address)
				});
			});
	    }else{
	    	this.setState({
	    		address: 'Cargando direccion...'
	    	})
	    }
	}

	_onPressPositionMap(coord){
		var { coordinate } = coord.nativeEvent
		var { markers } = this.state
		markers[1] = {longitude: coordinate.longitude, latitude: coordinate.latitude};
		this.setState({
			markers: markers,
			longitude: this.state.event.setAttribute('longitude', coordinate.longitude),
			latitude: this.state.event.setAttribute('latitude', coordinate.latitude)
		});
	    this._getDirection( 
		    { lat: coordinate.latitude, lon: coordinate.longitude }, 
		    { lat: coordinate.latitude, lon: coordinate.longitude } 
		);
	}

	region(){
		const { markers } = this.state;
		if(markers.length > 1){
			var coords = markers[0];
			return {
				...coords
			};
		}

		return {
			...this.state.currentRegion
		}

	}

	render(){

		return(
			<View style={styles.container}>
				<StatusBar backgroundColor={this.state.statusBarColor} />
				<ScrollView>
					<Form>
						<Item floatingLabel>
							<Label 
								style={{ color: "#ffffff" }} >Titulo del aviso
							</Label>
							<Input 
								style={{ color: "#ffffff" }} 
								onChangeText={ text =>{this.state.event.setAttribute('name',text); this.setState({name: text}) }} 
								value={this.state.name} 
							/>
						</Item>
						<Picker
							mode='dropdown'
							onValueChange={value => { this.state.event.setAttribute('category', value); this.setState({category: value}); }}
							style={{ color: "#ffffff" }}
							selectedValue={this.state.category}
						>
							<Item style={{color: "#ffffff" }} label="Categoria" value={''} />
							<Item style={{color: "#ffffff" }} label="Electronica" value={"electronica"} />
							<Item style={{color: "#ffffff" }} label='Evento cultural' value={'evento_cultural'} />
							<Item style={{color: "#ffffff" }} label='Otros' value={'otros'} /> 
						</Picker>
						<Picker
							mode='dropdown'
							onValueChange={value => { this.state.event.setAttribute('store_id', value); this.setState({store_id: value}); }}
							style={{ color: this.props.color }}
							selectedValue={this.state.store_id}
							style={{color:"#ffffff"}}
						>
							<Item style={{color: "#ffffff" }} label="Seleccione una tienda" value={''} />
							{ this.state.stores.map( (data, i) => <Item style={{color: "#ffffff" }} label={data.name} key={i} value={data.id} /> ) }
						</Picker>
						<Grid>
							<Row>
								<Col style={{width: "16%", marginTop: "11%", marginRight: 0}}>
									<Item>
										<TouchableOpacity 
											onPress={()=>{ 
												this.setState({togleModal: !this.state.togleModal }) ;
												this.setState({ 
													statusBarColor: "#000000", 
												});
											}}
										>
											<Text>
												<Label style={{color:"#ffffff"}}>Lugar</Label>
												<FontAwesome 
													style={{
														color: "#ffffff",
														fontSize: 52
													}}
												>
													{Icons.mapMarker}
												</FontAwesome>
											</Text>
										</TouchableOpacity>
									</Item>
								</Col>
								<Col>
									<Item floatingLabel>
										<Label style={{ color: "#ffffff" }}>Direccion</Label>
										<Input enabled={false} editable={false} style={{ color: "#ffffff" }} value={this.state.address} onChangeText={address=>{ this.setState({address: this.state.event.setAttribute('address', address)}); }} multiline={true} numberOfLines={4} />
									</Item>
								</Col>
							</Row>
						</Grid>
						<Item floatingLabel>
							<Label style={{ color: "#ffffff" }}>Detalles</Label>
							<Input  style={{ color: "#ffffff" }} value={this.state.description} onChangeText={text=>{ this.setState({description: this.state.event.setAttribute('description', text)}); }} multiline={true} numberOfLines={4} />
						</Item>
						<Item floatingLabel>
							<Label style={{ color: "#ffffff" }}>Video promocional (Link)</Label>
							<Input 
								style={{ color: "#ffffff" }} 
								onChangeText={ video_link =>{ this.setState({ video_link: this.state.event.setAttribute('video_link', video_link) }) }}  
								value={this.state.video_link}
							/>
						</Item>
						<Row>
							<Col style={{ width: "100%" }}>
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>Fecha y hora del evento</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ event_day =>{ this.setState({ start_datetime: this.state.event.setAttribute('start_datetime', event_day) }) }}  
										value={ moment(this.state.start_datetime ).format('YYYY-DD-MM hh:mm A') }
									/>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col style={{ width: "100%" }}>
								<Item floatingLabel>
									<Label style={{ color: "#ffffff" }}>Fecha y hora de finalizacion</Label>
									<Input 
										style={{ color: "#ffffff" }} 
										onChangeText={ end_datetime =>{ this.setState({ end_datetime: this.state.event.setAttribute('end_datetime', end_datetime) }) }}  
										value={ moment(this.state.end_datetime ).format('YYYY-DD-MM hh:mm A')}
									/>
								</Item>
							</Col>
						</Row>
					</Form>

					<Button onPress={()=>{ 
						if(this.state.meth == 'PUT')
							this.state.event.update('PATCH','event', this.state.id ,this.props.navigation)
						else
							this.state.event.push(this.props.navigation, this.state.meth) 
					}}  block style={{ backgroundColor: "#02A6A4", marginBottom: 52 }}>
						<Text style={{color: "#ffffff"}}>PUBLICAR</Text>
					</Button>
				</ScrollView>
				<View>
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
		      </View>
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