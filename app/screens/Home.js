import React, { Component } from 'react'
import {
	View,
	Text,
	Container,
	Content,
	Thumbnail
} from 'native-base'

import {
	StatusBar,
	Dimensions,
	TouchableOpacity,
	Image,
	AsyncStorage,
	Alert
} from 'react-native'

import MainHeader from '../components/MainHeader'
import Botonera from '../components/Botonera'

export default class Home extends Component {

	constructor(props){
		super(props);
	}

	async saveToken(){

		try{
			let { navigation } = this.props;
			let {token} = navigation.state.params;
			await AsyncStorage.setItem("@session",JSON.stringify(token));
		}catch( err ){
			console.log(err)
		}
	}

	componentWillMount(){
		this.saveToken();
	}

	render(){
		const { width, height } = Dimensions.get('screen')
		return(
				
			<View style={styles.container}>
				<StatusBar translucent={true} backgroundColor={'#000000'}/>
				<MainHeader {...this.props} />
				<Content>
					<Botonera  {...this.props} />
				</Content>
					<View style={{ alignSelf: "center",alignContent: "center", alignItems: "center", flex: 0.1, left: 0, right: 0 ,position: "relative", bottom: 0, flexDirection: 'row', alignItems: "center" ,marginBottom : 0}}>
						<View style={{flex: 0.8, alignSelf: "center",alignContent: "center", alignItems: "center"}}>
							<TouchableOpacity>
								<Text style={{color: "#ffffff", alignText: "center"}} > CERRAR SESION</Text>
							</TouchableOpacity>
						</View>
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