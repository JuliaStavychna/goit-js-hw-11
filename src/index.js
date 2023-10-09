import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { elements } from './elements';
import { BASE_URL, options } from './api';

const { galleryEl, searchInput, searchForm, loaderEl } = elements;

let totalHits = 0;
let isLoadingMore = false;
let reachedEnd = false;

const lightbox = new SimpleLightbox('.lightbox', {
  captionsData: 'alt',
  captionDelay: 250,
  enableKeyboard: true,
  showCounter: false,
  scrollZoom: false,
  close: false,
});
searchForm.addEventListener('submit', onFormSybmit);
window.addEventListener('scroll', onScrollHandler);
document.addEventListener('DOMContentLoaded', hideLoader);

function showLoader() {
  loaderEl.style.display = 'block';
}

function hideLoader() {
  loaderEl.style.display = 'none';
}

function renderGallery(hits) {
  const markup = hits
    .map(item => {
      return `
            <a href="${item.largeImageURL}" class="lightbox">
                <div class="photo-card">
                    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${item.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${item.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${item.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${item.downloads}
                        </p>
                    </div>
                </div>
            </a>
            `;
    })
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);

  if (options.params.page * options.params.per_page >= totalHits) {
    if (!reachedEnd) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      reachedEnd = true;
    }
  }
  lightbox.refresh();
}

async function getArray(wordRequest, page) {
  const params = {
    key: '39802923-d8b3f86254aa0fe1b36a34a60',
    q: wordRequest,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };
}

function onScrollHandler() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const scrollThreshold = 300;
  if (
    scrollTop + clientHeight >= scrollHeight - scrollThreshold &&
    galleryEl.innerHTML !== '' &&
    !isLoadingMore &&
    !reachedEnd
  ) {
    loadMore();
  }
}

async function onFormSybmit(e) {
  e.preventDefault();
  options.params.q = searchInput.value.trim();
  if (options.params.q === '') {
    return;
  }
  options.params.page = 1;
  galleryEl.innerHTML = '';
  reachedEnd = false;

  try {
    const nextPageResponse = await getArray(currentSearchQuery, currentPage);
    if (nextPageResponse.hits.length > 0) {
      displayImages(nextPageResponse.hits);
      updateLoadMoreBtn(nextPageResponse.totalHits);
      if (!isFirstLoad) {
        Notiflix.Notify.success(
          'Hooray! We found these images by your request.'
        );
      }
      Notiflix.Notify.success('Look! We found some more pictures for you!');
      lightbox.refresh();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure(
      'An error occurred while fetching data. Please try again later.'
    );
  }
}
