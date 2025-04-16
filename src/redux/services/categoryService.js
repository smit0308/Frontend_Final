import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const CATEGORY_URL = `${BACKEND_URL}/category/`;

const createCategory = async (formData) => {
    const response = await axios.post(CATEGORY_URL, formData);
    return response.data;
};

const getAllCategory = async () => {
    const response = await axios.get(CATEGORY_URL);
    return response.data;
};

const updateCategory = async (id, formData) => {
    const response = await axios.put(`${CATEGORY_URL}/${id}`, formData);
    return response.data;
};

const deleteCategory = async (id) => {
    const response = await axios.delete(`${CATEGORY_URL}/${id}`);
    return response.data;
};

const categoryService = {
    createCategory,
    getAllCategory,
    deleteCategory,
    updateCategory,
};

export default categoryService;