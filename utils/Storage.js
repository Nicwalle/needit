export const getSpareItems = async () => {
    try {
        const value = await AsyncStorage.getItem('spareItems');
        if(value !== null) {
            this.setState({spareItems:JSON.parse(value)});
        }
    } catch(e) {
        console.log(e);
    }
};

export const setSpareItems = async () => {
    try {
        await AsyncStorage.setItem('spareItems', JSON.stringify(this.state.spareItems))
    } catch (e) {
        console.log(e);
    }
};

