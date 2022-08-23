import axios from "axios";

export const API_URL = "http://localhost:8081";
// export const API_URL = "https://instaheat-server.herokuapp.com"

export async function fetchListings() {
  try {
    const { data } = await axios.get(`${API_URL}/listings`);
    return data;
  } catch (e) {
    console.log("fetch listings failed", e);
  }
}

export async function fetchListing(id: number) {
  const { data } = await axios.get(`${API_URL}/listing/${id}`);
  return data;
}

export async function fetchUser(uid: string | undefined) {
  try {
    const { data } = await axios.get(`${API_URL}/user/${uid}`);
    return data;
  } catch (e) {
    console.log("fetch user failed", e);
  }
}

export async function postListing(listing: any) {
  const { data } = await axios.post(`${API_URL}/listing`, listing);
  return data;
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
    console.log("post offer failed", e);
  }
}
export async function fetchOffersByUser(uid: string) {
  const { data } = await axios.get(`${API_URL}/offers/${uid}`);
  return data;
}
export async function updateOffer(offer: any) {
  const { data } = await axios.patch(`${API_URL}/offer`, offer);
  return data;
}

export async function updateListing(listing: any) {
  const { data } = await axios.patch(`${API_URL}/listing`, listing);
  return data;
}

export async function deleteListing(listing: any) {
  const { data } = await axios.delete(`${API_URL}/listing`, { data: listing });
  return data;
}

export async function postUser(user: any) {
  const { data } = await axios.post(`${API_URL}/user`, user);
  return data;
}

export async function updateUser(user: any) {
  const { data } = await axios.patch(`${API_URL}/user`, user);
  return data;
}

export async function checkStripeConnectAccountStatus(accountId: any) {
  const { data } = await axios.get(`${API_URL}/account-status/${accountId}`);
  return data;
}

export async function createStripeConnectAccount(user: any) {
  const { data } = await axios.post(`${API_URL}/create-account`, user);
  return data;
}

export async function sendConfirmationEmail(currentUser: any, listing: any, offer: any) {
  const { data } = await axios.post(`${API_URL}/order-confirmation`, { currentUser, listing, offer });
  return data;
}
export async function sendOfferEmail(listing: any, price: string) {
  const { data } = await axios.post(`${API_URL}/offer-created`, { listing, price });
  return data;
}
export async function sendDeclineOfferEmail(offer: any) {
  const { data } = await axios.post(`${API_URL}/offer-declined`, { offer });
  return data;
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
  const { data } = await axios.post(`${API_URL}/charge-offer`, offer);
  return data;
}
