import axios from "axios";

// const API_URL = "http://localhost:8081"
const API_URL = "https://instaheat-server.herokuapp.com"

export async function fetchListings() {
  const { data } = await axios.get(`${API_URL}/listings`);
  return data;
}

export async function fetchUser(id: number) {
  const { data } = await axios.get(`${API_URL}/user/${id}`);
  return data;
}

export async function postListing(listing: any) {
  const { data } = await axios.post(`${API_URL}/listing`, listing);
  return data;
}