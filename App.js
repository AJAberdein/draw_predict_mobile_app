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
    Image,
    Animated,
    Easing,
} from 'react-native';


import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

import { width } from 'react-native-dimension';


const newNotifications = [
    {
        id: 1,
        message: "I'm here to bother you. Don't ignore me!",
    },
    {
        id: 2,
        message: "Luke, I'm your father 😬",
    },
    {
        id: 3,
        message: "Morning. May the Force be with you!",
    },
    {
        id: 4,
        message: "Oi sumido 😎",
    }
]




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
            is_match: 'closed',
            time: null,
            prediction_count: 0,
            notifications: [],
            offset: new Animated.Value(props.offset)
        }
        this.getPredictorClass();


        // this.spinAnimation = new Animated.Value(0)
        this.animatedValue = new Animated.Value(0)



       // this.setTimer();
    }


    removeNotification(id) {
        this.setState((state) => {
            return {
                notifications: state.notifications.filter(notification => notification.id !== id)
            }
        })
    }


    componentDidMount() {
        Animated.sequence([
            Animated.delay(this.props.delay),
            Animated.spring(this.state.offset, {
                tension: -5,
                toValue: 0
            }),
            Animated.timing(this.state.offset, {
                duration: 1000,
                toValue: -80
            })
        ]).start(() => this.props.removeNotification(this.props.id))
    }





    setTimer()
    {
        var time = 60;
        var inter = setInterval(() => {
            time--;
            this.setState({time: time})
            if(time == 0) {
                clearInterval(inter);
                alert('You made ' + this.state.prediction_count +  ' correct predictions.')
            }
        }, 1000, 60)
    }

    getPredictorClass()
    {
        fetch('http://127.0.0.1:8000/class', {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({predictor: responseJson.class});
            })
            .catch((error) =>{
                console.error(error);
            });
    }

    makePrediction()
    {
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


                    // console.log('open popup!!!')
                    // this.setState({is_match: 'open'});

                    if(this.state.is_match != 'open') {
                        this.setState({is_match: 'open'});
                        this.state.prediction_count++;

                        this.newDrawing();
                    }


                } else {
                    this.setState({prediction: responseJson.category});

                }

            }).catch((error) =>{
                console.error(error);
            });


        })
    }

    newDrawing()
    {
        this.getPredictorClass();
        this.canvas.clear()
        this.setState({ prediction: null });
        this.setState({ is_match: 'closed' });
    }


    render() {

        const { message, avatar } = this.props

        return (
            <View style={styles.container}>




                    <TopBarNotification
                        {...this.state}
                        removeNotification={id => this.removeNotification(id)}
                    />
                <Button
                    color="#81c784"
                    onPress={() => this.setState({ notifications:
                            [
                                {
                                    id: 1,
                                    message: "Well Done!  You are an \n Ace at drawing Lions!",
                                },
                            ]
                    })}
                    title="Receive Notifications"
                />



                {
                    this.state.page === 'home' &&
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 340 }}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ page: 'draw' })
                            this.setTimer();

                        }}>
                            <Image
                                source={require('./components/img/draw-animals-icon.png')}
                                style="{styles.icon}"
                            />
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
                                <Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 26, fontFamily: 'Schoolbell' }}>{this.state.time}</Text>
                                <Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 22, fontFamily: 'Schoolbell'  }}>Let's Draw a {this.state.predictor}</Text>



                                <SketchCanvas
                                    localSourceImage={{filename: 'whale.png', directory: SketchCanvas.MAIN_BUNDLE, mode: 'AspectFit'}}
                                    ref={ref => this.canvas = ref}
                                    style={{flex: 1}}
                                    strokeColor={this.state.color}
                                    strokeWidth={this.state.thickness}
                                    onStrokeStart={(x, y) => { }}
                                    onStrokeChanged={(x, y) => { }}
                                    onStrokeEnd={() => {this.makePrediction()}}
                                    onPathsChange={(pathsCount) => {}}

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
                                            Correct!
                                            {"\n"}  You drew a
                                            {"\n"} {this.state.predictor}!
                                        </Text>




                                        <TouchableOpacity style={[styles.functionButton, {backgroundColor: '#e67e22', width: 150}]}
                                                          onPress={() => {

                                                              this.newDrawing();
                                                          }}>
                                            <Text style={{color: 'white', fontSize: 18, fontFamily: 'Schoolbell'}}>Cool!</Text>
                                        </TouchableOpacity>
                                    </View>
                                }

                                {
                                    false &&
                                    <Animated.View style={[styles.spinner, { transform: [{ rotate: this.spin }]} ]} />
                                }

                                {
                                    this.state.prediction &&
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 20,
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
                                        }}>It looks like a {this.state.prediction}</Text>

                                    </View>

                                }

                                <Text style={{
                                    color: '#e67e22',
                                    alignSelf: 'center',
                                    fontSize: 18,
                                    marginBottom: 10,
                                    fontFamily: 'Schoolbell',
                                    textAlign: 'center'
                                }}>Correct: {this.state.prediction_count}</Text>

                                {/*<Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18, fontFamily: 'Schoolbell' }}>Correct: {this.state.prediction_count}</Text>*/}
                                {/*<Text style={{color: '#e67e22', alignSelf: 'center', marginTop: 15, fontSize: 18, fontFamily: 'Schoolbell' }}></Text>*/}




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








class Notification extends Component {
    constructor(props) {
        super(props)

        this.state = { offset: new Animated.Value(props.offset) }
    }

    componentDidMount() {
        Animated.sequence([
            Animated.delay(this.props.delay),
            Animated.spring(this.state.offset, {
                tension: -5,
                toValue: 0
            }),
            Animated.timing(this.state.offset, {
                duration: 1000,
                toValue: -80
            })
        ]).start(() => this.props.removeNotification(this.props.id))
    }

    render() {
        const { message } = this.props

        return (
            <Animated.View
                style={[styles.messageContainerStyle, {
                    transform: [{
                        translateY: this.state.offset
                    }]
                }]}
            >

                <View style={styles.textContainerStyle}>
                    <Text style={{ fontWeight: 'bold', color: 'white', fontFamily: 'Schoolbell', textAlign: "center"}}></Text>

                    <Text style={{ fontWeight: 'bold', color: 'white', fontFamily: 'Schoolbell', fontSize: 26}}>{message}</Text>
                </View>
            </Animated.View>
        )
    }
}

class TopBarNotification extends Component {
    render() {
        return (
            <View style={styles.notificationsContainerStyle}>
                {this.props.notifications.map((notification, index) => {
                    return (
                        <Notification
                            key={notification.id}
                            offset={-(80 * (index + 1))}
                            delay={index === 0 ? 80 : (index + 1) * 2000}
                            removeNotification={id => this.props.removeNotification(id)}
                            {...notification}
                        />
                    )
                })}
            </View>
        )
    }
}





const styles = StyleSheet.create({



    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    notificationsContainerStyle: {
        position: 'absolute',
        top: 0,
        width: width(100),
        height: 80,
        paddingLeft: width(100) * 0.024,
        paddingRight: width(100) * 0.114,
        alignItems: 'center',
    },

    messageContainerStyle: {
        position: 'absolute',
        width: width(100),
        flexDirection: 'row',
        backgroundColor: '#3498db',
        height: 120,
        paddingTop: 23,
        paddingLeft: width(100) * 0.024,
        paddingRight: width(100) * 0.114,
        alignItems: 'center',
    },

    textContainerStyle: {
        alignItems: 'center',
        width: '100%',
        marginTop: -1,
        marginLeft: width(100) * 0.016
    },




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