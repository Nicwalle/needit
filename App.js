/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {StatusBar, View, Text, FlatList, Image, Dimensions} from 'react-native';
import {IconButton} from "react-native-paper";
import {Card} from "./components/Card";
import {CreateItemModal} from "./components/CreateItemModal";
import AsyncStorage from '@react-native-community/async-storage';

class App extends React.Component {

    styles = {
        titleView: {
            marginTop:24,
            marginHorizontal: 16,
            elevation:10,
            flexDirection: 'row'
        },
        titleText: {
            fontFamily: 'San Francisco',
            fontSize: 28,
            fontWeight: '700',
            color: '#212121',
            flex:1
        }
    };

    gradients = [
        ['#f38181', '#fce38a'],
        ['#899cfc', '#cac9ef'],
        ['#3bb2b8', '#42e695'],
        ['#5580eb', '#2aeeff'],
        ['#e95a7d', '#fdb9be'],
        ['#f02fc2', '#6094ea'],
        ['#c53364', '#fd8263'],
    ];

    constructor(props) {
        super(props);
        this.state = {
            spareItems: [],
            totalSpared: 0
        };
        this.gradients = this.gradients.sort(function (a, b) { return 0.5 - Math.random() });
        this.getSpareItems();
    }

    getSpareItems = async () => {
        try {
            const value = await AsyncStorage.getItem('spareItems');
            if(value !== null) {
                this.setState({spareItems:JSON.parse(value)});
            }
        } catch(e) {
            console.log(e);
        }
    };

    setSpareItems = async (items) => {
        try {
            if (items !==undefined) {
                await AsyncStorage.setItem('spareItems', JSON.stringify(items))
            } else {
                await AsyncStorage.setItem('spareItems', JSON.stringify(this.state.spareItems))
            }
        } catch (e) {
            console.log(e);
        }
    };

    getTotalSpared = () => {
        let totalSpared = 0;
        this.state.spareItems.forEach((item)=> {
            totalSpared += item.price * item.amount;
        });
        return Math.round(totalSpared*100)/100
    };

    addItem = (item) => {
        item['gradient'] = this.gradients[Math.floor(Math.random()*this.gradients.length)];
        let newList = [item, ...this.state.spareItems];
        this.setState({spareItems: newList});
        this.setSpareItems(newList);
    };

    removeItem = (id) => {
        let spareItems = [...this.state.spareItems];
        const totalSpared = this.state.totalSpared-this.state.spareItems[id].price*this.state.spareItems[id].amount;
        spareItems.splice(id, 1);

        this.setState({totalSpared, spareItems});
        this.setSpareItems();
    };

    incrementItem = (id) => {
        let spareItems = [...this.state.spareItems];
        spareItems[id].amount += 1;
        this.setState({
            totalSpared:this.state.totalSpared+spareItems[id].price,
            spareItems
        });
        this.setSpareItems();
    };

    decrementItem = (id) => {
        let spareItems = [...this.state.spareItems];
        if (spareItems[id].amount > 0) {
            spareItems[id].amount -= 1;
            this.setState({
                totalSpared:this.state.totalSpared-spareItems[id].price,
                spareItems
            });
        }
        this.setSpareItems();
    };

    showAddItemModal = () => this.createItemModal.setModalVisible();

    renderEmptyList = () => {
        return <View style={{flexDirection:'column', flex: 1, alignItems:'center', justifyContent:'center', marginTop: 64}}>
            <Image
                source={require('./images/empty-box.png')}
                style={{
                    width:Dimensions.get('window').width*.8,
                    height:Dimensions.get('window').width*.8*0.7822
                }}
            />
            <Text style={{marginTop: 32, fontSize: 24, color: '#989898'}}>No items to spare money</Text>
        </View>
    };

    render() {
        return (
            <>
                <StatusBar backgroundColor={'#efefef'} barStyle={'dark-content'} />
                <View style={this.styles.titleView}>
                    <Text style={this.styles.titleText}>Really need it ?</Text>
                    <IconButton icon={'plus'} size={28} onPress={this.showAddItemModal} style={{backgroundColor:'#dedede', marginTop: -2}}/>
                </View>
                <View style={{flex: 1, flexDirection:'column'}}>
                    <View style={{margin:16, alignItems:'center'}}>
                        <Text style={{fontSize: 32}}>{this.getTotalSpared()}€</Text>
                        <Text>{this.state.totalSpared!==0?'already':''} spared</Text>
                    </View>
                    <FlatList
                        data={this.state.spareItems}
                        renderItem={({item, index}) => {
                            return <Card
                                id={index}
                                item={item}
                                removeItem={this.removeItem}
                                incrementItem={this.incrementItem}
                                decrementItem={this.decrementItem}
                            />
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={this.renderEmptyList()}
                    />
                </View>
                <CreateItemModal
                    onRef={ref => (this.createItemModal = ref)}
                    addItem={this.addItem}
                />
            </>
        );
    }
}

export default App;
