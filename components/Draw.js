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


    strokeChanged = (x, y) => {
        // alert(x + '; ' + y)
        alert(JSON.stringify(x))
        alert()
        // getPaths()
    }

    strokeEnded = (stroke) => {
        // alert(x + '; ' + y)
        // alert(JSON.stringify(x))
        alert(this.canvas.getPath())
        // getPaths()
    }

    return (

        <View style={{flex: 1, flexDirection: 'row'}}>
            {/*<SketchCanvas*/}
            {/*style={{ flex: 1 }}*/}
            {/*strokeColor={'black'}*/}
            {/*strokeWidth={7}*/}
            {/*onStrokeChanged={this.strokeChanged}*/}
            {/*/>*/}


            <RNSketchCanvas
                ref={ref => this.canvas = ref}
                containerStyle={{backgroundColor: 'transparent', flex: 1}}
                canvasStyle={{backgroundColor: 'transparent', flex: 1}}
                defaultStrokeIndex={0}
                defaultStrokeWidth={5}

                savePreference={() => {
                    return {
                        folder: 'RNSketchCanvas',
                        filename: String(Math.ceil(Math.random() * 100000000)),
                        transparent: false,
                        imageType: 'png'
                    }
                }}

                clearComponent={
                    <View style={styles.functionButton}><Text style={{color: 'white'}}>Clear</Text></View>
                }
                saveComponent={
                    <View style={styles.functionButton}><Text style={{color: 'white'}}>Save</Text></View>
                }
                onStrokeEnd={(id) => {
                    //Alert.alert(JSON.stringify(this.canvas))


                    //Alert.alert(JSON.stringify(this.canvas.getPaths()))
                    //Alert.alert(JSON.stringify(this.canvas.getPaths()))
                    //this.canvas.getBase64('jpg', false, true, true, (err, result) => {
                        //console.log(result)
                        //Alert.alert(JSON.stringify(result))
                    //})
                    //alert(JSON.stringify(this.canvas.getPaths()))
                    //alert(JSON.stringify(this.canvas))
                    //alert(this.canvas.getPaths())
                }}





            />





        </View>





        // <SketchCanvas/>
        // <Button title="Submit" onPress={props.onDrawingFinished}/>
    );
};


// const styles = StyleSheet.create({
//     container: {
//         flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
//     },
// });


const styles = StyleSheet.create({
    // container: {
    //     flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
    // },
    // strokeColorButton: {
    //     marginHorizontal: 2.5,
    //     marginVertical: 8,
    //     width: 30,
    //     height: 30,
    //     borderRadius: 15,
    // },
    // strokeWidthButton: {
    //     marginHorizontal: 2.5,
    //     marginVertical: 8,
    //     width: 30,
    //     height: 30,
    //     borderRadius: 15,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: '#39579A'
    // },
    functionButton: {
        // top:10,
        marginHorizontal: 2.5,
        marginVertical: 8,
        height: 30,
        width: 150,
        backgroundColor: '#39579A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    }
});

export default draw;

// AppRegistry.registerComponent('draw', () => draw);
