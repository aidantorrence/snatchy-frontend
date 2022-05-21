import { Image, View, Text, SafeAreaView, FlatList, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { icons } from "./utils/icons";
import ProfileScreen from "./Screens/ProfileScreen";
import CreateScreen from "./Screens/CreateScreen";

const DATA = [
	{
		id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
		name: "ADIDAS YEEZY BOOST 360 V2 “ZEBRA”",
		img: "https://picsum.photos/200/300",
		size: 11,
		price: 379,
		condition: "Brand New",
		canTrade: true,
		username: "genevieve",
		userImage: "https://picsum.photos/200/300",
	},
	{
		id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
		name: "ADIDAS YEEZY BOOST 360 V2 “ZEBRA”",
		img: "https://picsum.photos/200/300",
		size: 11,
		price: 379,
		condition: "Brand New",
		canTrade: true,
		username: "genevieve",
		userImage: "https://picsum.photos/200/300",
	},
	{
		id: "58694a0f-3da1-471f-bd96-145571e29d72",
		name: "ADIDAS YEEZY BOOST 360 V2 “ZEBRA”",
		img: "https://picsum.photos/200/300",
		size: 11,
		price: 379,
		condition: "Brand New",
		canTrade: true,
		username: "genevieve",
		userImage: "https://picsum.photos/200/300",
	},
	{
		id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28baasdfafda",
		name: "ADIDAS YEEZY BOOST 360 V2 “ZEBRA”",
		img: "https://picsum.photos/200/300",
		size: 11,
		price: 379,
		condition: "Brand New",
		canTrade: true,
		username: "genevieve",
		userImage: "https://picsum.photos/200/300",
	},
	{
		id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63asdfasdas",
		name: "ADIDAS YEEZY BOOST 360 V2 “ZEBRA”",
		img: "https://picsum.photos/200/300",
		size: 11,
		price: 379,
		condition: "Brand New",
		canTrade: true,
		username: "genevieve",
		userImage: "https://picsum.photos/200/300",
	},
	{
		id: "58694a0f-3da1-471f-bd96-145571e29d72asfasfdadfd",
		name: "ADIDAS YEEZY BOOST 360 V2 “ZEBRA”",
		img: "https://picsum.photos/200/300",
		size: 11,
		price: 379,
		condition: "Brand New",
		canTrade: true,
		username: "genevieve",
		userImage: "https://picsum.photos/200/300",
	},
];

const renderItem = ({ item }: any) => (
	<View style={styles.item}>
		<View style={styles.userInfo}>
			<Image source={{ uri: item.userImage }} style={styles.userImage} />
			<Text style={styles.username}>{item.username}</Text>
		</View>
		<Image source={{ uri: item.img }} style={styles.image} />
		<View style={styles.detailsContainer}>
			<View style={styles.nameConditionSizeContainer}>
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.conditionAndSize}>
					{item.condition} Size {item.size}
				</Text>
			</View>
			<View style={styles.priceCanTradeContainer}>
				<Text style={styles.price}>{item.price}</Text>
				{item.canTrade ? <Image style={styles.canTrade} source={require("./Trade.png")} /> : null}
			</View>
		</View>
	</View>
);

function ListHeader() {
	return (
		<View style={styles.title}>
			<Text style={styles.titleText}>INSTAHEAT</Text>
		</View>
	);
}
function HomeScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<FlatList data={DATA} renderItem={renderItem} keyExtractor={(item) => item.id} ListHeaderComponent={ListHeader} />
		</SafeAreaView>
	);
}

function Icon({ imgSrc }: any) {
	return (
		<View style={{ paddingTop: 15 }}>
			<Image source={imgSrc} resizeMode="contain" style={{ width: 33 }} />
		</View>
	);
}

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Tab.Navigator
				screenOptions={{
					headerShown: false,
					tabBarShowLabel: false,
					tabBarStyle: {},
				}}
			>
				<Tab.Screen
					name="Home"
					component={HomeScreen}
					options={{
						tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.homeFocused : icons.home} />,
					}}
				/>
				<Tab.Screen
					name="Post"
					component={CreateScreen}
					options={{
						tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.createFocused : icons.create} />,
					}}
				/>
				<Tab.Screen
					name="Settings"
					component={ProfileScreen}
					options={{
						tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.profileFocused : icons.profile} />,
					}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	item: {
		alignItems: "center",
		paddingBottom: 20,
		paddingLeft: 20,
		paddingRight: 20,
	},
	name: {
		fontSize: 24,
		fontWeight: "bold",
		paddingBottom: 10,
	},
	conditionAndSize: {
		fontSize: 16,
		color: "gray",
	},
	nameConditionSizeContainer: {
		width: "75%",
	},
	priceCanTradeContainer: {
		width: "25%",
		alignItems: "center",
	},
	price: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	detailsContainer: {
		flexDirection: "row",
		paddingTop: 10,
		paddingBottom: 10,
	},
	title: {
		alignItems: "center",
		paddingBottom: 20,
	},
	titleText: {
		fontSize: 32,
		fontWeight: "bold",
	},
	image: {
		width: "100%",
		height: 300,
	},
	userImage: {
		borderRadius: 50,
		width: 25,
		height: 25,
		marginRight: 10,
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		width: "100%",
		paddingBottom: 10,
	},
	username: {
		fontSize: 20,
		fontWeight: "bold",
	},
	canTrade: {
		width: 25,
		height: 25,
		resizeMode: "contain",
	},
});
