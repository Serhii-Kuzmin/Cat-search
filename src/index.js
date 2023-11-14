
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  breedSelectEl: document.querySelector('.breed-select'),
  catInfoEl: document.querySelector('.cat-info'),
  loaderInfoEl: document.querySelector('.loader'),
  errorEl: document.querySelector('.error'),
};

const { breedSelectEl, catInfoEl, loaderInfoEl, errorEl } = refs;


catInfoEl.classList.add('is-hidden');

breedSelectEl.addEventListener('change', createMarkUp);

updateSelect();

function updateSelect(data) {
  fetchBreeds(data)
    .then(data => {
      loaderInfoEl.classList.replace('loader', 'is-hidden');

      let markSelect = data.map(({ name, id }) => {
        return `<option value ='${id}'>${name}</option>`;
      });
      breedSelectEl.insertAdjacentHTML('beforeend', markSelect);
      new SlimSelect({
        select: breedSelectEl,
      });
    })
    .catch(onFetchError);
}

function createMarkUp(event) {
  loaderInfoEl.classList.replace('is-hidden', 'loader');
  breedSelectEl.classList.add('is-hidden');
  catInfoEl.classList.add('is-hidden');

  const breedId = event.currentTarget.value;

  fetchCatByBreed(breedId)
    .then(data => {
      loaderInfoEl.classList.replace('loader', 'is-hidden');
      breedSelectEl.classList.remove('is-hidden');
      const { url, breeds } = data[0];

      catInfoEl.innerHTML = `<img src="${url}" alt="${breeds[0].name}" width="400"/><div class="box"><h2>${breeds[0].name}</h2><p>${breeds[0].description}</p><p><strong>Temperament:</strong> ${breeds[0].temperament}</p></div>`;
      catInfoEl.classList.remove('is-hidden');
    })
    .catch(onFetchError);
}

function onFetchError() {
  breedSelectEl.classList.remove('is-hidden');
  loaderInfoEl.classList.replace('loader', 'is-hidden');

  Notify.failure(
    'Oops! Something went wrong! Try reloading the page or select another cat breed!'
  );
}
