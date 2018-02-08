import React from 'react';

import {
	Dimensions,
	Alert,
	Image,
	StatusBar,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';

import {

	Body,
	Col,
	Grid,
	Row,
	Container,
	Content,
	View,
	Text,
	H2,
	Thumbnail,
	Input,
	Form,
	Label,
	Item,
	Button

} from 'native-base';

import Connection from '../config/connection';

import FontAwesome, {Icons} from 'react-native-fontawesome'
import BackHandler from 'BackHandler';

const con = new Connection();

export default class Login extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			email: null,
			password: null,
			loading: false,
			text: 'Ingresar',
			sessionActive: false
		};


	}

	componentWillMount(){
		BackHandler.addEventListener('hardwareBackPress',()=>{
			BackHandler.exitApp();
			return false;
		});
	}

	async requestLogin(){

		try{
			if( (this.state.email == null || this.state.password == null) || ( this.state.email == "" || this.state.password == "" ) ){
				Alert.alert('Aviso', 'Usted necesita completar los datos solicitados para poder iniciar sesion', [
					{
						text: 'Entiendo'	
					}
				]);
				return false;
			}

			this.setState({ loading: true, text: 'Cargando...' });

			let login = await fetch( con.getUrlApi('authenticate', false), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'json'
				},
				body: JSON.stringify(this.state)
			}).then(resp => {
				let { _bodyInit } = resp;
				_bodyInit = JSON.parse(_bodyInit);
				let data =  _bodyInit;
				if(resp.status == 200 || resp.status == '200'){
					let session = {
						token: data.auth_token
					}
					AsyncStorage.removeItem('@session');
					AsyncStorage.setItem('@session', JSON.stringify(session));
				    this.props.navigation.navigate('HomeScreen', {token: session});
					
				}
				this.setState({ loading: false, text: 'Ingresar'});
			});
		}catch(err){
			console.log
		}
	}

	render(){
		return(
			<View style={styles.container}>
				<StatusBar translucent backgroundColor={'#111111'} />
				<Container>
					<Content>
						<Form>
							<Grid>
								<Row>
									<Col>
										<View style={{alignSelf: "center"}}>
											<Image
												source={require('../assets/img/drinkscity_logo.png')}
												style={{
													marginTop: 7,
													width: 185,
													height: 190
												}}
											/>
										</View>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
										<Item floatingLabel>
											<Label style={{color: "#ffffff"}}>Correo electronico</Label>
											<Input 
												style={{color: "#ffffff"}}
												onChangeText={text =>{ this.setState({ email: text }) } }
											/>

										</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
										<Item floatingLabel>
											<Label style={{color: "#ffffff"}}>Clave</Label>
											<Input 
												style={{color: "#ffffff"}}
												secureTextEntry={true}
												onChangeText={text =>{ this.setState({ password: text }) } }
											/>

										</Item>
									</Col>
								</Row>
								<Row>
									<Col style={{width: "95%"}}>
										<Button disabled={this.state.login} onPress={()=>{ this.requestLogin() }} block rounded style={{marginTop: 10}}>
											<Text style={{color: "#ffffff"}}>
												{this.state.text}
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