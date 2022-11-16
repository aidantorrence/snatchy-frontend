import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
  Modal,
  Pressable,
  Button,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Swiper from "react-native-swiper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteOutfit, fetchOutfit, fetchUser, postComment, postFlagContent, updateOutfit } from "../data/api";
import useAuthentication, { useStore } from "../utils/firebase/useAuthentication";
import { modusTypes } from "./QuizSuccessScreen";
import * as WebBrowser from "expo-web-browser";

const defaultProfile = "https://yt3.ggpht.com/-2lcjvQfkrNY/AAAAAAAAAAI/AAAAAAAAAAA/ouxs6ZByypg/s900-c-k-no/photo.jpg";

export default function ViewOutfitScreen({ navigation, route }: any) {
  const [inputModalIsVisible, setInputModalIsVisible] = useState(false);
  const [modalValue, setModalValue] = useState("");
  const { id } = route.params;
  const { data: outfit, isLoading } = useQuery(`listing-${id}`, () => fetchOutfit(id));
  const [comment, setComment] = useState("");

  const user = useStore((state) => state.user);
  const isCurrentUserPost = user?.uid === outfit?.ownerId;
  const queryClient = useQueryClient();
  const { mutate, isMutationLoading }: any = useMutation(() => deleteOutfit({ id }), {
    onSuccess: () => {
      queryClient.invalidateQueries("outfits");
    },
  });

  const { mutate: mutatePurchaseLink }: any = useMutation((data) => updateOutfit(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("outfits");
    },
  });

  const postCommentMutation: any = useMutation((data) => postComment(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("outfits");
    },
  });

  const handleProfilePress = (uid: any) => {
    navigation.navigate("ViewProfile", {
      ownerId: uid,
    });
  };

  const handleSubmitFlaggedContent = (details: string | undefined, reason: string) => {
    postFlagContent({ reason: `${reason}: ${details}`, listingId: id, uid: user?.uid });
    Alert.alert("This listing has been flagged for review");
    navigation.navigate("HomeTabs");
  };

  const handleFlagContentConfirm = (reason: string) => {
    Alert.prompt("Please provide details", "", [
      {
        text: "OK",
        onPress: (details) => handleSubmitFlaggedContent(details, reason),
      },
    ]);
    //
  };

  const handleFlagContent = () => {
    Alert.alert("Reasons for flagging content", "Please let us know why you think this content violates our policies", [
      {
        text: "Sexual Content",
        onPress: () => handleFlagContentConfirm("Sexual Content"),
      },
      {
        text: "Violence",
        onPress: () => handleFlagContentConfirm("Violence"),
      },
      {
        text: "Hate Speech",
        onPress: () => handleFlagContentConfirm("Hate Speech"),
      },
      {
        text: "Spam",
        onPress: () => handleFlagContentConfirm("Spam"),
      },
      {
        text: "Other",
        onPress: () => handleFlagContentConfirm("Other"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  const handleActions = () => {
    Alert.alert("Actions", "What would you like to do?", [
      {
        text: "Flag",
        onPress: handleFlagContent,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  const handlePress = (val: string) => {
    if (val === "Edit") {
      navigation.navigate("EditListing", {
        id,
      });
    } else {
      Alert.alert("Are you sure you want to delete this post?", "", [
        {
          text: "Cancel",
        },
        { text: "OK", onPress: () => handleDelete() },
      ]);
    }
  };

  const handleDelete = () => {
    mutate();
    navigation.goBack();
  };

  const handleAlert = () => {
    Alert.alert("Select action", "", [
      // {
      //   text: "Edit Post",
      //   onPress: () => handlePress("Edit"),
      // },
      {
        text: "Delete Post",
        onPress: () => handlePress("Delete"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  function Item({ item }: any) {
    return (
      <Swiper style={{ height: 300 }}>
        {item.images.map((image: any, index: any) => {
          return <Image key={index} source={{ uri: image }} style={styles.image} />;
        })}
      </Swiper>
    );
  }

  const handleAddComment = () => {
    postCommentMutation.mutate({ content: modalValue, outfitId: id, ownerId: user?.uid });
    setModalValue("");
    setInputModalIsVisible(false);
  };

  const handleReply = () => {
    postCommentMutation.mutate({ content: comment, ownerId: user?.uid, outfitId: id });
    setComment("");
  };

  const handleAddPurchaseLink = () => {
    Alert.prompt("Add purchase link", "", [
      {
        text: "OK",
        onPress: (val) => mutatePurchaseLink({ id, purchaseLink: val }),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
    //
  };
  const handleShoppingBagClick = () => {
    if (outfit?.purchaseLink) {
      WebBrowser.openBrowserAsync(outfit?.purchaseLink);
    } else {
    Alert.alert("Select action", "", [
      {
        text: "Add Purchase Link",
        onPress: handleAddPurchaseLink
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
    }
  };

  return (
    !isLoading && (
      <>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <TouchableOpacity onPress={() => handleProfilePress(outfit.ownerId)} style={styles.userContainer}>
              <View style={styles.userInfo}>
                {outfit.owner.userImage ? (
                  <Image source={{ uri: outfit.owner.userImage || defaultProfile }} style={styles.userImage} />
                ) : (
                  <Image source={require("../assets/Monkey_Profile_Logo.png")} style={styles.userImage} />
                )}
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.sellerName}>{outfit.owner.firstName + " " + outfit.owner.lastName}</Text>
                    {outfit.owner.userType === "EXPERT" ? (
                      <Image source={require("../assets/Verified_Logo_2.png")} style={styles.userImage} />
                    ) : null}
                  </View>
                  <Text style={styles.modusType}>{modusTypes[outfit.owner.modusType]}</Text>
                </View>
              </View>
              {isCurrentUserPost ? (
                <TouchableOpacity style={{ padding: 5 }} onPress={handleAlert}>
                  <Image style={{ width: 15, height: 15 }} source={require("../assets/Settings.png")} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{ padding: 5 }} onPress={handleActions}>
                  <Image style={{ width: 15, height: 15 }} source={require("../assets/Ellipsis_Logo.png")} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            <Image source={{ uri: outfit.images[0] }} style={styles.image} />
            <View style={styles.detailsContainer}>
              {/* <View style={styles.titleContainer}> */}
              {/* <Text style={styles.description}>{outfit.description}</Text> */}
              {/* </View> */}
              <View>
              <View style={styles.votesContainer}>
                <TouchableOpacity>
                  <Image style={styles.votesIcon} source={require("../assets/Upvote_Logo.png")} />
                </TouchableOpacity>
                <Text style={styles.votes}>{outfit.upvotes - outfit.downvotes}</Text>
                <TouchableOpacity>
                  <Image style={styles.votesIcon} source={require("../assets/Downvote_Logo.png")} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleShoppingBagClick} style={{alignItems: 'center', marginTop: 5}}>
                  <Image source={require("../assets/Shopping_Bag_Logo.png")} style={styles.shoppingBagImage} />
              </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                {outfit.kibbeTypes.map((item: any, index: number) => {
                  return (
                    <View key={index} style={[styles.tags, styles.kibbeTypes]}>
                      <Text style={styles.tagsText}>{item}</Text>
                    </View>
                  );
                })}
                {outfit.occasions.map((item: any, index: number) => {
                  return (
                    <View key={index} style={[styles.tags, styles.occasions]}>
                      <Text style={styles.tagsText}>{item}</Text>
                    </View>
                  );
                })}
                <View style={[styles.tags, styles.aesthetic]}>
                  <Text style={styles.tagsText}>{outfit.aesthetic}</Text>
                </View>
                {outfit.seasonalColors.map((item: any, index: number) => {
                  return (
                    <View key={index} style={[styles.tags, styles.seasonalColors]}>
                      <Text style={styles.tagsText}>{item}</Text>
                    </View>
                  );
                })}
              </View>
              {/* <TextInput
                  style={styles.textInput}
                  value={comment}
                  onChangeText={(text: string) => setComment(text)}
                  multiline
                  placeholder="Write feedback / suggestions / thoughts here"
                />
                <View style={styles.replyButtonContainer}>
                  <TouchableOpacity style={styles.replyButton} onPress={handleReply}>
                    <Text style={styles.replyButtonText}>Reply</Text>
                  </TouchableOpacity>
                </View> */}
            </View>
            <View style={styles.commentsContainer}>
              {outfit?.Comment?.map((comment: any, index: number) => {
                console.log(comment);
                return (
                  <View key={index} style={styles.commentContainer}>
                    <View style={styles.commentHeader}>
                      {comment?.owner?.userImage ? (
                        <Image source={{ uri: comment?.owner?.userImage || defaultProfile }} style={styles.commentUserImage} />
                      ) : (
                        <Image source={require("../assets/Monkey_Profile_Logo.png")} style={styles.commentUserImage} />
                      )}
                      <Text style={styles.commentText}>{comment?.owner?.firstName + " " + comment?.owner?.lastName}</Text>
                      {/* <Text style={styles.commentText}>{new Date(comment.createdAt).toDateString()}</Text> */}
                    </View>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          {!inputModalIsVisible ? (
            <TouchableOpacity onPress={() => setInputModalIsVisible(true)} style={styles.commentBox}>
              <Text>Add a comment...</Text>
            </TouchableOpacity>
          ) : null}
        </SafeAreaView>
        {/* <Modal
        visible={inputModalIsVisible}
        onRequestClose={() => setInputModalIsVisible(false)}>
          <SafeAreaView style={styles.modalContainer}>
            <TextInput />
          </SafeAreaView>
        </Modal> */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={inputModalIsVisible}
          onRequestClose={() => {
            setInputModalIsVisible(false);
          }}
        >
          <KeyboardAwareScrollView contentContainerStyle={styles.optionsModalContainer}>
            <View style={styles.optionsModal}>
              <View style={styles.inputToolbar}>
                <TouchableOpacity onPress={() => setInputModalIsVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddComment}>
                  <Text style={styles.inputToolbarText}>Add comment</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 70, backgroundColor: "white" }}>
                <TextInput
                  value={modalValue}
                  onChangeText={(val) => setModalValue(val)}
                  autoCorrect={false}
                  style={{ width: Dimensions.get("window").width, padding: 10, backgroundColor: "white", fontSize: 16 }}
                  autoFocus={true}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={optionsModalIsVisible}
          onRequestClose={() => {
            setOptionsModalIsVisible(!optionsModalIsVisible);
          }}
        >
          <SafeAreaView style={styles.optionsModalContainer}>
            <View style={styles.optionsModal}>
              <View style={styles.toolbar}>
                <View style={styles.toolbarRight}>
                  <Button title="Done" onPress={handleOptionsModalClose} />
                </View>
              </View>
              <Picker
                style={{ width: Dimensions.get("window").width, backgroundColor: "#e1e1e1" }}
                selectedValue={modalValue || listingsData[currentModal]}
                onValueChange={(val) => setModalValue(val)}
              >
                {(modalOptions[currentModal] || []).map((val: string) => (
                  <Picker.Item key={val} label={val} value={val} />
                ))}
              </Picker>
            </View>
          </SafeAreaView>
        </Modal> */}
      </>
    )
  );
}

const styles = StyleSheet.create({
  shoppingBagImage: {
    width: 30,
    height: 30,
  },
  optionsModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0, .8)",
  },
  optionsModal: {
    position: "absolute",
    bottom: 0,
  },
  inputToolbar: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputToolbarText: {
    fontSize: 14,
    textTransform: "capitalize",
    color: "black",
  },
  cancelText: {
    fontSize: 14,
    textTransform: "capitalize",
    color: "red",
  },
  toolbar: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  toolbarRight: {
    alignSelf: "flex-end",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  commentsContainer: {
    paddingHorizontal: 10,
  },
  commentBox: {
    marginHorizontal: 20,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#888888",
  },
  commentUserImage: {
    borderRadius: 50,
    width: 20,
    height: 20,
    marginRight: 5,
  },
  seasonalColors: {
    backgroundColor: "#1DA1F2",
  },
  kibbeTypes: {
    backgroundColor: "#F487D2",
  },
  aesthetic: {
    backgroundColor: "#555555",
  },
  occasions: {
    backgroundColor: "lightgray",
  },
  commentContainer: {
    marginTop: 10,
    marginLeft: 5,
  },
  commentText: {
    marginRight: 5,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
  },
  replyButtonContainer: {
    alignItems: "flex-end",
    marginTop: 7,
  },
  replyButton: {
    backgroundColor: "blue",
    borderRadius: 10,
  },
  replyButtonText: {
    fontSize: 15,
    color: "white",
    padding: 5,
  },
  textInput: {
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
  },
  votes: {
    fontSize: 24,
  },
  votesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  votesIcon: {
    opacity: 0.5,
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  tagsContainer: {
    width: "75%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tags: {
    flexDirection: "row",
    margin: 5,
    padding: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  expertTag: {
    flexDirection: "row",
    margin: 5,
    marginRight: 5,
    padding: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "blue",
  },
  tagsText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  expertTagText: {
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 5,
    color: "white",
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  subHeader: {
    flexDirection: "row",
  },
  subHeaderText: {
    marginRight: 20,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  buttonText: {
    fontSize: 20,
  },
  button: {
    backgroundColor: "red",
    borderWidth: 0.5,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  userImagesContainer: {
    flexDirection: "row",
  },
  userImages: {
    width: 80,
    height: 80,
    margin: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  // description: {
  //   fontWeight: "bold",
  //   fontSize: 20,
  // },
  body: {
    fontSize: 22,
  },
  bio: {
    fontSize: 17,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width,
    height: 533,
    resizeMode: "cover",
  },
  userImage: {
    borderRadius: 50,
    width: 20,
    height: 20,
    marginRight: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 5,
    paddingLeft: 10,
  },
  sellerName: {
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 5,
  },
  modusType: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 5,
  },
  canTrade: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  detailsContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: 'center'
  },
  description: {
    width: "80%",
    fontSize: 20,
    paddingBottom: 7,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
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
  item: {
    // paddingBottom: 20,
    // paddingLeft: 20,
    // paddingRight: 20,
  },
});
