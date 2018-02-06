import React from 'react';
import PerfilEmpresa from '../classes/Perfil';

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
	Thumbnail,
	Row,
	Col,
	Grid,
	CheckBox
} from 'native-base';

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Alert
} from 'react-native';

import FontAwesome, {Icons} from 'react-native-fontawesome';
var ImagePicker = require('react-native-image-picker');

var options = {
  title: 'Cargar imagenes',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};


export default class Perfil extends React.Component{

	static navigationOptions = {
		title: 'Perfil',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#02A6A4" }
	}

	constructor(props){
		super(props);
		negocio = new PerfilEmpresa({
			profile_picture: require('../assets/img/cafe.jpeg'),
			descroption: 'Sofisticado ambiente, los mejores hits.',
			phone: '04262225797',
			hourary: '09:33 AM - 10:00 PM',
			laboral_days: 'Lunes - Viernes',
			has_delivery: true
		});

		this.state = {
			...negocio.data
		};
	}

	takePhoto(){
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				let source = { uri: response.uri };
				this.setState({
					profile_picture: image
				});
			}
			
		});
	}

	render(){
		const { width, height } = Dimensions.get('screen')



		return(
			<Container style={styles.container}>
				<StatusBar translucent backgroundColor={'#02A6A4'} />
				<Content>
					<Form>
						<Grid style={{marginTop: 5, marginLeft: 15}}>
							<Col style={{width: "95%"}}>
								<TouchableOpacity 
									onPress={()=>{this.takePhoto()}}
									style={{
										backgroundColor: "#02A6A4",
										width: "97%",
										alignSelf: "center",
										alignContent: "center",
										marginTop: 9,										
										backgroundColor :"#02A6A4"
									}}
								>

									<FontAwesome  
										 style={{color: "#ffffff", fontSize: 52, textAlign: "center"}}
									>
										{Icons.pictureO}
									</FontAwesome>
								</TouchableOpacity>
							</Col>
						</Grid>
						<Col style={{width: "95%"}}>
							<Item floatingLabel>
								<Label style={{color: "#ffffff"}}> Reseña </Label>
								<Input
									multiline={true}
									numberOfLines={2}
									style={{color: "#ffffff"}}
									value={this.state.descroption}
									onChangeText={text => { this.setState({description: negocio.setAttribute('description', text) }); }}
								/>
							</Item>
						</Col>
						<Col style={{width: "95%"}}>
							<Item floatingLabel>
								<Label style={{color: "#ffffff"}}> Telefono </Label>
								<Input
									style={{color: "#ffffff"}}
									value={this.state.phone}
									onChangeText={ text => { this.setState({phone: negocio.setAttribute('phone', phone) }); } }
							
								/>
							</Item>
						</Col>
						<Grid>
							<Col style={{width: "47.5%"}}>
								<Item floatingLabel>
									<Label style={{color: "#ffffff"}}> Dias de atencion </Label>
									<Input
										style={{color: "#ffffff"}}
										value={this.state.laboral_days}
										onChangeText={ text =>{ this.setState( {laboral_days: negocio.setAttribute('laboral_days',text)} ); } }
									/>
								</Item>
							</Col>
							<Col style={{width: "47.5%"}}>
								<Item floatingLabel>
									<Label style={{color: "#ffffff"}}> Horario </Label>
									<Input
										style={{color: "#ffffff"}}
										value={this.state.hourary}
										onChangeText={text =>{ this.setState({hourary: negocio.setAttribute( 'hourary', text ) }); } }
								/>
								</Item>
							</Col>
						</Grid>
						<Grid style={{marginTop: 5, marginLeft: 7}}>
							<Col style={{width: "10%"}}>
								<CheckBox 
									checked={this.state.has_delivery} 
									onPress={()=>{  this.setState({ has_delivery: negocio.setAttribute('has_delivery', !this.state.has_delivery) }); }} 
									color={"#02A6A4"}
								/>
							</Col>
							<Col style={{width: "85%"}}>
								<Text style={{color: "#ffffff"}}>Tiene delivery</Text>
							</Col>
						</Grid>
						<Grid style={{marginTop: 5, marginLeft: 15}}>
							<Col style={{width: "95%"}}>
								<Button block style={{backgroundColor :"#02A6A4"}}>
									<Text style={{color:"#ffffff"}}>
										Guardar
									</Text>
								</Button>
							</Col>
						</Grid>
					</Form>
				</Content>
			</Container>
		);
	}

}

const styles = {
	container: {
		backgroundColor: "#111111",
		flex: 1,
	}
}