
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import {
	View,
	Text,
	Alert
} from 'react-native';

import React from 'react';
import FontAwesome, {Icons} from 'react-native-fontawesome'
import { store } from '../redux/store';
import { modelActions } from '../redux/actions';

export class PopMenu extends React.Component {

	constructor(props){
		super(props);
	}

	render(){
		return(
		  <View>
		    <Menu>
		      <MenuTrigger >
		      	<Text>
		      		<FontAwesome style={{color:"#02A6A4", fontSize: 24}}>{Icons.angleDown}</FontAwesome>
		      	</Text>
		      </MenuTrigger>
		      <MenuOptions>
		        <MenuOption 
		        	onSelect={()=>{ this.props.onUpdatePress(this.props.evento); }} 
		        >
		        	<Text style={{fontSize: 21}}>Editar</Text>
		        </MenuOption>
		        <MenuOption 
		        	onSelect={()=>{
		        		Alert.alert('Advertencia', '¿Esta completamente seguro de eliminar esto?', [
			        		{
			        			text: 'Aceptar',
			        			onPress: ()=>{ 
			        				this.props.onDelete(this.props.evento);
			        			}	
			        		},
			        		{
			        			text: 'Cancelar'
			        		}
		        		]);
		        		
		        	 }} 
		        >
		        	<Text style={{fontSize: 21}}>Eliminar</Text>
		        </MenuOption>
		      </MenuOptions>
		    </Menu>
		  </View>

		);
	}
}