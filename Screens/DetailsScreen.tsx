import React, { useState, useEffect } from "react";
import {
	Switch,
	TextInput,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Modal,
	Text,
	Image,
	View,
	StyleSheet,
	SafeAreaView,
	Pressable,
	Button,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";

const modalOptions = {
	condition: ["", "Brand New", "Used - Excellent", "Used - Good", "Used - Fair"],
	gender: ["", "Mens", "Womens"],
	boxCondition: ["", "Good", "Damaged", "None"],
} as any;

export default function DetailsScreen({ navigation }: any) {
	const [images, setImages] = useState([] as string[]);
	const [name, setName] = useState("");
	const [size, setSize] = useState("");
	const [modalState, setModalState] = useState({
		condition: "",
		gender: "",
		boxCondition: "",
	}) as any;
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [currentModal, setCurrentModal] = useState("");
	const [modalValue, setModalValue] = useState("");
	const [isNameFocused, setIsNameFocused] = useState(false);
	const [isSizeFocused, setIsSizeFocused] = useState(false);

	// useEffect(() => {
	// 	pickImage();
	// }, []);

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 4],
			quality: 1,
		});

		if (!result.cancelled) {
			setImages([...images, result.uri]);
		}
	};

	const handleImageReselect = async (index: number) => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 4],
			quality: 1,
		});
		if (!result.cancelled) {
			images[index] = result.uri;
			setImages([...images]);
		}
	};

	const openModal = (val: string) => {
		setCurrentModal(val);
		setModalIsVisible(true);
	};
	const handlePickerSelect = (val: string) => {
		setModalValue(val);
	};
	const handleCompleteButtonClick = () => {
		navigation.navigate("Questions");
	};
	const handleModalClose = () => {
		modalState[currentModal] = modalValue;
		setModalState({ ...modalState });
		setModalIsVisible(false);
	};

	return (
		<>
			<SafeAreaView style={styles.container}>
				<KeyboardAwareScrollView>
					<View style={styles.detailsContainer}>
						<Text style={styles.detailsTitle}>Photos</Text>
						<ScrollView style={styles.imageContainer} horizontal={true}>
							{images.map((image, index) => (
								<TouchableOpacity key={index} onPress={() => handleImageReselect(index)}>
									<Image source={{ uri: image }} style={styles.images} />
								</TouchableOpacity>
							))}
							{[0, 1, 2, 3].map((val) => (
								<TouchableOpacity key={val} onPress={pickImage}>
									<Image source={require("../assets/Add_Photos.png")} style={styles.images} />
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
					<View style={styles.detailsContainer}>
						{!isNameFocused && name ? <Text style={styles.detailsTitle}>Name</Text> : null}
						<TextInput
							value={name}
							onChangeText={(text: string) => setName(text)}
							style={name ? styles.detailsAnswer : styles.detailsTitle}
							placeholder={isNameFocused ? "" : "Name"}
							autoCorrect={false}
							onFocus={() => setIsNameFocused(true)}
							onBlur={() => setIsNameFocused(false)}
						/>
					</View>
					<TouchableOpacity style={styles.detailsContainer} onPress={() => openModal("condition")}>
						<View style={styles.dropDownContainer}>
							<Text style={styles.detailsTitle}>Condition</Text>
							<Image source={require("../assets/dropDownCaret.png")} style={styles.dropDownCaret} />
						</View>
						{modalState.condition ? <Text style={styles.detailsAnswer}>{modalState.condition}</Text> : null}
					</TouchableOpacity>
					{modalState.condition && modalState.condition !== "Brand New" ? (
						<>
							<View style={styles.detailsContainer}>
								<Text style={styles.detailsTitle}>How many times worn?</Text>
								<TextInput
									value={name}
									onChangeText={(text: string) => setName(text)}
									style={styles.detailsAnswer}
									placeholder="Add details here"
									autoCorrect={false}
								/>
							</View>
							<View style={styles.detailsContainer}>
								<Text style={styles.detailsTitle}>Are there scuff marks?</Text>
								<TextInput
									value={name}
									onChangeText={(text: string) => setName(text)}
									style={styles.detailsAnswer}
									placeholder="Add details here (leave blank if none)"
									autoCorrect={false}
								/>
							</View>
							<View style={styles.detailsContainer}>
								<Text style={styles.detailsTitle}>Discoloration?</Text>
								<TextInput
									value={name}
									onChangeText={(text: string) => setName(text)}
									style={styles.detailsAnswer}
									placeholder="Add details here (leave blank if none)"
									autoCorrect={false}
								/>
							</View>
							<View style={styles.detailsContainer}>
								<Text style={styles.detailsTitle}>Loose threads?</Text>
								<TextInput
									value={name}
									onChangeText={(text: string) => setName(text)}
									style={styles.detailsAnswer}
									placeholder="Add details here (leave blank if none)"
									autoCorrect={false}
								/>
							</View>
							<View style={styles.detailsContainer}>
								<Text style={styles.detailsTitle}>Heel drag?</Text>
								<TextInput
									value={name}
									onChangeText={(text: string) => setName(text)}
									style={styles.detailsAnswer}
									placeholder="Add details here (leave blank if none)"
									autoCorrect={false}
								/>
							</View>
							<View style={styles.detailsContainer}>
								<Text style={styles.detailsTitle}>Tough stains?</Text>
								<TextInput
									value={name}
									onChangeText={(text: string) => setName(text)}
									style={styles.detailsAnswer}
									placeholder="Add details here (leave blank if none)"
									autoCorrect={false}
								/>
							</View>
						</>
					) : null}
					<TouchableOpacity style={styles.detailsContainer} onPress={() => openModal("gender")}>
						<View style={styles.dropDownContainer}>
							<Text style={styles.detailsTitle}>Mens/Womens</Text>
							<Image source={require("../assets/dropDownCaret.png")} style={styles.dropDownCaret} />
						</View>
						{modalState.gender ? <Text style={styles.detailsAnswer}>{modalState.gender}</Text> : null}
					</TouchableOpacity>
					<View style={styles.detailsContainer}>
						{!isSizeFocused && size ? <Text style={styles.detailsTitle}>Size</Text> : null}
						<TextInput
							value={size}
							onChangeText={(text: string) => setSize(text)}
							style={size ? styles.detailsAnswer : styles.detailsTitle}
							autoCorrect={false}
							keyboardType="numeric"
							placeholder={isSizeFocused ? "" : "Size"}
							onFocus={() => setIsSizeFocused(true)}
							onBlur={() => setIsSizeFocused(false)}							
						/>
					</View>
					<TouchableOpacity style={styles.detailsContainer} onPress={() => openModal("boxCondition")}>
						<View style={styles.dropDownContainer}>
							<Text style={styles.detailsTitle}>Box Condition</Text>
							<Image source={require("../assets/dropDownCaret.png")} style={styles.dropDownCaret} />
						</View>
						{modalState.boxCondition ? <Text style={styles.detailsAnswer}>{modalState.boxCondition}</Text> : null}
					</TouchableOpacity>
					<TouchableOpacity onPress={handleCompleteButtonClick} style={styles.buttonContainer}>
						<LinearGradient
							// Background Linear Gradient
							colors={["#aaa", "#aaa", "#333"]}
							locations={[0, 0.3, 1]}
							style={styles.completeButton}
							start={{ x: 0, y: 1 }}
							end={{ x: 1, y: 1 }}
						>
							<Text style={styles.completeButtonText}>Complete</Text>
						</LinearGradient>
					</TouchableOpacity>
				</KeyboardAwareScrollView>
			</SafeAreaView>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalIsVisible}
				onRequestClose={() => {
					setModalIsVisible(!modalIsVisible);
				}}
			>
				<SafeAreaView style={styles.centeredView}>
					<View style={styles.modalView}>
						<View style={styles.toolbar}>
							<View style={styles.toolbarRight}>
								<Button title="Done" onPress={handleModalClose} />
							</View>
						</View>
						<Picker
							style={{ width: Dimensions.get("window").width, backgroundColor: "#e1e1e1" }}
							selectedValue={modalValue}
							onValueChange={handlePickerSelect}
						>
							{(modalOptions[currentModal] || []).map((val: string) => (
								<Picker.Item key={val} label={val} value={val} />
							))}
						</Picker>
					</View>
				</SafeAreaView>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	imageContainer: {
		marginTop: 20,
	},
	images: {
		width: 80,
		height: 80,
		marginRight: 30,
	},
	dropDownCaret: {
		width: 20,
		height: 20,
		resizeMode: "contain",
	},
	dropDownContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	detailsTitle: {
		fontSize: 25,
		color: "gray",
		paddingVertical: 3,
	},
	detailsAnswer: {
		fontSize: 25,
		fontWeight: "bold",
		paddingVertical: 3,
	},
	detailsContainer: {
		marginHorizontal: 20,
		borderBottomWidth: 1,
		borderColor: "#aaa",
	},
	buttonText: {},
	nameContainer: {
		marginTop: 20,
		marginLeft: 20,
	},
	picker: {
		margin: 20,
	},
	conditionContainer: {
		marginTop: 20,
		marginLeft: 20,
	},
	conditionText: {
		fontSize: 20,
		fontWeight: "bold",
	},
	conditionValueText: {
		fontSize: 20,
		textTransform: "uppercase",
		fontWeight: "bold",
	},
	conditionPlaceHolderText: {
		fontSize: 20,
		color: "#bbb",
		textTransform: "uppercase",
		fontWeight: "bold",
	},
	genderContainer: {
		marginTop: 20,
		marginLeft: 20,
	},
	genderText: {
		fontSize: 20,
		fontWeight: "bold",
	},
	genderValueText: {
		fontSize: 20,
		textTransform: "uppercase",
		fontWeight: "bold",
	},
	genderPlaceHolderText: {
		fontSize: 20,
		color: "#bbb",
		textTransform: "uppercase",
		fontWeight: "bold",
	},
	sizeContainer: {
		marginTop: 20,
		marginLeft: 20,
	},
	sizeText: {
		fontSize: 20,
		fontWeight: "bold",
		// borderBottomWidth: 1,
		// borderTopWidth: 1,
	},
	centeredView: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0, .8)",
	},
	modalView: {
		position: "absolute",
		bottom: 0,
	},
	toolbar: {
		backgroundColor: "#f1f1f1",
		paddingVertical: 5,
		paddingHorizontal: 15,
	},
	toolbarRight: {
		alignSelf: "flex-end",
	},
	switchContainer: {
		marginTop: 20,
		marginLeft: 20,
	},
	switchText: {
		fontSize: 20,
		fontWeight: "bold",
	},
	completeButton: {
		padding: 15,
		alignItems: "center",
		borderRadius: 27,
		margin: 20,
		paddingLeft: 30,
		paddingRight: 30,
		width: 160,
	},
	completeButtonText: {
		fontSize: 20,
		color: "white",
		fontWeight: "bold",
	},
	buttonContainer: {
		alignItems: "center",
	},
});
