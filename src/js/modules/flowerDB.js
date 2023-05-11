import axiosV from 'axios';
import { uid } from 'uid';
import { toBase64 } from './helpers';

const axios = axiosV.create({
  baseURL: 'http://localhost:3000/dev',
});

class FlowerAPI {
  updateProduct() {}

  getProducts() {}

  getCategories() {}

  createCategory() {}

  async createProduct({ image, ...product }) {
    const newProduct = (await axios.post('/products', product)).data;
    const id = newProduct.insertedId;
    await this.#updateImage(id, image);
  }

  async #updateImage(productId, file) {
    const params = new URLSearchParams({
      productId,
      fileName: uid() + file.name.slice(-4),
      fileType: file.type,
    });

    const base64 = await toBase64(file);
    await axios.post(`/files?${params}`, base64);
  }
}

export const flowersApi = new FlowerAPI();
