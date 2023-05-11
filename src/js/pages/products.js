import _ from 'lodash';
import { flowersApi } from '../modules/flowerDB.js';

const refs = {
  formElem: document.querySelector('.js-form'),
  previewElem: document.querySelector('.js-preview'),
  smallPreviewElem: document.querySelector('.js-small-preview'),
  testBtnElem: document.querySelector('.js-save-img'),
};

refs.formElem.addEventListener('input', _.throttle(onInputChange, 300));
refs.formElem.addEventListener('change', onImageChange);

function onInputChange() {
  const formData = new FormData(refs.formElem);
  const data = {};

  formData.forEach((el, key) => {
    data[key] = el;
  });

  renderPopular(data);
  renderSmallPopular(data);
}

function onImageChange(e) {
  if (e.target.type !== 'file') return;
  const previewImage = document.querySelector('.js-preview-image');
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function renderPopular({ name, description, price, compound }) {
  const markup = `
            <p class="h3">${name}</p>
            <p>В наявності</p>
            <p>${description}</p>
            <p class="h3">Містить</p>
            ${compound
              .split('\n')
              .map(el => {
                return '<p>' + el + '</p>';
              })
              .join('')}
            <p class="h3">${price} UAH</p>
    `;

  refs.previewElem.innerHTML = markup;
}

function renderSmallPopular({ name, price }) {
  const titleElem = refs.smallPreviewElem.querySelector('.h4');
  const priceElem = refs.smallPreviewElem.querySelector('.h3');
  titleElem.textContent = name;
  priceElem.textContent = price + ' UAH';
}

refs.testBtnElem.addEventListener('click', async () => {});

refs.formElem.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {};

  data['popularity'] = 0;
  data['isAvailable'] = true;

  formData.forEach((el, key) => {
    data[key] = el;
  });
  flowersApi.createProduct(data);
  e.target.reset();
}
