import React, { Component } from 'react';
import {
    Button,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image
} from 'react-native';


// import Modal from 'react-native-modalbox';

// import Draw from './components/Draw';

import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

export default class app extends Component {

    constructor(props) {
        super(props)

        this.state = {
            example: 0,
            page: 'home',
            color: 'black',
            thickness: 10,
            message: '',
            scrollEnabled: true,
            predictor: null,
            prediction: null,
            is_match: 'closed'
        }
        this.getPredictorClass();
    }


    getPredictorClass()
    {
        fetch('http://127.0.0.1:8000/class', {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({predictor: responseJson.class})
            })
            .catch((error) =>{
                console.error(error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.page === 'home' &&
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 340 }}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ page: 'draw' })
                        }}>

                            <Image
                                source={require('./components/img/draw-animals-icon.png')}
                                style="{styles.icon}"
                            />

                            {/*<Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 18 }}>- DRAW PREDICT -</Text>*/}
                            <Text style={{ color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18, fontFamily: 'Schoolbell'  }}>Test your Animal Drawing Skills!</Text>
                            <Text style={{ color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18 }}></Text>


                            <Image
                                source={require('./components/img/draw-animals-start.png')}
                                style="{styles.icon}"
                            />



                        </TouchableOpacity>

                    </View>
                }

                {
                    this.state.page === 'draw' &&
                    <View style={{ flex: 1, flexDirection: 'row' }}>



                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex: 1, flexDirection: 'column'}}>

                                <Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18}}></Text>
                                <Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18}}></Text>
                                {/*<Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18, fontFamily: 'Schoolbell' }}>Let's Draw*/}
                                <Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 22, fontFamily: 'Schoolbell'  }}>Let's Draw
                                    a {this.state.predictor}</Text>

                                <SketchCanvas
                                    localSourceImage={{filename: 'whale.png', directory: SketchCanvas.MAIN_BUNDLE, mode: 'AspectFit'}}
                                    // localSourceImage={{ filename: 'bulb.png', directory: RNSketchCanvas.MAIN_BUNDLE }}
                                    ref={ref => this.canvas = ref}
                                    style={{flex: 1}}
                                    strokeColor={this.state.color}
                                    strokeWidth={this.state.thickness}
                                    onStrokeStart={(x, y) => {
                                    }}
                                    onStrokeChanged={(x, y) => {
                                    }}
                                    //onStrokeEnd={props.onGetResults}
                                    onStrokeEnd={() => {
                                        this.canvas.getBase64('jpg', false, true, false, true, (err, result) => {
                                            fetch('http://127.0.0.1:8000/draw-predict', {
                                                method: 'POST',
                                                headers: {
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    image_str: result,
                                                    prediction: this.state.predictor
                                                }),
                                            }).then((response) => response.json()).then((responseJson) => {
                                                if(this.state.predictor == responseJson.category) {
                                                    //{/*alert('match')*/}
                                                    if(this.state.is_match != 'open') {
                                                        this.state.is_match = 'open';
                                                    }
                                                }

                                                this.setState({prediction: responseJson.category});

                                            }).catch((error) =>{
                                                console.error(error);
                                            });


                                        })
                                    }}

                                    onPathsChange={(pathsCount) => {
                                       // console.log('pathsCount', pathsCount)
                                    }}

                                />




                                {
                                    this.state.is_match == 'open' &&
                                    <View style={{
                                        position: 'absolute',
                                        alignItems: 'center',
                                        top: '30%',
                                        width: 300,
                                        left: 40,
                                        textAlign: 'center',
                                        backgroundColor: '#f39c12',
                                        color: "#ffffff",
                                        borderRadius: 5,
                                    }}>

                                        <Text style={{
                                            color: '#ffffff',
                                            alignSelf: 'center',
                                            marginTop: 15,
                                            fontSize: 22,
                                            fontFamily: 'Schoolbell',
                                            textAlign: 'center'
                                        }}>
                                            Congratulations!
                                            {"\n"}  You are an Ace at
                                            {"\n"} drawing {this.state.predictor}s!
                                        </Text>


                                        <TouchableOpacity style={[styles.functionButton, {backgroundColor: '#e67e22', width: 150}]}
                                                          onPress={() => {


                                                              this.getPredictorClass();
                                                              this.canvas.clear()
                                                              this.setState({ prediction: null });

                                                              this.setState({ is_match: 'closed' });



                                                          }}>
                                            <Text style={{color: 'white', fontSize: 18, fontFamily: 'Schoolbell'}}>Let's try another</Text>
                                        </TouchableOpacity>
                                    </View>
                                }





                                {
                                    this.state.prediction &&
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 30,
                                        marginLeft: 100,
                                        textAlign: 'center'
                                    }}>

                                        <Text style={{
                                            color: '#e67e22',
                                            alignSelf: 'center',
                                            marginTop: 15,
                                            fontSize: 22,
                                            fontFamily: 'Schoolbell',
                                            textAlign: 'center'
                                        }}>It looks like
                                            a {this.state.prediction}</Text>
                                    </View>
                                }


                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 100}}>


                                    <Text style={{marginRight: 8, fontSize: 20}}>{this.state.message}</Text>
                                    <TouchableOpacity style={[styles.functionButton, {backgroundColor: '#e67e22', width: 150}]}
                                                      onPress={() => {
                                                          this.canvas.clear()

                                                      }}>
                                        <Text style={{color: 'white', fontSize: 18, fontFamily: 'Schoolbell'}}>Clear</Text>
                                    </TouchableOpacity>


                                    <Text style={{marginRight: 8, fontSize: 20}}>{this.state.message}</Text>
                                    <TouchableOpacity style={[styles.functionButton, {backgroundColor: '#e67e22', width: 150,  marginRight: 20}]}
                                                      onPress={() => {
                                                          this.canvas.clear()
                                                          this.getPredictorClass()
                                                          this.state.prediction = undefined

                                                      }}>
                                        <Text style={{color: 'white', fontSize: 18, fontFamily: 'Schoolbell'}}>Try Another</Text>
                                    </TouchableOpacity>

                                </View>


                            </View>
                        </View>

                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    icon: {
        height: '30%',
        width: '30%',
        position: 'absolute',
    },

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

AppRegistry.registerComponent('app', () => app);