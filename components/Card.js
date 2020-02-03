import React from 'react';
import {View, Text, Animated, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Swipeable  from 'react-native-swipeable-row';
import {IconButton} from "react-native-paper";

export class Card extends React.Component {

    colorAverage (colors) {
        let color1 = colors[0];
        let color2 = colors[1];
        const r1 = parseInt(color1.substring(1,3), 16);
        const g1 = parseInt(color1.substring(3,5), 16);
        const b1 = parseInt(color1.substring(5,7), 16);
        const r2 = parseInt(color2.substring(1,3), 16);
        const g2 = parseInt(color2.substring(3,5), 16);
        const b2 = parseInt(color2.substring(5,7), 16);

        const r = Math.round((r1+r2)/2).toString(16);
        const g = Math.round((g1+g2)/2).toString(16);
        const b = Math.round((b1+b2)/2).toString(16);
        return '#'+''+r+''+g+''+b;
    };

    screenWidth = Dimensions.get('window').width;
    styles = {
        card: {
            borderRadius:24,
            padding:16,
            elevation:5,
            margin:8,
            flex:1,
            flexDirection:'row'
        },
        infos: {
            flex: .5,
        },
        totalSpared: {
            flex:.5,
            fontSize: 32,
            color: '#fff',
            textAlign: 'right',
            fontWeight: 'bold'
        },
        infosText: {
            color: '#fff',
        },
        title: {
            fontSize: 24,
            fontWeight: '700'
        },
        touchableButton: {
            justifyContent: 'center',
            flex:1
        },
        touchableButtonText: {
            marginLeft:16,
            elevation: 5,
        }
    };
    deleteButton = [
        <View style={{ ...this.styles.touchableButton, flexDirection: 'column', alignItems:'flex-end'}}>
            <IconButton
                icon={'delete'}
                size={28}
                style={{...this.styles.touchableButtonText, backgroundColor:'#e53935'}}
                color={'#fff'}
                onPress={() => this.props.removeItem(this.props.id)}
            />
        </View>
    ];
    rightButtons = [
        <View style={this.styles.touchableButton}>
            <IconButton
                icon={'plus'}
                size={28}
                style={{...this.styles.touchableButtonText, backgroundColor:this.colorAverage(this.props.item.gradient)}}
                color={'#fff'}
                onPress={() => {
                    this.props.incrementItem(this.props.id);
                    this.swipeable.recenter()
                }}
            />
        </View>,
        <View style={this.styles.touchableButton}>
            <IconButton
                icon={'minus'}
                size={28}
                style={{...this.styles.touchableButtonText, backgroundColor:this.colorAverage(this.props.item.gradient)}}
                color={'#fff'}
                onPress={() => {
                    this.props.decrementItem(this.props.id);
                    this.swipeable.recenter()
                }}
            />
        </View>
    ];

    swipeable = null;

    constructor(props) {
        super(props);
    }

    handleUserBeganScrollingParentView() {
        this.swipeable.recenter();
    }

    render() {
        return (
            <Swipeable
                leftButtons={this.deleteButton}
                rightButtons={this.rightButtons}
                leftActionActivationDistance={this.screenWidth*.5}
                onRef={ref => this.swipeable = ref}
            >
                <LinearGradient style={this.styles.card} colors={this.props.item.gradient} start={{x: 0, y:0}} end={{x:1.5, y:1}}>
                    <View style={this.styles.infos}>
                        <Text style={{...this.styles.infosText, ...this.styles.title}}>{this.props.item.name}</Text>
                        <Text style={this.styles.infosText}>{this.props.item.price}€/unit</Text>
                    </View>
                    <Text style={this.styles.totalSpared}>{Math.round(this.props.item.price*this.props.item.amount*100)/100}€</Text>
                </LinearGradient>
            </Swipeable>
        );
    }
}
