import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  View,
  Alert,
  StatusBar,
  Linking
} from 'react-native';

import {
  Header,
  Left,
  Text,
  Button,
  Icon,
  Body,
  Title
} from 'native-base';

import { QRScannerView } from '../components/AC-QRCode-RN/lib/index';

import BackHandler from 'BackHandler';

import Camera from 'react-native-camera';

export default class QRScaner extends Component {
	static navigationOptions = ({navigation}) => ({
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#01DAC9" },
		title: 'Validacion de orden mediante QR'
	});

  constructor(props){
    super(props);
    this.state = {
      onBarCodeRead: this._onBarCodeRead
    }
  }

  componentWillMount(){
    BackHandler.removeEventListener('hardwareBackPress', ()=> true);
    BackHandler.addEventListener('hardwareBackPress', ()=> this.props.navigation.goBack());
    this.setState({
      camera : {
        onBarCodeRead: this.onBarCodeRead
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor={'#02A6A4'} />
        <QRScannerView  
          onScanResultReceived={this._onBarCodeRead.bind(this)}
          renderTopBarView={this._topBarView.bind(this)}
          renderBottomMenuView={this._topBarView.bind(this)}
          hintText={'Posiciona el QR en el area delimitada'}
        />
      </View>
    );
  }

  _topBarView = (e) =>{
    return null;
  }

  _bottomScanner = (e) =>{
    return null;
  }
 
  _onBarCodeRead=(e)=>{ 
    this.setState({
      onBarCodeRead: null
    });
     this.props.navigation.navigate('onScanner', {scanData: e});

     setTimeout(()=>{
      this.setState({
        onBarCodeRead: this._onBarCodeRead
      });
     },4000)

  }

  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});