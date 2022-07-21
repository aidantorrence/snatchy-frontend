import axios from "axios";
import ItemsWantedScreen from "../Screens/ItemsWantedScreen";

export const API_URL = "http://localhost:8081";
// export const API_URL = "https://instaheat-server.herokuapp.com"

export async function fetchListings() {
  try {
    const { data } = await axios.get(`${API_URL}/listings`);
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchListing(id: number) {
  const { data } = await axios.get(`${API_URL}/listing/${id}`);
  return data;
}

export async function fetchUser(uid: string | undefined) {
  const { data } = await axios.get(`${API_URL}/user/${uid}`);
  return data;
}

export async function postListing(listing: any) {
  const { data } = await axios.post(`${API_URL}/listing`, listing);
  return data;
}

export async function updateListing(listing: any) {
  const { data } = await axios.patch(`${API_URL}/listing`, listing);
  return data;
}

export async function deleteListing(listing: any) {
  console.log(listing);
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

export const fetchPaymentSheetParams = async (customerId: string, itemsWanted: any[], listing: any) => {
  let listingIds;
  if (itemsWanted.length) {
    listingIds = itemsWanted.map((item: any) => item.id);
  } else {
    listingIds = [listing.id];
  }
  try {
    const { data } = await axios.post(`${API_URL}/payment-sheet`, {
      customerId,
      listingIds,
    });
    return data;
  } catch (e) {
    console.log(e);
  }
};
