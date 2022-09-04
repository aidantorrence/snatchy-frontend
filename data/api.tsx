import axios from "axios";

// export const API_URL = "http://localhost:8081";
export const API_URL = "https://instaheat-server.herokuapp.com";

export async function fetchListings() {
  try {
    const { data } = await axios.get(`${API_URL}/listings`);
    return data;
  } catch (e) {
    console.log(`${API_URL}/listings failed`, e);
  }
}

export async function fetchListing(id: number) {
  try {
    const { data } = await axios.get(`${API_URL}/listing/${id}`);
    return data;
  } catch (e) {
    console.log(`${API_URL}/listing/${id} failed`, e);
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

export async function postListing(listing: any) {
  try {
    const { data } = await axios.post(`${API_URL}/listing`, listing);
    return data;
  } catch (e) {
    console.log(`${API_URL}/listing failed`, e);
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

export async function updateListing(listing: any) {
  try {
    const { data } = await axios.patch(`${API_URL}/listing`, listing);
    return data;
  } catch (e) {
    console.log(`${API_URL}/listing failed`, e);
  }
}

export async function deleteListing(listing: any) {
  try {
    const { data } = await axios.delete(`${API_URL}/listing`, { data: listing });
    return data;
  } catch (e) {
    console.log(`${API_URL}/listing failed`, e);
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

export async function updateUser(user: any) {
  try {
    const { data } = await axios.patch(`${API_URL}/user`, user);
    return data;
  } catch (e) {
    console.log(`${API_URL}/user failed`, e);
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

export async function createStripeConnectAccount(user: any) {
  try {
    const { data } = await axios.post(`${API_URL}/create-account`, user);
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
    const { data } = await axios.post(`${API_URL}/trade-confirmation`,  { trade });
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

export const fetchSetupPaymentSheetParams = async (customerId: string) => {
  console.log("customerId", customerId);
  try {
    const { data } = await axios.post(`${API_URL}/setup-payment`, {
      customerId,
    });
    return data;
  } catch (e) {
    console.log(e);
  }
};

export async function chargeOffer(offer: any) {
  try {
    const { data } = await axios.post(`${API_URL}/charge-offer`, offer);
    return data;
  } catch (e) {
    console.log(`${API_URL}/charge-offer failed`, e);
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
