import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import productService from '../services/productService';
import { toast } from 'react-toastify';

const initialState = {
    products: [],  
    userproducts: [],  
    wonproducts: [],  
    product: null,  
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const createProduct = createAsyncThunk("product/create", async (formData,thunkAPI) => {
    try{
      return await productService.createProduct(formData);
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
      return thunkAPI.rejectWithValue(errorMessage);
    }
  });

export const getAllProduct = createAsyncThunk("product/public/get-products", async (_,thunkAPI) => {
    try{
      return await productService.getAllProduct();
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
      return thunkAPI.rejectWithValue(errorMessage);
    }
  });

export const getProduct = createAsyncThunk("product/public/get-product", async (id, thunkAPI) => {
    try{
      return await productService.getProduct(id);
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
      return thunkAPI.rejectWithValue(errorMessage);
    }
  });  

export const getAllProductofUser = createAsyncThunk("product/get-user-products", async (_,thunkAPI) => {
    try{
      return await productService.getAllProductofUser();
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
      return thunkAPI.rejectWithValue(errorMessage);
    }
  });

export const getAllWonedProductofUser = createAsyncThunk("product/get-woned-user-products", async (_,thunkAPI) => {
    try{
      return await productService.getAllWonedProductofUser();
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
      return thunkAPI.rejectWithValue(errorMessage);
    }
  });

export const deleteProduct = createAsyncThunk("product/delete", async (id,thunkAPI) => {
    try{
      return await productService.deleteProduct(id);
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
      return thunkAPI.rejectWithValue(errorMessage);
    }
  });

export const updateProduct = createAsyncThunk("product/user/update", async ({id, formData},thunkAPI) => {
    try{
      return await productService.updateProduct(id, formData);
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
      return thunkAPI.rejectWithValue(errorMessage);
    }
  });

export const updateProductByAdmin = createAsyncThunk("product/admin/update", async ({id, formData},thunkAPI) => {
    try{
      return await productService.updateProductByAdmin(id, formData);
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
      return thunkAPI.rejectWithValue(errorMessage);
    }
  });

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
      builder
          .addCase(createProduct.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(createProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.products.push(action.payload);
            toast.success("Product created successfully");
          })
          .addCase(createProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            toast.error(action.payload);
          })
          .addCase(getAllProduct.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(getAllProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.products = action.payload;
          })
          .addCase(getAllProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
          })
          .addCase(getProduct.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(getProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.product = action.payload;
          })
          .addCase(getProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
          })
          .addCase(getAllWonedProductofUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(getAllWonedProductofUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.wonedproducts = action.payload;
          })
          .addCase(getAllWonedProductofUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
          })
          .addCase(getAllProductofUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(getAllProductofUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.userproducts = action.payload;
          })
          .addCase(getAllProductofUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
          })
          .addCase(deleteProduct.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(deleteProduct.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            toast.success("Product deleted successfully");
          })
          .addCase(deleteProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            toast.success(action.payload);
          })
          .addCase(updateProduct.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(updateProduct.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            toast.success("Product updated successfully");
          })
          .addCase(updateProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            toast.success(action.payload);
          })
          .addCase(updateProductByAdmin.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(updateProductByAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = action.payload;
            toast.success("Product updated successfully");
          })
          .addCase(updateProductByAdmin.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            toast.success(action.payload);
          });
},
});

export const selectProduct = (state) => state.product.product;
export default productSlice.reducer;