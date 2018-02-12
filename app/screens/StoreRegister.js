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
	Input
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	Image,
	TouchableOpacity,
	Alert,
	AsyncStorage,
	ScrollView
} from 'react-native';

import {
	Thumbnail,
	Button
} from 'native-base'

import Connection from '../config/connection';
import Model from '../classes/Model'
import BackHandler from 'BackHandler';

export default class StoreRegister extends React.Component{

	static navigationOptions = {
		title: 'Registro de tienda',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#02A6A4" }
	}


	constructor(props){
		super(props);
		this.state = {
			user: null,
			order: null,
			load: true
		}
	}

	componentWillMount(){

		BackHandler.removeEventListener('hardwareBackPress', ()=> true);
		BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());	
	}

	render(){
		const { width, height } = Dimensions.get('screen')
		return(
			<View style={styles.container}>
				<StatusBar translucent backgroundColor={'#02A6A4'} />
				<Container>
					<Content>
						<Form>
							<Grid>
								<Row>
									<Col style={{width: "90%"}}>
										<H2 style={{color: "#02A6A4", marginLeft: 14, marginTop: 4}} >Datos de la tienda</H2>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "90%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Nombre de la tienda</Label>
										<Input style={{color: "#ffffff"}} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "90%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Reseña de la tienda</Label>
										<Input style={{color: "#ffffff"}} multiline numberOfLines={3} />
									</Item>
									</Col>

								</Row>
								<Row>
									<Col style={{width: "45%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Rut de la tienda</Label>
										<Input style={{color: "#ffffff"}} />
									</Item>
									</Col>
									<Col style={{width: "45%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Telefono de la tienda</Label>
										<Input style={{color: "#ffffff"}} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "90%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Direccion de la tienda</Label>
										<Input style={{color: "#ffffff"}} multiline numberOfLines={3} />
									</Item>
									</Col>

								</Row>
								<Row>
									<Col style={{width: "90%"}}>
										<H2 style={{color: "#02A6A4", marginLeft: 14, marginTop: 4}} >Datos del representante</H2>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "90%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Representante legal de la tienda</Label>
										<Input style={{color: "#ffffff"}} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "90%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Correo del epresentante legal de la tienda</Label>
										<Input style={{color: "#ffffff"}} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "45%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Rut del representante</Label>
										<Input style={{color: "#ffffff"}} />
									</Item>
									</Col>
									<Col style={{width: "45%"}}>
									<Item floatingLabel>
										<Label style={{color: "#ffffff"}}>Tlfno / rep.</Label>
										<Input style={{color: "#ffffff"}} />
									</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "100%"}}>
										<Button block style={{marginTop: 9, marginBottom:9, backgroundColor: "#02A6A4"}} >
											<Text>
												Terminar registro
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
	}
}