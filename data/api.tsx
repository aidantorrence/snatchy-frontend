import axios from "axios";
import Constants from "expo-constants";

export const API_URL = Constants?.expoConfig?.extra?.apiUrl;
// export const API_URL = 'https://a61b-104-139-116-146.ngrok.io'

export async function postSeasonalColorInputsk(imageUrl: string) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    const formData = new FormData();
    // formData.append('image', response.data, 'image.png');
    // console.log('image url: ', imageUrl)
    // const formData = new FormData();
    // const file = new File([imageUrl], 'image.png', { type: 'image/png' });
    // formData.append('image', file);
    const file = new File([imageUrl], 'image.png', { type: 'image/png' });
    formData.append('image', response as any);
    const headers = {
      'Content-Type': undefined as any,
    }

    const { data } = await axios.post('http://54.193.65.224/classify', formData, { headers });
    console.log(data);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/classify failed`, e?.response?.data);
  }
}

export async function postSeasonalColorInput(uid: string, imageUrl: string) {
  try {
    console.log('hello?', uid, imageUrl)
    const { data } = await axios.post(`${API_URL}/upload-image-seasonal-color-analysis`, { uid, imageUrl }); 
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/upload-image-seasonal-color-analysis failed`, e?.response?.data);
  }
}

export async function fetchOutfits(uid: string | undefined) {
  try {
    const { data } = await axios.get(`${API_URL}/outfits`, { params: { uid } });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/outfits failed`, e?.response?.data);
  }
}

export async function fetchOutfitVotes(uid: string | undefined) {
  try {
    const { data } = await axios.get(`${API_URL}/outfits-with-votes`, { params: { uid } });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/outfits failed`, e?.response?.data);
  }
}

export async function fetchOutfit(id: number, uid: string) {
  try {
    const { data } = await axios.get(`${API_URL}/outfit/${id}`, { params: { uid } });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/outfit/${id} failed`, e?.response?.data);
  }
}

export async function fetchUser(uid: string | undefined) {
  try {
    const { data } = await axios.get(`${API_URL}/user/${uid}`);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/user/${uid} failed`, e?.response?.data);
  }
}

export async function blockUser(uid: string | undefined, blockedUid: string | undefined) {
  try {
    const { data } = await axios.post(`${API_URL}/block-user`,  { uid, blockedUid });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/block-user failed`, e?.response?.data);
  }
}

export async function postOutfit(outfit: any) {
  try {
    const { data } = await axios.post(`${API_URL}/outfit`, outfit);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/outfit failed`, e?.response?.data);
  }
}

export async function postComment(comment: any) {
  console.log('comment', comment)
  try {
    const { data } = await axios.post(`${API_URL}/comment`, comment);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/comment failed`, e?.response?.data);
  }
}

export async function postOffer(data: any) {
  const { buyerId, listing, price } = data;
  try {
    const { data } = await axios.post(`${API_URL}/offer`, {
      buyerId,
      listing,
      price,
    });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/offer failed`, e?.response?.data);
  }
}
export async function postTrade(trade: any) {
  try {
    const { data } = await axios.post(`${API_URL}/trade`, trade);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/trade failed`, e?.response?.data);
  }
}
export async function fetchOffersByUser(uid: string) {
  try {
    const { data } = await axios.get(`${API_URL}/offers/${uid}`);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/offers/${uid} failed`, e?.response?.data);
  }
}
export async function fetchTradesByUser(uid: string) {
  try {
    const { data } = await axios.get(`${API_URL}/trades/${uid}`);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/trades/${uid} failed`, e?.response?.data);
  }
}
export async function updateOffer(offer: any) {
  try {
    const { data } = await axios.patch(`${API_URL}/offer`, offer);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/offer failed`, e?.response?.data);
  }
}
export async function updateTrade(trade: any) {
  try {
    const { data } = await axios.patch(`${API_URL}/trade`, trade);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/trade failed`, e?.response?.data);
  }
}

export async function updateOutfit(outfit: any) {
  try {
    const { data } = await axios.patch(`${API_URL}/outfit`, outfit);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/outfit failed`, e?.response?.data);
  }
}

