import axios from "axios";
import Constants from "expo-constants";

export const API_URL = Constants?.expoConfig?.extra?.apiUrl;

export async function fetchOutfits(uid: string | undefined) {
  try {
    const { data } = await axios.get(`${API_URL}/outfits`, { params: { uid } });
    return data;
  } catch (e) {
    console.log(`${API_URL}/outfits failed`, e);
  }
}

export async function fetchOutfit(id: number, uid: string) {
  try {
    const { data } = await axios.get(`${API_URL}/outfit/${id}`, { params: { uid } });
    return data;
  } catch (e) {
    console.log(`${API_URL}/outfit/${id} failed`, e);
  }
}

export async function fetchUser(uid: string | undefined) {
  try {
    const { data } = await axios.get(`${API_URL}/user/${uid}`);
    return data;
  } catch (e) {
    console.log(`${API_URL}/user/${uid} failed`, e);
  }
}

export async function blockUser(uid: string | undefined, blockedUid: string | undefined) {
  try {
    const { data } = await axios.post(`${API_URL}/block-user`,  { uid, blockedUid });
    return data;
  } catch (e) {
    console.log(`${API_URL}/block-user failed`, e);
  }
}

export async function postOutfit(outfit: any) {
  try {
    const { data } = await axios.post(`${API_URL}/outfit`, outfit);
    return data;
  } catch (e) {
    console.log(`${API_URL}/outfit failed`, e);
  }
}

export async function postComment(comment: any) {
  console.log('comment', comment)
  try {
    const { data } = await axios.post(`${API_URL}/comment`, comment);
    return data;
  } catch (e) {
    console.log(`${API_URL}/comment failed`, e);
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
  } catch (e) {
    console.log(`${API_URL}/offer failed`, e);
  }
}
export async function postTrade(trade: any) {
  try {
    const { data } = await axios.post(`${API_URL}/trade`, trade);
    return data;
  } catch (e) {
    console.log(`${API_URL}/trade failed`, e);
  }
}
export async function fetchOffersByUser(uid: string) {
  try {
    const { data } = await axios.get(`${API_URL}/offers/${uid}`);
    return data;
  } catch (e) {
    console.log(`${API_URL}/offers/${uid} failed`, e);
  }
}
export async function fetchTradesByUser(uid: string) {
  try {
    const { data } = await axios.get(`${API_URL}/trades/${uid}`);
    return data;
  } catch (e) {
    console.log(`${API_URL}/trades/${uid} failed`, e);
  }
}
export async function updateOffer(offer: any) {
  try {
    const { data } = await axios.patch(`${API_URL}/offer`, offer);
    return data;
  } catch (e) {
    console.log(`${API_URL}/offer failed`, e);
  }
}
export async function updateTrade(trade: any) {
  try {
    const { data } = await axios.patch(`${API_URL}/trade`, trade);
    return data;
  } catch (e) {
    console.log(`${API_URL}/trade failed`, e);
  }
}

export async function updateOutfit(outfit: any) {
  try {
    const { data } = await axios.patch(`${API_URL}/outfit`, outfit);
    return data;
  } catch (e) {
    console.log(`${API_URL}/outfit failed`, e);
  }
}

export async function deleteOutfit(outfit: any) {
  try {
    const { data } = await axios.delete(`${API_URL}/outfit`, { data: outfit });
    return data;
  } catch (e) {
    console.log(`${API_URL}/outfit failed`, e);
  }
}

export async function postUser(user: any) {
  try {
    const { data } = await axios.post(`${API_URL}/user`, user);
    return data;
  } catch (e) {
    console.log(`${API_URL}/user failed`, e);
  }
}

export async function postVote(postVote: any) {
  try {
    const { data } = await axios.post(`${API_URL}/post-vote`, postVote);
    return data;
  } catch (e) {
    console.log(`${API_URL}/post-vote failed`, e);
  }
}

export async function updateUser(user: any) {
  try {
    const { data } = await axios.patch(`${API_URL}/user`, user);
    return data;
  } catch (e) {
    console.log(`${API_URL}/user failed`, e);
  }
}

