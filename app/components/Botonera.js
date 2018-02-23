import React from 'react';
import {
	Container,
	Content,
	View,
	Row,
	Grid,
	Col,
	Text
} from 'native-base';

import {
	TouchableOpacity,
	Image,
	AsyncStorage
} from 'react-native'

import BackgroundButton from './BackgroundButton';

export default class Botonera extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			user: null
		};
	}

	async componentWillMount(){
		let session = await AsyncStorage.getItem('@session');
		session = await JSON.parse(session);

		this.setState({
			user: session.user
		})
	}

	render(){

		let qr = null;
		let productos = null;
		let mis_productos = null;
		let funcionarios = null;
		let eventos = null;
		let mis_eventos = null;
		let ventas = null;
		if( this.state.user !== null ){
			if( this.state.user.role == 'validator' || this.state.user.role == 'store_admin' || this.state.user.role == 'rrpp'  ){
				qr = (
					<TouchableOpacity onPress={()=>{ this.props.navigation.navigate('QRScanner') }} style={{alignSelf: "center", alignItems: "center", alignContent: "center", marginBottom: "7%"}}>
						<BackgroundButton 
							imagen={require('../assets/img/banda.png')} 
							text={'ESCANEAR'} 
							font_size={17}
							btnSize={84}
							icon={require('../assets/img/qrmini.png')}
						/>
					</TouchableOpacity>	
				)
			}
			if( this.state.user.role == 'store_admin' ){
				productos = (

					<TouchableOpacity onPress={()=>{this.props.navigation.navigate('CrearProductosScreen')}}>
						<BackgroundButton 
							imagen={require('../assets/img/banda.png')} 
							text={'CREAR PRODUCTO'} 
							font_size={17}
						/>
					</TouchableOpacity>
				);

				mis_productos = (
								<TouchableOpacity onPress={()=>{this.props.navigation.navigate('Productos', { side: 'Home' })}}>
									<BackgroundButton 
										imagen={require('../assets/img/banda.png')} 
										text={'MIS PRODUCTOS'} 
										font_size={17}
									/>
								</TouchableOpacity>
				);

				funcionarios = (
								<TouchableOpacity onPress={ ()=>{ this.props.navigation.navigate('BtnFuncionarios', {titulo: 'Funcionarios', funcionario: false}); } }>
									<BackgroundButton 
										imagen={require('../assets/img/banda.png')} 
										text={'FUNCIONARIOS'} 
										font_size={17}
									/>
								</TouchableOpacity>
				);

				eventos = (
								<TouchableOpacity onPress={()=>{this.props.navigation.navigate('FormsEvents', {titulo: 'Tipo de evento', side: 'Hone', event: false})}}>
									<BackgroundButton 
										imagen={require('../assets/img/banda.png')} 
										text={'CREAR EVENTO'} 
										font_size={17}
									/>
								</TouchableOpacity>
				);

				mis_eventos = (
								<TouchableOpacity onPress={()=> { this.props.navigation.navigate('Eventos',{titulo: 'Listado de eventos publicados', side: 'Home', event: false}) } }>
									<BackgroundButton 
										imagen={require('../assets/img/banda.png')} 
										text={'MIS EVENTOS'} 
										font_size={17}
									/>
								</TouchableOpacity>
				);

				ventas = (
								<TouchableOpacity 
									onPress={()=>{
										this.props.navigation.navigate('VentasScreen', {titulo: "Ventas"})
									}}
								>
									<BackgroundButton 
										imagen={require('../assets/img/banda.png')} 
										text={'MIS VENTAS'} 
										font_size={17}
									/>
								</TouchableOpacity>
				);
			}
		}
		return(
			<View 
				style={{marginTop: "4%", marginLeft: "3%"}}
				
			>
					<Grid>
						<Row>
							<Col>
								{qr}
							</Col>
						</Row>
					</Grid>
					<Grid>

						<Col>
							<Row style={{alignContent: "center", alignItems: "center"}}>
								{productos}
							</Row>
							<Row style={{alignContent: "center", alignItems: "center", marginTop: "9%"}}>

								{mis_productos}
							</Row>
							<Row style={{alignContent: "center", alignItems: "center", marginTop: "9%"}}>
								{funcionarios}
							</Row>


						</Col>
						<Col>
							<Row style={{alignContent: "center", alignItems: "center"}}>
								{eventos}
							</Row>
							<Row style={{alignContent: "center", alignItems: "center",  marginTop: "9%"}}>
								{mis_eventos}
							</Row>
							<Row style={{alignContent: "center", alignItems: "center",  marginTop: "9%"}}>
								{ventas}
							</Row>
						</Col>

					</Grid>
			</View>
		);
	}
}

const styles = {
	btnText: {
		color: "#ffffff",
		fontSize: 15,
		alignText: "center"
	},
	btnImg: {
		flex: 1,
		width: undefined,
		height: undefined,
		backgroundColor: 'transparent',
		justifyContent: "center",
		alignItems: "center"
	}
}