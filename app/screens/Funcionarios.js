import React from 'react';
import {Perfil as PerfilEmpresa} from '../classes/Perfil';

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
	Fab
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert,
	ScrollView,
	Root
} from 'react-native';

import FontAwesome, {Icons} from 'react-native-fontawesome';
import Funcionario from '../classes/Funcionario';
import { store } from '../redux/store';

export default class Funcionarios extends React.Component{

	static navigationOptions = ({navigation}) => ({
		title: `${navigation.state.params.titulo}`,
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#02A6A4" },
	});

	constructor(props){
		super(props);
		this.funcionario = new Funcionario();
		this.fillables = this.funcionario.getFillables();

		this.state = {
			funcionarios: [],
			validadores: [],
			rrpp: [],
			complete: false,
		};

		store.subscribe( ()=>{
			let objects = JSON.parse(store.getState().users).filter( func => func);
			this.setState({
				funcionarios: objects
			});
		} )
	}

	onBack = complete => {
		this.setState({ complete });
		if(complete){
			Alert.alert('Exito', 'El usuario ha sido creado satisfactoriamente');	
		}
	}

	componentWillMount(){
		let dat = this.funcionario.getAll();
	}

	onDelete(func){
		 (new Funcionario(func)).delete();

		 let objects = this.state.funcionarios.filter( data =>{
		 	return data.id !=  func.id
		 } )
		 this.setState({
		 	funcionarios: objects
		 })
	}

	onUpdate = update =>{
		let dat = this.funcionario.getAll();
	}

	_renderListItems(){	
		const funcs = ( typeof(this.state.funcionarios) == 'string' ) ? JSON.parse(this.state.funcionarios) : this.state.funcionarios;
		const list = funcs.map( data =>{
			return(
				<ListItem key={data.id}>
					<Body>
						<TouchableOpacity onPress={()=>{this.props.navigation.navigate('FormFuncionario', {titulo: data.fullname ? data.fullname : 'Editar usuario',accion: "editar", funcionario: data, onUpdate: this.onUpdate})}}>
							<Text style={{color: "#ffffff"}}>
								{ (data.fullname == null) ? 'No aplica' : data.fullname }
							</Text>
							{
								this.funcionario.getRoles().map( (rol)=> { 
									if(rol.name == data.role)
										return <Text note style={{color: "#ffffff"}}>{rol.description}</Text> 
								})
							}						
						</TouchableOpacity>
					</Body>
					<Right>
						<Button danger onPress={()=>{
							Alert.alert('Alerta','¿Esta seguro de realizar esta operacion?',[
								{
									text: 'Aceptar',
									onPress: ()=>{ this.onDelete(data) }
								},
								{
									text: 'Cancelar',
								}
							])
						}}>
							<Text>
								<FontAwesome>{Icons.trashO}</FontAwesome>
							</Text>
						</Button>
					</Right>
				</ListItem>
			);
		} );

		return list;
	}

	render(){
		const { width, height } = Dimensions.get('screen')


		return(
			<View style={styles.container}>
				<StatusBar translucent backgroundColor={'#02A6A4'} />
				<ScrollView>
					<List
						leftOpenValue={75}
						rightOpenValue={-75}
					>
						{this._renderListItems()}
					</List>
				</ScrollView>
				<View style={{flex: 1}} >
					<Fab
			            active={this.state.active}
			            direction="up"
			            containerStyle={{ }}
			            style={{ backgroundColor: '#02A6A4' }}
			            position="bottomRight"
			            onPress={()=>{this.props.navigation.navigate('FormFuncionario', {titulo: 'Crear Funcionario', accion: 'crear' ,funcionario: false, onBack: this.onBack, onUpdate: this.onUpdate})}}>
			            <Text>
			            	<FontAwesome>{Icons.plus}</FontAwesome>
			            </Text>
			        </Fab>
				</View>
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