import React from 'react';;

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
	Body
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert
} from 'react-native';


export default class ListFormsEvents extends React.Component{

	static navigationOptions = {
		title: 'Creacion de eventos',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#02A6A4" }
	}

	constructor(props){
		super(props);
	}

	render(){
		const { width, height } = Dimensions.get('screen')


		return(
			<View style={styles.container}>
				<StatusBar translucent backgroundColor={'#02A6A4'} />
				<Container>
					<Content>
						<List>
							<ListItem>
								<Body>
									<TouchableOpacity onPress={()=>{this.props.navigation.navigate('FormEvent', {meth: 'POST', tipo: "ESTANDAR", titulo: "Tipos de eventos", evento: false, priority: 0})}}>
										<Text style={{color: "#ffffff"}}>PUBLICACION ESTANDAR</Text>
									</TouchableOpacity>
								</Body>
							</ListItem>
							<ListItem>
								<Body>
									<TouchableOpacity onPress={()=>{this.props.navigation.navigate('FormEvent', {meth: 'POST', tipo: "ESTANDAR", titulo: "Tipos de eventos", evento: false, priority: 1})}}>
										<Text style={{color: "#ffffff"}}>PUBLICACION VIP</Text>
									</TouchableOpacity>
								</Body>
							</ListItem>
						</List>
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