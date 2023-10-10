import axios from 'axios';
export const BASE_URL = 'https://pixabay.com/api/';
export const API_KEY = '39802923-d8b3f86254aa0fe1b36a34a60';
export const options = {
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 1,
    q: '',
  },
};
export function getImages(query =''){
  options.params.q = query
  const url = `${BASE_URL}?${new URLSearchParams(options.params).toString()}`;
  const data = await axios.get(url);
  return data
}