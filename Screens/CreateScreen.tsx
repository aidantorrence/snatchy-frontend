import React, { useState } from "react";
import { TouchableOpacity, Text, Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CreateScreen() {
	const [images, setImages] = useState([undefined] as string[] | undefined[]);

	const pickImage = async (index: number) => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 4],
			quality: 1,
		});

		if (!result.cancelled) {
			images[index] = result.uri;
			setImages([...images] as any);
		}
	};

	const Box = ({ index }: { index: number }) => {
		return (
			<TouchableOpacity onPress={() => pickImage(index)}>
				{images[index] ? (
					<Image source={{ uri: images[index] }} style={{ width: 200, height: 200 }} />
				) : (
					<Image source={require("../assets/Add_Photos.png")} resizeMode="contain" style={{ height: 80 }} />
				)}
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			{images.map((_, index) => (
				<Box index={index} />
			))}
			{/* <TouchableOpacity onPress={pickImage}>
				{image ? (
					<Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
				) : (
					<View style={styles.button}>
						<Text style={styles.buttonText}>Add Photo</Text>
					</View>
				)}
			</TouchableOpacity> */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	},
	button: {},
	buttonText: {},
});