export async function deleteOutfit(outfit: any) {
  try {
    const { data } = await axios.delete(`${API_URL}/outfit`, { data: outfit });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/outfit failed`, e?.response?.data);
  }
}

export async function postUser(user: any) {
  try {
    const { data } = await axios.post(`${API_URL}/user`, user);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/user failed`, e?.response?.data);
  }
}

export async function postVote(postVote: any) {
  try {
    const { data } = await axios.post(`${API_URL}/post-vote`, postVote);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/post-vote failed`, e?.response?.data);
  }
}

export async function updateUser(user: any) {
  console.log(user);
  try {
    const { data } = await axios.patch(`${API_URL}/user`, user);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/user failed`, e?.response?.data);
  }
}

export async function deleteUser(uid: any) {
  try {
    const { data } = await axios.delete(`${API_URL}/user`, { data: { uid } });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/user delete failed`, e?.response?.data);
  }
}

export async function checkStripeConnectAccountStatus(accountId: any) {
  try {
    const { data } = await axios.get(`${API_URL}/account-status/${accountId}`);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/account-status/${accountId} failed`, e?.response?.data);
  }
}

export async function createStripeConnectAccount(user: any, redirectUrl: string) {
  try {
    const { data } = await axios.post(`${API_URL}/create-account`, user, { params: { redirectUrl } });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/create-account failed`, e?.response?.data);
  }
}

export async function sendConfirmationEmail(currentUser: any, listing: any, offer: any) {
  try {
    const { data } = await axios.post(`${API_URL}/order-confirmation`, { currentUser, listing, offer });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/order-confirmation failed`, e?.response?.data);
  }
}
export async function sendTradeConfirmationEmail(trade: any) {
  try {
    const { data } = await axios.post(`${API_URL}/trade-confirmation`, { trade });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/trade-confirmation failed`, e?.response?.data);
  }
}

export async function sendOfferEmail(listing: any, price: string) {
  try {
    const { data } = await axios.post(`${API_URL}/offer-created`, { listing, price });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/offer-created failed`, e?.response?.data);
  }
}

export async function sendTradeOfferEmail(
  sellerListings: any,
  buyerListings: any,
  sellerId: string,
  buyerId: string,
  additionalFundsBuyer: string,
  additionalFundsSeller: string
) {
  try {
    const { data } = await axios.post(`${API_URL}/trade-created`, {
      sellerListings,
      buyerListings,
      sellerId,
      buyerId,
      additionalFundsBuyer,
      additionalFundsSeller,
    });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/trade-created failed`, e?.response?.data);
  }
}

export async function sendDeclineOfferEmail(offer: any) {
  try {
    const { data } = await axios.post(`${API_URL}/offer-declined`, { offer });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/offer-declined failed`, e?.response?.data);
  }
}

export async function sendDeclineTradeOfferEmail(trade: any) {
  try {
    const { data } = await axios.post(`${API_URL}/trade-declined`, { trade });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/trade-declined failed`, e?.response?.data);
  }
}

export async function fetchPaymentMethod(paymentMethodId: any) {
  try {
    const { data } = await axios.get(`${API_URL}/payment-method-details/${paymentMethodId}`);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/payment-method-details/${paymentMethodId} failed`, e?.response?.data);
  }
}

export async function chargeOffer(offer: any) {
  try {
    const { data } = await axios.post(`${API_URL}/charge-offer`, offer);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/charge-offer failed`, e?.response?.data);
  }
}

export async function chargeBuy({ uid, listingId }: any) {
  try {
    const { data } = await axios.post(`${API_URL}/charge-buy`, { uid, listingId });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/charge-buy failed`, e?.response?.data);
  }
}
export async function chargeTrade(tradeId: any) {
  try {
    const { data } = await axios.post(`${API_URL}/charge-trade`, { tradeId });
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/charge-trade failed`, e?.response?.data);
  }
}

export async function postFlagContent(info: any) {
  try {
    const { data } = await axios.post(`${API_URL}/flagged-content`, info);
    return data;
  } catch (e: any) {
    console.log(`${API_URL}/flagged-content failed`, e?.response?.data);
  }
}