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
	Image
} from 'react-native'

import BackgroundButton from './BackgroundButton';

export default class Botonera extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<View 
				style={{marginTop: "4%", marginLeft: "3%"}}
				
			>
					<Grid>
						<Row>
							<Col>
								<TouchableOpacity onPress={()=>{ this.props.navigation.navigate('QRScanner') }} style={{alignSelf: "center", alignItems: "center", alignContent: "center", marginBottom: "7%"}}>
									<BackgroundButton 
										imagen={require('../assets/img/banda.png')} 
										text={'ESCANEAR'} 
										font_size={17}
										btnSize={84}
										icon={require('../assets/img/qrmini.png')}
									/>
								</TouchableOpacity>	
							</Col>
						</Row>
					</Grid>
					<Grid>

						<Col>
							<Row style={{alignContent: "center", alignItems: "center"}}>

								<TouchableOpacity onPress={()=>{this.props.navigation.navigate('CrearProductosScreen')}}>
									<BackgroundButton 
										imagen={require('../assets/img/banda.png')} 
										text={'CREAR PRODUCTO'} 
										font_size={17}
									/>
								</TouchableOpacity>
							</Row>
							<Row style={{alignContent: "center", alignItems: "center", marginTop: "9%"}}>

								<TouchableOpacity onPress={()=>{this.props.navigation.navigate('Productos', { side: 'Home' })}}>
									<BackgroundButton 
										imagen={require('../assets/img/banda.png')} 
										text={'MIS PRODUCTOS'} 
										font_size={17}
									/>
								</TouchableOpacity>
							</Row>
							<Row style={{alignContent: "center", alignItems: "center", marginTop: "9%"}}>

								<TouchableOpacity onPress={ ()=>{ this.props.navigation.navigate('BtnFuncionarios', {titulo: 'Funcionarios', funcionario: false}); } }>
									<BackgroundButton 
										imagen={require('../assets/img/banda.png')} 
										text={'FUNCIONARIOS'} 
										font_size={17}
									/>
								</TouchableOpacity>
							</Row>


						</Col>
						<Col>
							<Row style={{alignContent: "center", alignItems: "center"}}>
								<TouchableOpacity onPress={()=>{this.props.navigation.navigate('FormsEvents', {titulo: 'Tipo de evento', side: 'Hone', event: false})}}>
									<BackgroundButton 
										imagen={require('../assets/img/banda.png')} 
										text={'CREAR EVENTO'} 
										font_size={17}
									/>
								</TouchableOpacity>
							</Row>
							<Row style={{alignContent: "center", alignItems: "center",  marginTop: "9%"}}>

								<TouchableOpacity onPress={()=> { this.props.navigation.navigate('Eventos',{titulo: 'Listado de eventos publicados', side: 'Home', event: false}) } }>
									<BackgroundButton 
										imagen={require('../assets/img/banda.png')} 
										text={'MIS EVENTOS'} 
										font_size={17}
									/>
								</TouchableOpacity>
							</Row>
							<Row style={{alignContent: "center", alignItems: "center",  marginTop: "9%"}}>

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