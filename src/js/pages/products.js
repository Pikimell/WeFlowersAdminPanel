import _ from 'lodash';
import axios from 'axios';
import { uid } from 'uid';
import { toBase64 } from '../modules/helpers.js';

const refs = {
  formElem: document.querySelector('.js-form'),
  previewElem: document.querySelector('.js-preview'),
  smallPreviewElem: document.querySelector('.js-small-preview'),
  testBtnElem: document.querySelector('.js-save-img'),
};

refs.formElem.addEventListener('input', _.throttle(onInputChange, 300));

function onInputChange() {
  const formData = new FormData(refs.formElem);
  const data = {};

  formData.forEach((el, key) => {
    data[key] = el;
  });

  renderPopular(data);
  renderSmallPopular(data);
}

function renderPopular({ title, description, price, compound }) {
  const markup = `
            <p class="h3">${title}</p>
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

function renderSmallPopular({ title, price }) {
  const titleElem = refs.smallPreviewElem.querySelector('.h4');
  const priceElem = refs.smallPreviewElem.querySelector('.h3');
  titleElem.textContent = title;
  priceElem.textContent = price + ' UAH';
}

refs.formElem.addEventListener('change', function (e) {
  console.log(e.target.type !== 'file');
  if (e.target.type !== 'file') return;
  try {
    const previewImage = document.querySelector('.js-preview-image');
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  } catch (err) {
    console.log(err);
    console.log('Ple Enter Title');
  }
});

refs.testBtnElem.addEventListener('click', async () => {
  const BASE_URL = `http://localhost:3000/dev`;

  const url = `${BASE_URL}/files`;

  const files = refs.formElem.elements.image.files;
  const file = files[0];
  const params = new URLSearchParams({
    fileName: uid() + file.name.slice(-4),
    fileType: file.type,
  });
  if (files.length == 0) return;

  const base64 = await toBase64(file);
  axios.post(`${url}?${params}`, base64);
});
