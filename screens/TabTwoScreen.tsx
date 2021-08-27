import * as React from 'react';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Switch, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { Text, View } from '../components/Themed';
import IDragon from '../src/entities/dragon';
import { getAllDragons, removeOneDragon, selectByID, nextDragonId, updateDragon, addOneDragon } from '../src/reducer';
import store from '../src/redux/store';
import { useIsFocused } from '@react-navigation/native';
import { RootTabScreenProps } from '../types';

export default function TabTwoScreen({ navigation }: RootTabScreenProps<'TabTwo'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="/screens/TabTwoScreen.tsx" /> */}
      <EditTab navigation={navigation} />
    </View>
  );
}

const EditTab = ({ navigation }: RootTabScreenProps<'TabOne'>) => {
  const dragon: IDragon | undefined = useSelector(state => selectByID(state, store.getState().selectedId))

  const isFocused = useIsFocused();
  const [nameInput, setNameInput] = useState(dragon ? dragon.name : '');
  const [originInput, setOriginInput] = useState(dragon ? dragon.origin : '');
  const [styleInput, setStyleInput] = useState(dragon ? dragon.style : '');
  const [wingsInput, setWingsInput] = useState(dragon && dragon.wings ? dragon.wings.toString() : '');
  const [legsInput, setLegsInput] = useState(dragon && dragon.legs ? dragon.legs.toString() : '');
  const [weightInput, setWeightInput] = useState(dragon && dragon.weight ? dragon.weight.toString() : '');
  const [lengthInput, setLengthInput] = useState(dragon && dragon.length ? dragon.length.toString() : '');
  const [flightInput, setFlightInput] = useState(dragon ? dragon.flight : false);
  const [magicInput, setMagicInput] = useState(dragon ? dragon.magical : false);
  const [deleteEnabled, setDeleteEnabled] = useState(true);
  const [deletePrimed, setDeletePrimed] = useState(false);
  const [isError, setIsError] = useState(false);

  const clearInputs = () => {
    setNameInput('');
    setOriginInput('');
    setStyleInput('');
    setWingsInput('');
    setLegsInput('');
    setWeightInput('');
    setLengthInput('');
    setFlightInput(false);
    setMagicInput(false);
  }

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
    if (!deletePrimed && deleteEnabled){
      setDeleteEnabled(false);
      setDeletePrimed(true);
      setTimeout(allowDelete, 3000);
    } else if (deleteEnabled && deletePrimed) {
      handleDelete(dragon)
    }
  }

  const allowDelete = () => {
    setDeleteEnabled(true);
  }

  const handleDelete = async (targetDragon: IDragon | undefined) => {
    if (targetDragon && targetDragon.id !== -1) {
      try {
        const res = await store.dispatch(removeOneDragon(targetDragon));
        store.dispatch(getAllDragons);
      } catch (error) {
        console.log(error);
      }
    }
    clearInputs();
    navigation.navigate('TabOne');
  }

  const parseInputs = (id: number) => {
    const trailingRegEx = /\.$/;
    const leadingRegEx = /^\./;

    const formDragon: IDragon = {
      id: id,
      name: nameInput.trim(),
      origin: originInput?.trim(),
      style: styleInput?.trim(),
      wings: +(wingsInput.replace(leadingRegEx, '0.').replace(trailingRegEx, '')),
      legs: +(legsInput.replace(leadingRegEx, '0.').replace(trailingRegEx, '')),
      weight: +(weightInput.replace(leadingRegEx, '0.').replace(trailingRegEx, '')),
      length: +(lengthInput.replace(leadingRegEx, '0.').replace(trailingRegEx, '')),
      flight: flightInput,
      magical: magicInput,
    }

    return formDragon;
  }

  const handleUpdate = async (targetDragon: IDragon | undefined) => {
    if (nameInput == '') {
      setIsError(true);
    } else {
      // Checks to see if this dragon already exists
      if (targetDragon && targetDragon.id !== -1) {
        const formData = parseInputs(targetDragon.id);

        const updatedDragon: IDragon = {
          ...targetDragon,
          flight: formData.flight,
          magical: formData.magical,
        }
        // All this does is make it so that an empty text box does not cause
        //  any data loss
        if (!updatedDragon.origin || formData.origin && formData.origin !== '') updatedDragon.origin = formData.origin;
        if (!updatedDragon.style || formData.style && formData.style !== '') updatedDragon.style = formData.style;
        // The numeric values check instead their text field, for the same purposes as above
        if (!updatedDragon.wings || formData.wings && wingsInput !== '') updatedDragon.wings = formData.wings;
        if (!updatedDragon.legs || formData.legs && legsInput !== '') updatedDragon.legs = formData.legs;
        if (!updatedDragon.weight || formData.weight && weightInput !== '') updatedDragon.weight = formData.weight;
        if (!updatedDragon.length || formData.length && lengthInput !== '') updatedDragon.length = formData.length;
        // First we want to know if name has been updated
        //  If it has, this has to be a delete/reupload
        //  We'll take care of a non-name update first
        if (targetDragon.name == nameInput.trim() || nameInput.trim() == '') {
          try {
            const res = await store.dispatch(updateDragon(updatedDragon));
            store.dispatch(getAllDragons);
          } catch (error) {
            console.log(error);
          }
        } else {
          updatedDragon.name = nameInput;
          try {
            const delRes = await store.dispatch(removeOneDragon(targetDragon));
            const updRes = await store.dispatch(addOneDragon(updatedDragon));
            store.dispatch(getAllDragons);
          } catch (error) {
            console.log(error);
          }
        }
      
      // Code for when it's a new dragon altogether
      } else if (!targetDragon || targetDragon.id === -1) {
        const newDragon = parseInputs(nextDragonId(store.getState().dragons));
        try {
          const res = await store.dispatch(addOneDragon(newDragon));
          store.dispatch(getAllDragons);
        } catch (error) {
          console.log(error);
        }
      }

      navigation.navigate('TabOne');
    }
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
          style={[styles.textInput, {borderColor: isError ? 'red' : 'black'}]}
          onChangeText={(text) => {
            setNameInput(text)
            setIsError(false)
          }}
          value={nameInput}
          placeholder={isError ? 'Name is required' : ''}
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
      <TouchableOpacity onPress={() => handleUpdate(dragon)} style={[{backgroundColor: '#46d', borderRadius: 8}]}>
        <Text style={[styles.text, {margin: 8, fontWeight: 'bold'}]}>{!dragon || dragon.id == -1 ? 'Add Dragon' : 'Update Dragon'}</Text>
      </TouchableOpacity>
      <ToggleableDelete />
    </KeyboardAvoidingView>
)} else {
  if (dragon && dragon.name != nameInput) {setNameInput(dragon.name)}
  if (dragon && dragon.origin != originInput) {setOriginInput(dragon.origin)}
  if (dragon && dragon.style != styleInput) {setStyleInput(dragon.style)}
  if (dragon && dragon.wings && dragon.wings.toString() != wingsInput) {setWingsInput(dragon.wings.toString())}
  if (dragon && dragon.legs && dragon.legs.toString() != legsInput) {setLegsInput(dragon.legs.toString())}
  if (dragon && dragon.weight && dragon.weight.toString() != weightInput) {setWeightInput(dragon.weight.toString())}
  if (dragon && dragon.length && dragon.length.toString() != lengthInput) {setLengthInput(dragon.length.toString())}
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
