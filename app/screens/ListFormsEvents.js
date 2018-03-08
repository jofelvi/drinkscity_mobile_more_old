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
	Body,
	Row,
	Col
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert
} from 'react-native';

import BackHandler from 'BackHandler';

export default class ListFormsEvents extends React.Component{

	static navigationOptions = {
		title: 'CREACION DE EVENTOS',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" }
	}

	constructor(props){
		super(props);
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
						<List>
							<Row>
								<Col style={{width: "95%"}}>
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
							</Col>
							</Row>
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