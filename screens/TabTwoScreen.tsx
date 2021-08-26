import * as React from 'react';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Switch, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { Text, View } from '../components/Themed';
import IDragon from '../src/entities/dragon';
import { selectByID } from '../src/reducer';
import store from '../src/redux/store';
import { useIsFocused } from '@react-navigation/native';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="/screens/TabTwoScreen.tsx" /> */}
      <EditTab />
    </View>
  );
}

const EditTab = () => {
  const dragon: IDragon | undefined = useSelector(state => selectByID(state, store.getState().selectedId))

  const isFocused = useIsFocused();
  const [nameInput, setNameInput] = useState(dragon ? dragon.name : '');
  const [originInput, setOriginInput] = useState(dragon ? dragon.origin : '');
  const [styleInput, setStyleInput] = useState(dragon ? dragon.style : '');
  const [wingsInput, setWingsInput] = useState(dragon ? dragon.wings.toString() : '');
  const [legsInput, setLegsInput] = useState(dragon ? dragon.legs.toString() : '');
  const [weightInput, setWeightInput] = useState(dragon ? dragon.weight.toString() : '');
  const [lengthInput, setLengthInput] = useState(dragon ? dragon.length.toString() : '');
  const [flightInput, setFlightInput] = useState(dragon ? dragon.flight : false);
  const [magicInput, setMagicInput] = useState(dragon ? dragon.magical : false);
  const [deleteEnabled, setDeleteEnabled] = useState(true);
  const [deletePrimed, setDeletePrimed] = useState(false);

  const numberRegEx = /^\d*\.{0,1}\d*/g;
  const validateWings = (input: string) => {
    let actual = input.match(numberRegEx)
    if (actual) {
      setWingsInput(actual[0]);
    }
  }
  const validateLegs = (input: string) => {
    let actual = input.match(numberRegEx)
    if (actual) {
      setLegsInput(actual[0]);
    }
  }
  const validateWeight = (input: string) => {
    let actual = input.match(numberRegEx)
    if (actual) {
      setWeightInput(actual[0]);
    }
  }
  const validateLength = (input: string) => {
    let actual = input.match(numberRegEx)
    if (actual) {
      setLengthInput(actual[0]);
    }
  }

  const switchFlight = () => setFlightInput(previousState => !previousState);
  const switchMagic = () => setMagicInput(previousState => !previousState);

  const delayDelete = () => {
    setDeleteEnabled(false);
    setDeletePrimed(true);
    setTimeout(allowDelete, 3000);
  }

  const allowDelete = () => {
    setDeleteEnabled(true);
  }

  const ToggleableDelete = () => {
    if (deleteEnabled) {
      return (
        <TouchableOpacity onPress={delayDelete} style={[{backgroundColor: '#944', borderRadius: 8, opacity: (deleteEnabled ? 1 : 0.2)}]}>
          <Text style={[styles.text, {margin: 8, fontWeight: 'bold'}]}>{deletePrimed ? 'Are you sure?' : 'Delete'}</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={[{backgroundColor: '#944', borderRadius: 8, opacity: 0.2}]}>
          <Text style={[styles.text, {margin: 8, fontWeight: 'bold'}]}>{deletePrimed ? 'Are you sure?' : 'Delete'}</Text>
        </View>
      )
    }
  }
  
  if (isFocused) {
  return (
  <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.pair}>
        <Text style={styles.text}>Name</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setNameInput(text)}
          value={nameInput}
        />
      </View>
      <View style={styles.pair}>
        <Text style={styles.text}>Origin</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setOriginInput(text)}
          value={originInput}
        />
      </View>
      <View style={styles.pair}>
        <Text style={styles.text}>Style</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setStyleInput(text)}
          value={styleInput}
        />
      </View>
      <View style={styles.pair}>
        <Text style={styles.text}>Wings</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => validateWings(text)}
          value={wingsInput}
        />
      </View>
      <View style={styles.pair}>
        <Text style={styles.text}>Legs</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => validateLegs(text)}
          value={legsInput}
        />
      </View>
      <View style={styles.pair}>
        <Text style={styles.text}>Weight (Kilos)</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => validateWeight(text)}
          value={weightInput}
        />
      </View>
      <View style={styles.pair}>
        <Text style={styles.text}>Length (Meters)</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => validateLength(text)}
          value={lengthInput}
        />
      </View>
      <View style={styles.pair}>
        <Text style={styles.text}>{flightInput ? 'Can fly' : "Can't fly"}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={flightInput ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={switchFlight}
          value={flightInput}
        />
      </View>
      <View style={styles.pair}>
        <Text style={styles.text}>{magicInput ? 'Has/uses magic' : "Does not possess magic"}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={magicInput ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={switchMagic}
          value={magicInput}
        />
      </View>
      <ToggleableDelete />
      {/* <TouchableOpacity onPress={delayDelete} style={[{backgroundColor: '#944', borderRadius: 8, opacity: (deleteEnabled ? 1 : 0.2)}]}>
        <Text style={[styles.text, {margin: 8, fontWeight: 'bold'}]}>{deletePrimed ? 'Are you sure?' : 'Delete'}</Text>
      </TouchableOpacity> */}
    </KeyboardAvoidingView>
)} else {
  if (dragon && dragon.name != nameInput) {setNameInput(dragon.name)}
  if (dragon && dragon.origin != originInput) {setOriginInput(dragon.origin)}
  if (dragon && dragon.style != styleInput) {setStyleInput(dragon.style)}
  if (dragon && dragon.wings.toString() != wingsInput) {setWingsInput(dragon.wings.toString())}
  if (dragon && dragon.legs.toString() != legsInput) {setLegsInput(dragon.legs.toString())}
  if (dragon && dragon.weight.toString() != weightInput) {setWeightInput(dragon.weight.toString())}
  if (dragon && dragon.length.toString() != lengthInput) {setLengthInput(dragon.length.toString())}
  if (dragon && dragon.flight != flightInput) {setFlightInput(dragon.flight)}
  if (dragon && dragon.magical != magicInput) {setMagicInput(dragon.magical)}
  if (deletePrimed) {setDeletePrimed(false)}
  return (
    <Text>Is not focused.</Text>
  )
}
}

const styles = StyleSheet.create({
  pair: {
    backgroundColor: "#e2e2ff",
    padding: 8,
    margin: 5,
    borderRadius: 2,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    color: 'black',
  },
  textInput: {
    color: 'black',
    borderWidth: 1,
    backgroundColor: '#eef',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
