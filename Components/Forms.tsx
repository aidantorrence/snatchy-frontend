import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const fieldTitles = {
  name: "Name",
  condition: "Condition",
  size: "Size",
  price: "Price",
  timesWorn: "How many times worn?",
  scuffMarks: "Are there scuff marks? (add details)",
  discoloration: "Discoloration? (add details)",
  looseThreads: "Loose threads? (add details)",
  heelDrag: "Heel drag? (add details)",
  toughStains: "Tough stains? (add details)",
  gender: "Mens/Womens",
  boxCondition: "Box Condition",
  canTrade: "Allow Trades?",
} as any;

export function InputForm({ formData, setFormData, focusedState, setFocusedState, error, field, keyboardType, setError }: any) {
  const handleChange = (text: string) => {
    setFormData({ ...formData, [field]: text });
  };
  const handleFocus = () => {
    setError({ ...error, [field]: "" });
    setFocusedState({ ...focusedState, [field]: true });
  };
  const handleBlur = () => {
    setFocusedState({ ...focusedState, [field]: false });
  };
  return (
    <View style={styles.detailsContainer}>
      {focusedState[field] || formData[field] ? <Text style={styles.detailsTitle}>{fieldTitles[field]}</Text> : null}
      <TextInput
        value={formData[field]}
        onChangeText={handleChange}
        style={formData[field] ? styles.detailsAnswer : styles.detailsPlaceholder}
        placeholder={focusedState[field] ? "" : fieldTitles[field]}
        placeholderTextColor="gray"
        autoCorrect={false}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType={keyboardType}
      />
      {error[field] ? <Text style={styles.error}>{error[field]}</Text> : null}
    </View>
  );
}

export function DropDownForm({ formData, error, setError, field, openOptionsModal }: any) {
  const handlePress = () => {
    setError({ ...error, [field]: "" });
    openOptionsModal(field);
  };
  return (
    <TouchableOpacity style={styles.detailsContainer} onPress={handlePress}>
      <View style={styles.dropDownContainer}>
        <Text style={formData[field] ? styles.detailsTitle : styles.detailsPlaceholder}>{fieldTitles[field]}</Text>
        <Image source={require("../assets/dropDownCaret.png")} style={styles.dropDownCaret} />
      </View>
      {formData[field] ? <Text style={styles.detailsAnswer}>{formData[field]}</Text> : null}
      {error[field] ? <Text style={styles.error}>{error[field]}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
  detailsPlaceholder: {
    fontSize: 25,
    color: "gray",
    paddingVertical: 3,
  },
  detailsAnswer: {
    fontSize: 25,
    fontWeight: "bold",
    paddingVertical: 3,
  },
  detailsTitle: {
    fontSize: 14,
    color: "gray",
    paddingVertical: 3,
  },
  detailsContainer: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#aaa",
    paddingVertical: 5,
  },
  dropDownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropDownCaret: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});
