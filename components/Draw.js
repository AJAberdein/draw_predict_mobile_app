import React, {Component} from 'react';

import {
    Button,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,

} from 'react-native';


import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';



const draw = props => {


    // this.onChange = this.onChange.bind(this)

    state = {
        test: 'hello',
        example: 1,
        color: 'black',
        thickness: 10,
        message: '',
        scrollEnabled: true,
        predictor: null,
        prediction: null
    }


    //console.log("props");
    //console.log(props);






    return (

        <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'column'}}>

                <Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18}}></Text>
                <Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18}}></Text>
                {/*<Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18, fontFamily: 'Schoolbell' }}>Let's Draw*/}
                <Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18, fontFamily: 'Schoolbell'  }}>Let's Draw
                    a {props.predictor}</Text>

                <SketchCanvas
                    localSourceImage={{filename: 'whale.png', directory: SketchCanvas.MAIN_BUNDLE, mode: 'AspectFit'}}
                    // localSourceImage={{ filename: 'bulb.png', directory: RNSketchCanvas.MAIN_BUNDLE }}
                    ref={ref => this.canvas = ref}
                    style={{flex: 1}}
                    strokeColor={this.state.color}
                    strokeWidth={this.state.thickness}
                    onStrokeStart={(x, y) => {
                        //console.log('x: ', x, ', y: ', y)
                        //this.setState({ message: 'Start' })
                    }}
                    onStrokeChanged={(x, y) => {
                        //console.log('x: ', x, ', y: ', y)
                        //this.setState({ message: 'Changed' })

                    }}
                    onStrokeEnd={() => {
                        this.canvas.getBase64('jpg', false, true, false, true, (err, result) => {

                            //console.log(result)
                            fetch('http://127.0.0.1:8000/draw-predict', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    image_str: result,
                                    prediction: props.predictor
                                }),
                            }).then((response) => response.json()).then((responseJson) => {

                                console.log('target: ', props.predictor, 'prediction: ', responseJson);

                                this.state.prediction = responseJson.category;

                            }).catch((error) =>{
                                console.error(error);
                            });


                        })
                    }}

                    onPathsChange={(pathsCount) => {
                        console.log('pathsCount', pathsCount)
                    }}

                    //clearComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Clear</Text></View>}

                />

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 100, marginLeft: 100, textAlign: 'center'}}>

                    <Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18, fontFamily: 'Schoolbell' , textAlign: 'center' }}>It looks like
                        a {state.prediction}</Text>

                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 100}}>

                    <Text style={{marginRight: 8, fontSize: 20}}>{this.state.message}</Text>
                    <TouchableOpacity style={[styles.functionButton, {backgroundColor: 'black', width: 90}]}
                                      onPress={() => {
                                          //console.log(this.canvas.getPaths())
                                          //Alert.alert(JSON.stringify(this.canvas.getPaths()))
                                          this.canvas.clear()

                                      }}>
                        <Text style={{color: 'white'}}>Clear</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );
};


const styles = StyleSheet.create({

    strokeColorButton: {
        marginHorizontal: 2.5,
        marginVertical: 8,
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    strokeWidthButton: {
        marginHorizontal: 2.5,
        marginVertical: 8,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#39579A'
    },
    functionButton: {
        marginHorizontal: 2.5,
        marginVertical: 8,
        height: 30,
        width: 60,
        backgroundColor: '#39579A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
        alignSelf: 'stretch'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    },
    page: {
        flex: 1,
        height: 300,
        elevation: 2,
        marginVertical: 8,
        backgroundColor: 'white',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.75,
        shadowRadius: 2
    }
});

export default draw;

