import * as React from 'react';
import { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import store from '../src/redux/store';
import { useSelector } from 'react-redux';
import { addOneDragon, getAllDragons, nextDragonId } from '../src/reducer';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import IDragon from '../src/entities/dragon';
import { DragonListItem } from '../components/DragonListItem';

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <DragonListItem item={item} backgroundColor={backgroundColor} textColor={textColor} />
  </TouchableOpacity>
);

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  
  console.log('Initial state: ', store.getState());

  const unsubscribe = store.subscribe(() =>
    console.log('State after dispatch: ', store.getState())
  )

  store.dispatch(getAllDragons);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Here for the MVP get</Text>
      <View style={styles.separatorH} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <App navigation={navigation}/>
    </View>
  );
}



const App = ({navigation}: RootTabScreenProps<'TabOne'>) => {
  // const [selectedId, setSelectedId] = useState(null);
  const selectedId: number = useSelector((state: any) => state.selectedId);
  const display: [IDragon] = useSelector((state: any) => state.dragons);
  const sorted = display.sort((a, b) => a.id - b.id);

  function handleClick(id: any) {
    const previousId = selectedId;
    if (previousId === id && id != -1) {
      navigation.navigate('TabTwo');
    } else {
      store.dispatch({ type: 'store/select', payload: id});
    }
  }

  const renderItem = ({ item, index }) => {
    const backgroundColor = item.id === selectedId ? "#3b3b6e" : (index % 2 == 0 ? "#e2e2ff" : "#a2a2ff");
    const color = item.id === selectedId ? 'white' : 'black';

    if (store.getState().state == 'loading') {
      return <Text style={styles.item}>Loading...</Text>
    }
    return (
      <Item
        item={item}
        onPress={() => handleClick(item.id)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  const renderInput = () => {
    const [nameText, setNameText] = useState('');
    const [originText, setOriginText] = useState('');
    const [isFlying, setIsFlying] = useState(false);
    const [isMagic, setIsMagic] = useState(false);
    const toggleFlight = () => setIsFlying(previousState => !previousState);
    const toggleMagic = () => setIsMagic(previousState => !previousState);

    const [isEastern, setIsEastern] = useState(false);
    const [isInspired, setIsInspired] = useState(false);
    const toggleEastern = () => setIsEastern(previousState => !previousState);
    const toggleInspired = () => setIsInspired(previousState => !previousState);

    const numberRegEx = /^\d*\.{0,1}\d*/g;
    const [wingNum, setWingNum] = useState('');
    const [legNum, setLegNum] = useState('');
    const [weightNum, setWeightNum] = useState('');
    const [lengthNum, setLengthNum] = useState('');
    const validateWings = (input: string) => {
      let actual = input.match(numberRegEx)
      if (actual) {
        setWingNum(actual[0]);
      }
    }
    const validateLegs = (input: string) => {
      let actual = input.match(numberRegEx)
      if (actual) {
        setLegNum(actual[0]);
      }
    }
    const validateWeight = (input: string) => {
      let actual = input.match(numberRegEx)
      if (actual) {
        setWeightNum(actual[0]);
      }
    }
    const validateLength = (input: string) => {
      let actual = input.match(numberRegEx)
      if (actual) {
        setLengthNum(actual[0]);
      }
    }

    const handleSave = async () => {
      const trailingRegEx = /\.$/;
      const leadingRegEx = /^\./;
      const dStyle = (isEastern ? 'Eastern' : 'Western') + (isInspired ? '-inspired' : '');
      const newDragon: IDragon = {
        id: nextDragonId(store.getState().dragons),
        name: nameText,
        origin: originText,
        style: dStyle,
        // Perhaps complicated, but each of these lines will check for both trailing and leading decimals
        //  and deal with them accordingly.
        wings: +(wingNum.replace(leadingRegEx, '0.').replace(trailingRegEx, '')),
        legs: +(legNum.replace(leadingRegEx, '0.').replace(trailingRegEx, '')),
        weight: +(weightNum.replace(leadingRegEx, '0.').replace(trailingRegEx, '')),
        length: +(lengthNum.replace(leadingRegEx, '0.').replace(trailingRegEx, '')),
        flight: isFlying,
        magical: isMagic,
      }

      try {
        const res = await store.dispatch(addOneDragon(newDragon));
        store.dispatch(getAllDragons);
      } catch (error) {
        console.log(error);
      }
      
    }

    const backgroundColor = "#e2e2ff";
    const color = 'black';


    if (Dimensions.get('window').width > 1000) {
      return (
        <View style={[styles.displayBox, {backgroundColor: backgroundColor}]}>
          <TouchableOpacity onPress={handleSave} style={[styles.item, {backgroundColor: '#a0a0ff', borderRadius: 5}]}>
            <Text style={[{color: 'black'}]}>Save</Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback style={styles.displayBox} onPress={() => handleClick(-1)}>
          <Text style={[styles.title, {color: color}]}>{nextDragonId(store.getState().dragons)}</Text>
          <TextInput 
            style={[styles.borderedItem, {backgroundColor: backgroundColor}]}
            placeholder="Dragon's Name"
            defaultValue={nameText}
            onChangeText={(text) => setNameText(text)}
          />
          <TextInput 
            style={[styles.borderedItem, {backgroundColor: backgroundColor}]}
            placeholder="What is it from?"
            defaultValue={originText}
            onChangeText={(text) => setOriginText(text)}
          />
          <TouchableOpacity onPress={toggleEastern} style={[styles.item, {backgroundColor: '#d0d0ff', borderRadius: 5}]}>
            <Text style={[{color: 'black'}]}>{isEastern ? 'Eastern' : 'Western'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleInspired} style={[styles.item, {backgroundColor: '#d0d0ff', borderRadius: 5}]}>
            <Text style={[{color: 'black'}]}>{isInspired ? '-inspired' : ' actual'}</Text>
          </TouchableOpacity>
          <TextInput 
            style={[styles.borderedItem, {backgroundColor: backgroundColor}]}
            placeholder="Wings"
            value={wingNum}
            onChangeText={(text) => validateWings(text)}
            keyboardType={'decimal-pad'}
          />
          <TextInput 
            style={[styles.borderedItem, {backgroundColor: backgroundColor}]}
            placeholder="Legs"
            value={legNum}
            onChangeText={(text) => validateLegs(text)}
            keyboardType={'decimal-pad'}
          />
          <TextInput 
            style={[styles.borderedItem, {backgroundColor: backgroundColor}]}
            placeholder="Length"
            value={lengthNum}
            onChangeText={(text) => validateLength(text)}
            keyboardType={'decimal-pad'}
          />
          <TextInput 
            style={[styles.borderedItem, {backgroundColor: backgroundColor}]}
            placeholder="Weight"
            value={weightNum}
            onChangeText={(text) => validateWeight(text)}
            keyboardType={'decimal-pad'}
          />
          <TouchableOpacity onPress={toggleFlight} style={[styles.item, {backgroundColor: '#d0d0ff', borderRadius: 5}]}>
            <Text style={[{color: 'black'}]}>{isFlying ? 'Flying' : 'Non-flying'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMagic} style={[styles.item, {backgroundColor: '#d0d0ff', borderRadius: 5}]}>
            <Text style={[{color: 'black'}]}>{isMagic ? 'Magical' : 'Non-magical'}</Text>
          </TouchableOpacity>
          </TouchableWithoutFeedback>
        </View>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => {
          handleClick(-1);
          navigation.navigate('TabTwo');
        }} style={[styles.displayBox, {backgroundColor: backgroundColor}]}>
          <Text style={[styles.title, {color: color}]}>Add New Dragon</Text>
        </TouchableOpacity>
      )
    }
  }

  return (
    <SafeAreaView style={[styles.container, {maxHeight: (Dimensions.get('window').height * 0.7)}]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, {maxHeight: (Dimensions.get('window').height * 0.7), paddingBottom: 70}]}
      >
      <FlatList
        ListFooterComponent={renderInput}
        data={sorted}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        extraData={sorted}
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  borderedItem: {
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 10,
    borderWidth: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  separatorH: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  separatorV: {
    marginHorizontal: 10,
    width: 1,
    height: '80%',
  }
});
