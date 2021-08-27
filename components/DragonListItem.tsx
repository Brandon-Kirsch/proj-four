import React, { useState } from "react";
import { Dimensions, StyleSheet, } from "react-native";
import { Text, View } from "./Themed";


export const DragonListItem = ({ item, backgroundColor, textColor }) => {
    const wingString = +item.wings === 1 ? 'wing' : 'wings';
    const legString = +item.legs === 1 ? 'leg' : 'legs';
    
    if (Dimensions.get('window').width > 1000) {
        return (
        <View style={[styles.displayBox, backgroundColor, {width: (Dimensions.get('window').width * 0.85)}]}>
        <Text style={[styles.title, {flex: 1}, textColor]}>{item.id}</Text>
        <View style={styles.separatorV} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={[styles.title, {flex: 3}, textColor]}>{item.name}</Text>
        <View style={styles.separatorV} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={[styles.title, {flex: 5}, textColor]}>{item.origin}</Text>
        <View style={styles.separatorV} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={[styles.title, {flex: 3}, textColor]}>{item.style}</Text>
        <View style={styles.separatorV} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={[styles.title, {flex: 1}, textColor]}>{item.wings} {wingString}</Text>
        <View style={styles.separatorV} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={[styles.title, {flex: 1}, textColor]}>{item.legs} {legString}</Text>
        <View style={styles.separatorV} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={[styles.title, {flex: 1}, textColor]}>{item.length} m</Text>
        <View style={styles.separatorV} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={[styles.title, {flex: 1}, textColor]}>{item.weight} kg</Text>
        <View style={styles.separatorV} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={[styles.title, {flex: 1}, textColor]}>{item.flight ? 'Flying' : 'Non-flying'}</Text>
        <View style={styles.separatorV} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={[styles.title, {flex: 1}, textColor]}>{item.magical ? 'Magical' : 'Non-magical'}</Text>
        </View>
    )} else {
        return (
            <View style={[styles.displayBox, backgroundColor, {width: (Dimensions.get('window').width * 0.85)}]}>
                <Text style={[styles.title, {flex: 1}, textColor]}>{item.id}</Text>
                <View style={styles.separatorV} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                <Text style={[styles.title, {flex: 4}, textColor]}>{item.name}</Text>
            </View>
        )}
    };

  const styles = StyleSheet.create({
    displayBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

    },
    item: {
      padding: 5,
      marginVertical: 3,
      marginHorizontal: 3,
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