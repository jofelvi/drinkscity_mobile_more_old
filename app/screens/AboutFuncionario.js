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
	Icon,
	Right,
	Left,
	Body,
	Picker,
	Col,
	Row
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert,
	ScrollView
} from 'react-native';

import FontAwesome, {Icons} from 'react-native-fontawesome';
import Funcionario from '../classes/Funcionario';
import { funcionario } from '../redux/actions';

export default class AboutFuncionario extends React.Component{

	static navigationOptions = ({navigation}) => ({
		title: `${navigation.state.params.titulo}`,
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#02A6A4" },
		headerLeft: null,
		headerRight: <Button onPress={()=>{navigation.goBack()}} transparent><Text><FontAwesome style={{color:"#ffffff", fontSize: 22}}>{Icons.close}</FontAwesome></Text></Button> 
	
	});

	constructor(props){
		super(props);

		const { navigation } = this.props;
		const { state } = navigation;
		let func = ( state.params.funcionario != false ) 
			? state.params.funcionario 
			: {fullname: '', email: '', password: '', phone: '', role: 'guest', rut: '', address: ''};

		this.state = {
			funcionario: new Funcionario(func),
			...func
		}
	}

	_accion(accion){
		eval(accion);
		const { navigation } = this.props;

		navigation.state.params.onBack(true);
	}

	_saveUser(){
		Alert.alert(
			'Confirme la accion',
			'Esta seguro de realizar esta accion?',
			[
				{
					text: 'Aceptar',
					onPress: ()=>{
						let resp = this.state.funcionario.push();
						this._accion("this.props.navigation.goBack()");
					}
				}
			]
		);
	}

	renderPicker(){
		const { funcionario } = this.state;
		const roles = funcionario.getRoles();
		return roles.map( (data)=>{
			return <Item style={{color: "#ffffff"}} label={data.alias} value={data.name} />
		});
	}

	render(){
		const { width, height } = Dimensions.get('screen')
		const { state } = this.props.navigation;
		return(
			<View style={styles.container}>
				<StatusBar translucent backgroundColor={'#02A6A4'} />
				<ScrollView>
					<Form>
						<Item floatingLabel>
							<Label 
								style={{ color:  "#ffffff"}} >Nombre completo
							</Label>
							<Input 
								value={this.state.fullname}
								onChangeText={ text => { this.setState({ fullname: this.state.funcionario.setAttribute('fullname', text) }); } }
								style={{ color:  "#ffffff"}} 
							/>
						</Item>
						<Item floatingLabel>
							<Label 
								style={{ color:  "#ffffff"}} >RUT
							</Label>
							<Input 
								value={this.state.rut}
								onChangeText={ text => { this.setState({ rut: this.state.funcionario.setAttribute('rut', text) }); } }
								style={{ color:  "#ffffff"}} 
							/>
						</Item>
						<Item floatingLabel>
							<Label 
								style={{ color:  "#ffffff"}} >Correo Electronico
							</Label>
							<Input 
								value={this.state.email}
								onChangeText={ text => { this.setState({ email: this.state.funcionario.setAttribute('email', text) }); } }
								style={{ color:  "#ffffff"}} 
							/>
						</Item>
						<Item floatingLabel>
							<Label 
								style={{ color:  "#ffffff"}} >Asignar una clave
							</Label>
							<Input 
								secureTextEntry={true}
								value={this.state.password}
								onChangeText={ text => { this.setState({ password: this.state.funcionario.setAttribute('password', text) }); } }
								style={{ color:  "#ffffff"}} 
							/>
						</Item>
						<Item floatingLabel>
							<Label 
								style={{ color:  "#ffffff"}} >Telefono
							</Label>
							<Input 
								value={this.state.phone}
								onChangeText={ text => { this.setState({ phone: this.state.funcionario.setAttribute('phone', text) }); } }
								style={{ color:  "#ffffff"}} 
							/>
						</Item>
						<Text style={{color :"#ffffff", fontSize: 18, marginLeft: 14.3}}>
							Tipo
						</Text>
						<Picker
							mode='dropdown'
							onValueChange={(value)=>{ this.setState({ role: this.state.funcionario.setAttribute('role',value ) }); }}
							style={{ color:  "#ffffff", marginLeft: 14.3}}
							selectedValue={this.state.role}
						>
							{
								this.state.funcionario.getRoles().map( (data, i) =>  <Item key={i} style={{color: "#ffffff"}}  label={data.description} value={data.name} /> )
							}
						</Picker>
						<Item floatingLabel>
							<Label style={{ color:  "#ffffff" }}>Direccion</Label>
							<Input  style={{ color:  "#ffffff" }} value={this.state.address} onChangeText={text=>{ this.setState({address: this.state.funcionario.setAttribute('address', text) }); }} multiline={true} numberOfLines={4} />
						</Item>
					</Form>

					<Button onPress={()=>{ 
							const { navigation } = this.props;
							if( navigation.state.params.accion == 'crear' )
								this._saveUser();
							else
								this.state.funcionario.update('PUT', navigation); 
						}}  
						block 
						style={{ backgroundColor: "#02A6A4", marginBottom: 52 }}
					>
						<Text style={{color:"#ffffff"}}>CREAR</Text>
					</Button>
				</ScrollView>
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