import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { useStore } from "../utils/firebase/useAuthentication";
import { NavigationHelpersContext } from "@react-navigation/native";
import { Dimensions } from "react-native";
import analytics from "@react-native-firebase/analytics";
import { mixpanel } from "../utils/mixpanel";

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

export function ModusTypeFilterScreen({ navigation, route }: any) {
  const { currentModusTypes } = route?.params;
  const modusTypes = ["Queen", "Boss", "Coquette", "Supermodel", "Siren", "Lady", "Feline", "Ingenue", "Vixen", "Femme Fatale"];
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [checked, setChecked] = useState(modusTypes.map((modusType) => currentModusTypes.includes(modusType)));
  function handleReturn() {
    setUser({
      ...user,
      currentModusTypes: checked.map((el, index) => {
        if (el) return modusTypes[index];
      }),
    });
    navigation.navigate("Home");
    analytics().logEvent("modus_type_filter_selected", {
      modus_types: checked.map((el, index) => {
        if (el) return modusTypes[index];
      }),
    });
    mixpanel.track("modus_type_filter_selected", {
      modus_types: checked
        .map((el, index) => {
          if (el) return modusTypes[index];
        })
        .filter((el) => el),
    });
  }
  const toggleCheckbox = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !checked[index];
    setChecked(newChecked);
  };
  const handleClear = () => {
    setChecked(new Array(modusTypes.length).fill(false));
  };

  return (
    <SafeAreaView style={styles.filterContainer}>
      <View style={styles.secondaryContainer}>
        <FlatList
          numColumns={3}
          columnWrapperStyle={styles.column}
          data={modusTypes}
          renderItem={({ item, index }: any) => (
            <TouchableOpacity onPress={() => toggleCheckbox(index)} style={styles.checkboxContainerModus}>
              <Checkbox
                style={styles.checkbox}
                value={checked[index]}
                onValueChange={(newValue) => {
                  const newChecked = [...checked];
                  newChecked[index] = newValue;
                  setChecked(newChecked);
                }}
              />
              <Text style={styles.checkboxText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        {/* {modusTypes.map((modusType, index) => {
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
      })} */}
        <View style={styles.controlsButtonContainer}>
          <TouchableOpacity onPress={handleClear} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>CLEAR</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReturn} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>FILTER</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  const [checked, setChecked] = useState(new Array(seasonalColors.length).fill(true));
  function handleReturn() {
    setUser({
      ...user,
      currentSeasonalColors: checked.map((el, index) => {
        if (el) return seasonalColors[index];
      }),
    });
    navigation.navigate("Home");
    analytics().logEvent("seasonal_color_filter_selected", {
      seasonal_colors: checked.map((el, index) => {
        if (el) return seasonalColors[index];
      }),
    });
    mixpanel.track("seasonal_color_filter_selected", {
      seasonal_colors: checked
        .map((el, index) => {
          if (el) return seasonalColors[index];
        })
        .filter((el) => el),
    });
  }
  const toggleCheckbox = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !checked[index];
    setChecked(newChecked);
  };
  const handleClear = () => {
    setChecked(new Array(seasonalColors.length).fill(false));
  };

  return (
    <SafeAreaView style={styles.filterContainer}>
      <View style={styles.secondaryContainer}>
        <FlatList
          numColumns={2}
          columnWrapperStyle={styles.column}
          data={seasonalColors}
          renderItem={({ item, index }: any) => (
            <TouchableOpacity onPress={() => toggleCheckbox(index)} style={styles.checkboxContainer}>
              <Checkbox
                style={styles.checkbox}
                value={checked[index]}
                onValueChange={(newValue) => {
                  const newChecked = [...checked];
                  newChecked[index] = newValue;
                  setChecked(newChecked);
                }}
              />
              <Text style={styles.checkboxText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.controlsButtonContainer}>
          <TouchableOpacity onPress={handleClear} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>CLEAR</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReturn} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>FILTER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  continueButton: {
    marginTop: 40,
    borderRadius: 8,
    padding: 15,
    marginHorizontal: Dimensions.get("window").width * 0.01,
    width: Dimensions.get("window").width * 0.44,
    backgroundColor: "#f2f2f2",
  },
  controlsButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  continueButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  secondaryContainer: {
    alignItems: "center",
  },
  column: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 30,
    width: Dimensions.get("window").width / 2,
    // justifyContent: "center",
    alignItems: "center",
  },
  checkboxContainerModus: {
    flexDirection: "row",
    marginVertical: 10,
    paddingLeft: 30,
    width: Dimensions.get("window").width / 3,
    // justifyContent: "center",
    alignItems: "center",
  },
  checkboxText: {},
  checkbox: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    flex: 1,
    // alignItems: 'center',
    justifyContent: "center",
  },
  filterContainer: {
    // padding: 20,
    flexWrap: "wrap",
    backgroundColor: "white",
    flex: 1,
    // alignItems: 'center',
    // justifyContent: "center",
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
    padding: 10,
    alignSelf: "center",
    borderRadius: 10,
    margin: 20,
    paddingLeft: 30,
    paddingRight: 30,
    width: 210,
  },
  filterButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
