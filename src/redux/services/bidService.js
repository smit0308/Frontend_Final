import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const BIDDING_URL = `${BACKEND_URL}/bidding`; // Remove trailing slash

const placebid = async (formData) => {
    console.log("Sending bid to server:", formData);
    try {
        const response = await axios.post(BIDDING_URL, {
            productId: formData.productId,
            price: parseFloat(formData.price),
            currency: formData.currency || "USD" // Ensure currency is always sent
        });
        return response.data;
    } catch (error) {
        console.error("Error placing bid:", error.response?.data || error.message);
        throw error;
    }
};

const fetchbiddingHistory = async (id) => {
    const response = await axios.get(`${BIDDING_URL}/${id}`);
    return response.data;
};

const sellproductsbyuser = async (productId) => {
    const response = await axios.post(`${BIDDING_URL}/sell`, productId); // corrected url
    return response.data;
};

const biddingService = {
    placebid,
    fetchbiddingHistory,
    sellproductsbyuser,
};

export default biddingService;