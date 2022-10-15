import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dimensions } from "react-native";

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
  address: "Address",
  city: "City",
  state: "State",
  zipcode: "Zipcode",
  country: "Country",
  optionalAddress: "Apt/Suite/Other (optional)",
} as any;

export function InputForm({ formData, setFormData, focusedState, setFocusedState, error, field, keyboardType, setError }: any) {
  const handleChange = (text: string) => {
    setFormData({ ...formData, [field]: text });
  };
  const handleFocus = () => {
    setFocusedState({ ...focusedState, [field]: true });
    if (field !== "optionalAddress") {
      setError({ ...error, [field]: "" });
    }
  };
  const handleBlur = () => {
    setFocusedState({ ...focusedState, [field]: false });
  };
  return (
    <View style={styles.detailsContainer}>
      <View>
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
      <View>
        <Text style={formData[field] ? styles.detailsTitle : styles.detailsPlaceholder}>{fieldTitles[field]}</Text>
        {formData[field] ? <Text style={styles.detailsAnswer}>{formData[field]}</Text> : null}
      </View>
      <Image source={require("../assets/dropDownCaret.png")} style={styles.dropDownCaret} />
      {error[field] ? <Text style={styles.error}>{error[field]}</Text> : null}
    </TouchableOpacity>
  );
}

export function EditInputForm({
  data,
  formData,
  setFormData,
  editMode,
  setEditMode,
  error,
  field,
  keyboardType,
  setError,
  openInputModal,
}: any) {
  const handleChange = (text: string) => {
    setFormData({ ...formData, [field]: text });
  };
  const handleFocus = () => {
    setError({ ...error, [field]: "" });
    setEditMode({ ...editMode, [field]: true });
  };
  const handleBlur = () => {
    setEditMode({ ...editMode, [field]: false });
  };
  return (
    <View style={styles.detailsContainer}>
      <View>
        <Text style={styles.detailsTitle}>{fieldTitles[field]}</Text>
        {editMode[field] ? (
          <TextInput
            value={formData[field]}
            onChangeText={handleChange}
            style={formData[field] ? styles.detailsAnswer : styles.detailsPlaceholder}
            placeholder={editMode[field] ? "" : fieldTitles[field]}
            placeholderTextColor="gray"
            autoCorrect={false}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType={keyboardType}
          />
        ) : (
          <Text style={styles.detailsAnswer}>{data[field]}</Text>
        )}
        {error[field] ? <Text style={styles.error}>{error[field]}</Text> : null}
      </View>
      <Button title="Edit" onPress={() => openInputModal(field)} />
    </View>
  );
}

export function EditDropDownForm({ data, formData, editMode, setEditMode, error, setError, field, openOptionsModal }: any) {
  const parseData = () => {
    if (typeof data[field] === "boolean") {
      return data[field] ? "Yes" : "No";
    }
    return data[field];
  };
  const handlePress = () => {
    openOptionsModal(field);
    setEditMode({ ...editMode, [field]: true });
  };
  return (
    <View style={styles.detailsContainer}>
      <View>
        <Text style={styles.detailsTitle}>{fieldTitles[field]}</Text>
        <Text style={styles.detailsAnswer}>{parseData()}</Text>
      </View>
      <Button title="Edit" onPress={handlePress} />
      {error[field] ? <Text style={styles.error}>{error[field]}</Text> : null}
    </View>
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
    width: Dimensions.get("window").width,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexContainer: {
    width: "100%",
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
