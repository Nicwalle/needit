import React, {Component} from 'react';
import {Dimensions, Text, View} from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import {TextInput, Button, HelperText} from "react-native-paper";

export class CreateItemModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screenWidth: Dimensions.get('window').width,
            newItem: {
                name: undefined,
                price: undefined
            },
            newItemError: {
                name: false,
                price: false
            }
        };
        this.styles = {
            modalTitle: {fontFamily:'Roboto', fontSize:24, marginTop:-24, marginBottom: 8, textAlign:'center'},
            bottomSheetContainer: {alignItems: "center", borderTopLeftRadius:25, borderTopRightRadius:25},
            textInput: {backgroundColor:'#fff', width:this.state.screenWidth*.85, marginTop:0},
        };
    }
    styles;
    bottomSheet;
    pricePerUnitRef;

    addItem() {
        const newItem = this.state.newItem;
        let newItemError = this.state.newItemError;
        let error = false;
        if (newItem.name === undefined || newItem.name === '') {
            newItemError.name = true;
            error = true;
        }
        if (newItem.price === undefined || newItem.price === '') {
            newItemError.price = true;
            error = true;
        }
        this.setState({newItemError});
        if (!error) {
            this.props.addItem({
                name: newItem.name,
                price: parseFloat(newItem.price),
                amount:0
            });
            this.bottomSheet.close();
        }

    }

    setModalVisible() {
        this.bottomSheet.open();
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(null)
    }

    render() {
        return (
            <RBSheet
                ref={ref => {
                    this.bottomSheet = ref;
                }}
                height={320}
                duration={250}
                closeOnDragDown={true}
                customStyles={{
                    container: this.styles.bottomSheetContainer
                }}
            >
                <View style={{marginTop: 22}}>
                    <View>
                        <Text style={this.styles.modalTitle}>New item I don't need</Text>
                        <TextInput
                            label='Item name'
                            onChangeText={text => this.setState({
                                newItem: { ...this.state.newItem, name:text },
                                newItemError: {...this.state.newItemError, name: text === ''}
                            })}
                            mode={'outlined'}
                            style={this.styles.textInput}
                            disableFullscreenUI={true}
                            onSubmitEditing={() => this.pricePerUnitRef.focus()}
                            blurOnSubmit={false}
                            autoFocus={true}
                            returnKeyType={'next'}
                            selectionColor={'#ce93d8'}
                            error={this.state.newItemError.name}
                        />
                        <HelperText type="error" visible={this.state.newItemError.name}>Item name is needed</HelperText>
                        <TextInput
                            label='Price/unit'
                            onChangeText={text => this.setState({
                                newItem: { ...this.state.newItem, price:!isNaN(text)?text:undefined },
                                newItemError: {...this.state.newItemError, price: isNaN(text)}
                            })}
                            mode={'outlined'}
                            style={this.styles.textInput}
                            keyboardType={'numeric'}
                            disableFullscreenUI={true}
                            ref={ref => this.pricePerUnitRef = ref}
                            error={this.state.newItemError.price}

                        />
                        <HelperText type="error" visible={this.state.newItemError.price}>Item price must be a number</HelperText>
                        <Button
                            icon="cart-remove"
                            mode="contained"
                            onPress={() => this.addItem()}
                        >
                            Stop buying
                        </Button>
                    </View>
                </View>
            </RBSheet>
        );
    }
}
