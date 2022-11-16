import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dimensions } from "react-native";

const fieldTitles = {
  kibbeTypes: "Kibbe Type(s)",
  description: "Outfit Description",
  occasions: "Occasion(s)",
  aesthetic: "Aesthetic",
  seasonalColors: "Seasonal Color(s)",
  purchaseLink: "Purchase Link",
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

export function MultiDropDownForm({ formData, setFormData, error, setError, field, openOptionsModal }: any) {
  const handleDeleteMultiOption = (index: number) => {
    const newOptions = formData[field].filter((item: string, fieldIndex: number) => index !== fieldIndex);
    setFormData({ ...formData, [field]: newOptions });
  };

  const handlePress = () => {
    setError({ ...error, [field]: "" });
    openOptionsModal(field);
  };

  return (
    <TouchableOpacity style={styles.detailsContainer} onPress={handlePress}>
      <View>
        <Text style={formData[field].length ? styles.detailsTitle : styles.detailsPlaceholder}>{fieldTitles[field]}</Text>
        <View style={styles.multiDropDownButtonContainer}>
          {formData[field].map((item: any, index: number) => {
            return (
              <TouchableOpacity key={index} style={styles.multiDropDownButton} onPress={() => handleDeleteMultiOption(index)}>
                <Text style={styles.multiDropDownText}>{item}</Text>
                <Image source={require("../assets/X_Logo.png")} style={styles.dropDownCaret} />
              </TouchableOpacity>
            );
          })}
        </View>
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
  multiDropDownButtonContainer: {
    flexDirection: "row",
    flexWrap: 'wrap',
  },
  multiDropDownButton: {
    flexDirection: "row",
    margin: 5,
    marginRight: 5,
    padding: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  multiDropDownText: {
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 5,
  },
  error: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
  detailsPlaceholder: {
    fontSize: 16,
    color: "gray",
    paddingVertical: 8,
    width: Dimensions.get("window").width,
  },
  detailsAnswer: {
    fontSize: 17,
    fontWeight: "bold",
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
