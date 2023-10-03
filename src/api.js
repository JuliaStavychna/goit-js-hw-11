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