export async function deleteUser(uid: any) {
  try {
    const { data } = await axios.delete(`${API_URL}/user`, { data: { uid } });
    return data;
  } catch (e) {
    console.log(`${API_URL}/user delete failed`, e);
  }
}

export async function checkStripeConnectAccountStatus(accountId: any) {
  try {
    const { data } = await axios.get(`${API_URL}/account-status/${accountId}`);
    return data;
  } catch (e) {
    console.log(`${API_URL}/account-status/${accountId} failed`, e);
  }
}

export async function createStripeConnectAccount(user: any, redirectUrl: string) {
  try {
    const { data } = await axios.post(`${API_URL}/create-account`, user, { params: { redirectUrl } });
    return data;
  } catch (e) {
    console.log(`${API_URL}/create-account failed`, e);
  }
}

export async function sendConfirmationEmail(currentUser: any, listing: any, offer: any) {
  try {
    const { data } = await axios.post(`${API_URL}/order-confirmation`, { currentUser, listing, offer });
    return data;
  } catch (e) {
    console.log(`${API_URL}/order-confirmation failed`, e);
  }
}
export async function sendTradeConfirmationEmail(trade: any) {
  try {
    const { data } = await axios.post(`${API_URL}/trade-confirmation`, { trade });
    return data;
  } catch (e) {
    console.log(`${API_URL}/trade-confirmation failed`, e);
  }
}

export async function sendOfferEmail(listing: any, price: string) {
  try {
    const { data } = await axios.post(`${API_URL}/offer-created`, { listing, price });
    return data;
  } catch (e) {
    console.log(`${API_URL}/offer-created failed`, e);
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
  } catch (e) {
    console.log(`${API_URL}/trade-created failed`, e);
  }
}

export async function sendDeclineOfferEmail(offer: any) {
  try {
    const { data } = await axios.post(`${API_URL}/offer-declined`, { offer });
    return data;
  } catch (e) {
    console.log(`${API_URL}/offer-declined failed`, e);
  }
}

export async function sendDeclineTradeOfferEmail(trade: any) {
  try {
    const { data } = await axios.post(`${API_URL}/trade-declined`, { trade });
    return data;
  } catch (e) {
    console.log(`${API_URL}/trade-declined failed`, e);
  }
}

export const fetchPaymentSheetParams = async (customerId: string, listingId: any, accountId: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/payment-sheet`, {
      customerId,
      listingIds: listingId ? [listingId] : undefined,
      accountId,
    });
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const fetchSetupPaymentSheetParams = async (uid: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/setup-payment`, {
      uid,
    });
    return data;
  } catch (e) {
    console.log(e);
  }
};
export const checkPaymentMethods = async (customerId: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/check-payment-methods`, {
      customerId,
    });
    return data;
  } catch (e) {
    console.log(e);
  }
};

export async function fetchPaymentMethod(paymentMethodId: any) {
  try {
    const { data } = await axios.get(`${API_URL}/payment-method-details/${paymentMethodId}`);
    return data;
  } catch (e) {
    console.log(`${API_URL}/payment-method-details/${paymentMethodId} failed`, e);
  }
}

export async function chargeOffer(offer: any) {
  try {
    const { data } = await axios.post(`${API_URL}/charge-offer`, offer);
    return data;
  } catch (e) {
    console.log(`${API_URL}/charge-offer failed`, e);
  }
}

export async function chargeBuy({ uid, listingId }: any) {
  try {
    const { data } = await axios.post(`${API_URL}/charge-buy`, { uid, listingId });
    return data;
  } catch (e) {
    console.log(`${API_URL}/charge-buy failed`, e);
  }
}
export async function chargeTrade(tradeId: any) {
  try {
    const { data } = await axios.post(`${API_URL}/charge-trade`, { tradeId });
    return data;
  } catch (e) {
    console.log(`${API_URL}/charge-trade failed`, e);
  }
}

export async function postFlagContent(info: any) {
  try {
    const { data } = await axios.post(`${API_URL}/flagged-content`, info);
    return data;
  } catch (e) {
    console.log(`${API_URL}/flagged-content failed`, e);
  }
}