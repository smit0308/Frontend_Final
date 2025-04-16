import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const PRODUCT_URL = `${BACKEND_URL}/product/`;

const createProduct = async (formData) => {
    // Log form data for debugging
    console.log("Currency in formData:", formData.get('currency'));
    console.log("Price in formData:", formData.get('price'));
    console.log("BuyNowPrice in formData:", formData.get('buyNowPrice'));
    
    const response = await axios.post(PRODUCT_URL, formData);
    return response.data;
};
const getAllProduct = async () => {
    const response = await axios.get(`${PRODUCT_URL}`);
    return response.data;
};
const getAllProductofUser = async () => {
    const response = await axios.get(`${PRODUCT_URL}/user`);
    return response.data;
};
const getAllWonedProductofUser = async () => {
    const response = await axios.get(`${PRODUCT_URL}/won-products`);
    return response.data;
};
const deleteProduct = async (id) => {
    const response = await axios.delete(`${PRODUCT_URL}/${id}`);
    return response.data;
};
const getProduct = async (id) => {
    const response = await axios.get(`${PRODUCT_URL}/${id}`);
    return response.data;
};
const updateProduct = async (id, formData) => {
    const response = await axios.put(`${PRODUCT_URL}/${id}`, formData);
    return response.data;
};
const updateProductByAdmin = async (id, formData) => {
    const response = await axios.patch(`${PRODUCT_URL}/admin/product-verified/${id}`, formData);
    return response.data;
};
// const deleteProductByAdmin = async (id, formData) => {
//     const response = await axios.delete(`${PRODUCT_URL}/admin/products/${id}`, formData);
//     return response.data;
// };

const productService = {
    createProduct,
    getAllProduct,
    getAllProductofUser,
    getAllWonedProductofUser,
    deleteProduct,
    getProduct,
    updateProduct,
    updateProductByAdmin,
};

export default productService;