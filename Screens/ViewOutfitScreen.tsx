import { useLayoutEffect, useState } from "react";
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
import { deleteOutfit, fetchOutfit, fetchUser, postComment, postFlagContent, postVote, updateOutfit } from "../data/api";
import useAuthentication, { useStore } from "../utils/firebase/useAuthentication";
import { modusTypes } from "./QuizSuccessScreen";
import * as WebBrowser from "expo-web-browser";
import { modusTypesReverse } from "./ModusDescriptionScreen";
import analytics from "@react-native-firebase/analytics";
import FastImage from "react-native-fast-image";
import { mixpanel } from "../utils/mixpanel";

const defaultProfile = "https://yt3.ggpht.com/-2lcjvQfkrNY/AAAAAAAAAAI/AAAAAAAAAAA/ouxs6ZByypg/s900-c-k-no/photo.jpg";

// const voteMapping = {
//   '0': 'unvoted',
//   '1': 'upvoted',
//   '-1': 'downvoted',
// } as any;

export default function ViewOutfitScreen({ navigation, route }: any) {
  const user = useStore((state) => state.user);
  const [inputModalIsVisible, setInputModalIsVisible] = useState(false);
  const [modalValue, setModalValue] = useState("");
  const { id } = route.params;
  const { data: outfit, isLoading } = useQuery(`listing-${id}`, () => fetchOutfit(id, user?.uid));
  const [comment, setComment] = useState("");

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

  const postVoteMutation: any = useMutation((data) => postVote(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("outfits");
      queryClient.invalidateQueries({ queryKey: [`listing-${id}`] });
    },
  });
  const updatePostMutation: any = useMutation((data) => updateOutfit(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("outfits");
      queryClient.invalidateQueries({ queryKey: [`listing-${id}`] });
    },
  });

  // useLayoutEffect (() => {
  //   console.log('outfit?.postVote', outfit?.postVote.vote);
  //   setCurrentVote(voteMapping[outfit?.postVote?.vote?.toString()])
  // }, [outfit]);

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
          return <FastImage key={index} source={{ uri: image }} style={styles.image} />;
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
          onPress: handleAddPurchaseLink,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    }
    analytics().logEvent("shopping_bag_click", {
      item_id: id,
      item_name: outfit?.description,
      purchase_link: outfit?.purchaseLink,
    });
    mixpanel.track("shopping_bag_click", {
      item_id: id,
      item_name: outfit?.description,
      purchase_link: outfit?.purchaseLink,
      });
  };

  const handleVote = (vote: number) => {
    if (outfit?.postVote[0]?.vote === 0) {
      postVoteMutation.mutate({ outfitId: id, uid: user?.uid, vote: vote });
      // setCurrentVote(vote);
    } else if (outfit?.postVote[0]?.vote === vote) {
      postVoteMutation.mutate({ outfitId: id, uid: user?.uid, vote: 0 });
      // setCurrentVote('unvoted');
    } else {
      postVoteMutation.mutate({ outfitId: id, uid: user?.uid, vote: vote });
      // setCurrentVote(vote);
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
                  <FastImage source={{ uri: outfit.owner.userImage }} style={styles.userImage} />
                ) : (
                  <FastImage source={require("../assets/Monkey_Profile_Logo.png")} style={styles.userImage} />
                )}
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.sellerName}>{outfit.owner.firstName + " " + outfit.owner.lastName}</Text>
                    {outfit.owner.userType === "EXPERT" ? (
                      <FastImage source={require("../assets/Verified_Logo_2.png")} style={styles.verifiedImage} />
                    ) : null}
                  </View>
                  <Text style={styles.modusType}>{modusTypes[outfit.owner.modusType]}</Text>
                </View>
              </View>
              {isCurrentUserPost ? (
                <TouchableOpacity style={{ padding: 5 }} onPress={handleAlert}>
                  <FastImage style={{ width: 15, height: 15 }} source={require("../assets/Settings.png")} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{ padding: 5 }} onPress={handleActions}>
                  <FastImage style={{ width: 15, height: 15 }} source={require("../assets/Ellipsis_Logo.png")} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            <FastImage source={{ uri: outfit.imagesOptimized[0] || outfit.images[0] }} style={styles.image} />
            <View style={styles.titleContainer}>
              <Text style={styles.description}>{outfit.description}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <View>
                <View style={styles.votesContainer}>
                  <TouchableOpacity onPress={() => handleVote(1)}>
                    {outfit?.postVote[0]?.vote !== 1 ? (
                      <FastImage style={styles.votesIcon} source={require("../assets/Upvote.png")} />
                    ) : (
                      <FastImage style={styles.votesIcon} source={require("../assets/Upvote_Focused_Compressed.jpg")} />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.votes}>{outfit.votes}</Text>
                  <TouchableOpacity onPress={() => handleVote(-1)}>
                    {outfit?.postVote[0]?.vote !== -1 ? (
                      <FastImage style={styles.votesIcon} source={require("../assets/Downvote.png")} />
                    ) : (
                      <FastImage style={styles.votesIcon} source={require("../assets/Downvote_Focused_Compressed.jpg")} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.tagsContainer}>
                {outfit.kibbeTypes.length
                  ? outfit.kibbeTypes.map((item: any, index: number) => {
                      return (
                        <TouchableOpacity
                          onPress={() => navigation.navigate("ModusDescription", { modusType: modusTypesReverse[item] })}
                          key={index}
                          style={[styles.tags, styles.kibbeTypes]}
                        >
                          <Text style={styles.tagsText}>{item}</Text>
                        </TouchableOpacity>
                      );
                    })
                  : null}
                {outfit.seasonalColors.length
                  ? outfit.seasonalColors.map((item: any, index: number) => {
                      return (
                        <View key={index} style={[styles.tags, styles.seasonalColors]}>
                          <Text style={styles.tagsText}>{item}</Text>
                        </View>
                      );
                    })
                  : null}
              </View>
              <TouchableOpacity onPress={handleShoppingBagClick} style={{ alignItems: "center", marginLeft: 5, marginRight: 10 }}>
                <FastImage source={require("../assets/Shopping_Bag_Logo.png")} style={styles.shoppingBagImage} />
              </TouchableOpacity>
            </View>
            {outfit?.content ? (
              <View style={styles.postContainer}>
                <View style={styles.postHeader}>
                  <Text style={styles.postHeaderText}>
                    {outfit?.owner?.firstName + " " + outfit?.owner?.lastName + " "}
                    <Text style={styles.postText}>{outfit?.content}</Text>
                  </Text>
                </View>
              </View>
            ) : null}
            <View style={styles.commentsContainer}>
              {outfit?.Comment?.map((comment: any, index: number) => {
                return (
                  <View key={index} style={styles.commentContainer}>
                    <View style={styles.commentHeader}>
                      {comment?.owner?.userImage ? (
                        <FastImage source={{ uri: comment?.owner?.userImage }} style={styles.commentUserImage} />
                      ) : (
                        <FastImage source={require("../assets/Monkey_Profile_Logo.png")} style={styles.commentUserImage} />
                      )}
                      <View>
                        <Text style={styles.commentUserTitle}>{comment?.owner?.firstName + " " + comment?.owner?.lastName}</Text>
                        <Text style={styles.commentModusType}>{modusTypes[comment?.owner?.modusType]}</Text>
                      </View>
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
    width: 25,
    height: 25,
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
  postContainer: {
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  commentBox: {
    marginHorizontal: 10,
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
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
  },
  commentUserTitle: {
    marginRight: 5,
    fontWeight: "bold",
    fontSize: 11,
  },
  commentModusType: {
    marginRight: 5,
    fontSize: 8,
  },
  commentText: {
    marginRight: 5,
    fontSize: 12,
  },
  commentHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5,
  },
  postHeader: {
    flexDirection: "row",
    marginBottom: 5,
  },
  postHeaderText: {
    fontWeight: "bold",
    fontSize: 11,
  },
  postText: {
    fontWeight: "normal",
    fontSize: 12,
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
    fontSize: 17,
    marginHorizontal: 5,
  },
  votesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  votesIcon: {
    width: 22,
    height: 22,
  },
  tagsContainer: {
    marginLeft: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  tags: {
    flexDirection: "row",
    margin: 3,
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
    height: Dimensions.get("window").height * 0.5,
    resizeMode: "cover",
  },
  userImage: {
    borderRadius: 50,
    width: 40,
    height: 40,
    marginRight: 5,
  },
  verifiedImage: {
    borderRadius: 50,
    width: 14,
    height: 14,
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
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 5,
  },
  modusType: {
    fontSize: 11,
    marginRight: 5,
  },
  canTrade: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  detailsContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: 'center'
  },
  description: {
    fontSize: 14,
    paddingBottom: 7,
    textAlign: "center",
  },
  titleContainer: {
    paddingTop: 5,
    paddingHorizontal: 10,
    alignItems: "center",
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
