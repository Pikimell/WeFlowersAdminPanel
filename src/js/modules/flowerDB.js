import axios from 'axios';
axios.defaults = {
  baseURL: 'http://localhost:3000/dev',
};

class FlowerAPI {
  updateProduct() {}

  getProducts() {}

  getCategories() {}

  createCategory() {}

  async createProduct({ image, ...product }) {
    const product = await axios.post('/products', product);
    console.log(product);
  }

  async #updateImage(productId, file) {
    const params = new URLSearchParams({
      fileName: uid() + file.name.slice(-4),
      fileType: file.type,
    });

    const base64 = await toBase64(file);
    const res = await axios.post(`/files?${params}`, base64);
    console.log(res);
  }
}

export const flowersApi = new FlowerAPI();
