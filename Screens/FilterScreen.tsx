import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { useStore } from "../utils/firebase/useAuthentication";
import { NavigationHelpersContext } from "@react-navigation/native";

export default function FilterScreen({ navigation }: any) {
  const handleModusTypePress = () => {
    navigation.navigate("ModusTypeFilter");
  };
  const handleSeasonalColorPress = () => {
    navigation.navigate("SeasonalColorFilter");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity style={styles.filterButton} onPress={handleModusTypePress}>
          <Text style={styles.filterButtonText}>Modus Type</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={handleSeasonalColorPress}>
          <Text style={styles.filterButtonText}>Seasonal Color</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export function ModusTypeFilterScreen({ navigation }: any) {
  const modusTypes = [
    "Queen",
    "Boss",
    "Coquette",
    "Supermodel",
    "Siren",
    "Lady",
    "Feline",
    "Ingenue",
    "Vixen",
    "Femme Fatale",
  ];
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [checked, setChecked] = useState(new Array(modusTypes.length).fill(false));
  function handleReturn() {
    setUser({
      ...user,
      currentModusTypes: checked
        .map((el, index) => {
          if (el) return modusTypes[index];
        })
    });
    navigation.navigate("Home");
  }

  return (
    <SafeAreaView style={styles.filterContainer}>
      {modusTypes.map((modusType, index) => {
        return (
          <View style={styles.checkboxContainer} key={index}>
            <Text style={styles.checkboxText}>{modusType}</Text>
            <Checkbox
              style={styles.checkbox}
              value={checked[index]}
              onValueChange={(newValue) => {
                const newChecked = [...checked];
                newChecked[index] = newValue;
                setChecked(newChecked);
              }}
            />
          </View>
        );
      })}
      <TouchableOpacity style={styles.filterCompleteButton} onPress={handleReturn}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export function SeasonalColorFilterScreen({ navigation }: any) {
  const seasonalColors = [
    "Light Spring",
    "True Spring",
    "Bright Spring",
    "Light Summer",
    "True Summer",
    "Soft Summer",
    "Dark Autumn",
    "True Autumn",
    "Soft Autumn",
    "Dark Winter",
    "True Winter",
    "Bright Winter",
  ];
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [checked, setChecked] = useState(new Array(seasonalColors.length).fill(false));
  function handleReturn() {
    setUser({
      ...user,
      currentSeasonalColors: checked
        .map((el, index) => {
          if (el) return seasonalColors[index];
        })
    });
    navigation.navigate("Home");
  }

  return (
    <SafeAreaView style={styles.filterContainer}>
      {seasonalColors.map((seasonalColor, index) => {
        return (
          <View style={styles.checkboxContainer} key={index}>
            <Text style={styles.checkboxText}>{seasonalColor}</Text>
            <Checkbox
              style={styles.checkbox}
              value={checked[index]}
              onValueChange={(newValue) => {
                const newChecked = [...checked];
                newChecked[index] = newValue;
                setChecked(newChecked);
              }}
            />
          </View>
        );
      })}
      <TouchableOpacity style={styles.filterCompleteButton} onPress={handleReturn}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    margin: 10,
  },
  checkboxText: {
    marginRight: 5,
  },
  checkbox: {},
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    flex: 1,
    // alignItems: 'center',
    justifyContent: "center",
  },
  filterContainer: {
    padding: 20,
    flexWrap: "wrap",
    flexDirection: "row",
    backgroundColor: "white",
    flex: 1,
    // alignItems: 'center',
    justifyContent: "center",
  },
  filterButton: {
    backgroundColor: "#F487D2",
    borderRadius: 100,
    margin: 10,
    width: 150,
    padding: 20,
  },
  filterCompleteButton: {
    backgroundColor: "#F487D2",
    borderRadius: 100,
    marginTop: 30,
    margin: 10,
    width: 150,
    padding: 20,
  },
  filterButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
