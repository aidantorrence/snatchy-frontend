import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const fieldTitles = {
  kibbeTypes: {
    text: "Choose Modus Type(s) for this outfit",
    level: 'optional',
  },
  description: {
    text: "Name your outfit",
    level: 'required',
  },
  content: {
    text: "Ask for feedback, describe your outfit, etc",
    level: 'required',
    multiline: true,
  },
  occasions: {
    text: "Occasion(s)",
    level: 'optional',
  },
  aesthetic: {
    text: "Aesthetic",
    level: 'optional',
  },
  seasonalColors: {
    text: "Choose Seasonal Color(s) for this outfit",
    level: 'optional',
  },
  purchaseLink: {
    text: "Add a purchase link",
    level: 'optional',
  },
  postReason: {
    text: 'Are you posting for feedback or inspiration?',
    level: 'required',
  },
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
  const level = fieldTitles[field]?.level === 'required' ? styles.requiredText : styles.optionalText
  return (
    <View style={styles.detailsContainer}>
        <Text style={[styles.levelText, level]}>{fieldTitles[field].level}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={formData[field]}
          onChangeText={handleChange}
          style={[styles.detailsPlaceholder, fieldTitles[field]?.multiline && styles.multiline]}
          placeholder={fieldTitles[field].text}
          placeholderTextColor="gray"
          autoCorrect={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          multiline={fieldTitles[field].multiline}
        />
      </View>
        {error[field] ? <Text style={styles.error}>{error[field]}</Text> : null}
    </View>
  );
}

export function DropDownForm({ formData, error, setError, field, openOptionsModal }: any) {
  const handlePress = () => {
    setError({ ...error, [field]: "" });
    openOptionsModal(field);
  };
  const level = fieldTitles[field]?.level === 'required' ? styles.requiredText : styles.optionalText
  return (
    <TouchableOpacity style={styles.detailsContainer} onPress={handlePress}>
        <Text style={[styles.levelText, level]}>{fieldTitles[field].level}</Text>
      <View style={styles.dropDownContainer}>
        { formData[field] ? '' : <Text style={styles.detailsPlaceholder}>{fieldTitles[field].text}</Text>}
        {formData[field] ? <Text style={styles.detailsAnswer}>{formData[field]}</Text> : null}
      <Image source={require("../assets/dropDownCaret.png")} style={styles.dropDownCaret} />
      </View>
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

  const level = fieldTitles[field]?.level === 'required' ? styles.requiredText : styles.optionalText

  return (
    <TouchableOpacity style={styles.detailsContainer} onPress={handlePress}>
        <Text style={[styles.levelText, level]}>{fieldTitles[field].level}</Text>
      <View style={styles.dropDownContainer}>
        { formData[field].length ? '' : <Text style={styles.detailsPlaceholder}>{fieldTitles[field].text}</Text>}
        <View style={styles.multiDropDownButtonContainer}>
          {formData[field].map((item: any, index: number) => {
            return (
              <TouchableOpacity key={index} style={styles.multiDropDownButton} onPress={() => handleDeleteMultiOption(index)}>
                <Text style={styles.multiDropDownText}>{item}</Text>
                <Image source={require("../assets/X_Logo.png")} style={styles.xLogo} />
              </TouchableOpacity>
            );
          })}
        </View>
      <Image source={require("../assets/Caret_Logo.png")} style={styles.dropDownCaret} />
      </View>
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
        <Text style={styles.detailsTitle}>{fieldTitles[field].text}</Text>
        {editMode[field] ? (
          <TextInput
            value={formData[field]}
            onChangeText={handleChange}
            style={formData[field] ? styles.detailsAnswer : styles.detailsPlaceholder}
            placeholder={editMode[field] ? "" : fieldTitles[field].text}
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
        <Text style={styles.detailsTitle}>{fieldTitles[field].text}</Text>
        <Text style={styles.detailsAnswer}>{parseData()}</Text>
      </View>
      <Button title="Edit" onPress={handlePress} />
      {error[field] ? <Text style={styles.error}>{error[field]}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  multiline: {
    height: 150,
  },
  levelText: {
    fontSize: 10,
    textTransform: 'capitalize',
  },
  requiredText: {
    color: "#AD0053",
  },
  optionalText: {
    color: '#797979',
  },
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
    alignItems: 'center',
  },
  multiDropDownText: {
    fontSize: 11,
    fontWeight: "bold",
    marginRight: 5,
  },
  error: {
    color: "red",
    fontSize: 10,
    fontWeight: "bold",
  },
  detailsPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: "gray",
    paddingVertical: 8,
    paddingHorizontal: 10,
    // width: Dimensions.get("window").width,
  },
  detailsAnswer: {
    fontSize: 13,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    // width: Dimensions.get("window").width,
  },
  detailsTitle: {
    fontSize: 14,
    color: "gray",
    paddingVertical: 3,
  },
  detailsContainer: {
    marginHorizontal: 20,
    marginVertical: 4,
  },
  inputContainer: {
    marginTop: 2,
    borderColor: "#aaa",
    backgroundColor: '#f2f2f2',
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropDownContainer: {
    marginTop: 2,
    borderColor: 'gray',
    borderWidth: .25,
    backgroundColor: '#f2f2f2',
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 7,
  },
  flexContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropDownCaret: {
    width: 10,
    height: 10,
    resizeMode: "contain",
    marginRight: 10,
    opacity: .5,
  },
  xLogo: {
    width: 15,
    height: 15,
    resizeMode: "contain",
  },
});
