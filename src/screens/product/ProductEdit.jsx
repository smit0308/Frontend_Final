import { PrimaryButton, Caption, Title } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllProduct, getProduct, selectProduct, updateProduct } from "../../redux/features/productSlice";
import { toast } from "react-toastify";

export const ProductEdit = () => {
  useRedirectLoggedOutUser("/login");

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productEdit = useSelector(selectProduct);
  const { isSuccess, isLoading, isError, message } = useSelector((state) => state.product);
  const [product, setProduct] = useState(null);
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setimagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await dispatch(getProduct(id)).unwrap();
        setProduct(result);
        if (result?.image) {
          setimagePreview(`${result.image.filepath}`);
        }
      } catch (error) {
        toast.error(error || "Failed to fetch product details");
        navigate("/product");
      }
    };
    fetchProduct();
  }, [dispatch, id, navigate]);

  useEffect(() => {
    if (productEdit) {
      setProduct(productEdit);
      if (productEdit.image) {
        setimagePreview(`${productEdit.image.filepath}`);
      }
    }
  }, [productEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    setimagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const validateForm = () => {
    if (!product?.title?.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!product?.price || product.price <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!product?.description?.trim()) {
      toast.error("Description is required");
      return false;
    }
    return true;
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", product?.title);
      formData.append("height", product?.height);
      formData.append("lengthpic", product?.lengthpic);
      formData.append("width", product?.width);
      formData.append("mediumused", product?.mediumused);
      formData.append("weigth", product?.weigth);
      formData.append("price", product?.price);
      formData.append("description", product?.description);

      if (productImage) {
        formData.append("image", productImage);
      }

      await dispatch(updateProduct({ id, formData })).unwrap();
      await dispatch(getAllProduct());
      toast.success("Product updated successfully");
      navigate("/product");
    } catch (error) {
      toast.error(error || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{message || "Failed to load product details"}</p>
        <button 
          onClick={() => navigate("/product")}
          className="mt-4 text-purple-500 hover:text-purple-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="bg-white shadow-s1 p-8 rounded-xl">
        <Title level={5} className="font-normal mb-5">
          Update Product
        </Title>
        <hr className="my-5" />
        <form onSubmit={saveProduct}>
          <div className="w-full">
            <Caption className="mb-2">Title *</Caption>
            <input 
              type="text" 
              name="title" 
              value={product?.title || ""} 
              onChange={handleInputChange} 
              className={`${commonClassNameOfInput}`} 
              placeholder="Title" 
              required 
            />
          </div>

          <div className="flex items-center gap-5 my-4">
            <div className="w-1/2">
              <Caption className="mb-2">Height (cm)</Caption>
              <input 
                type="number" 
                name="height" 
                value={product?.height || ""} 
                onChange={handleInputChange} 
                placeholder="height" 
                className={`${commonClassNameOfInput}`} 
              />
            </div>
            <div className="w-1/2">
              <Caption className="mb-2">Length (cm)</Caption>
              <input 
                type="number" 
                name="lengthpic" 
                value={product?.lengthpic || ""} 
                onChange={handleInputChange} 
                placeholder="Length" 
                className={`${commonClassNameOfInput}`} 
              />
            </div>
          </div>
          <div className="flex items-center gap-5 my-4">
            <div className="w-1/2">
              <Caption className="mb-2">Width (cm)</Caption>
              <input 
                type="number" 
                name="width" 
                value={product?.width || ""} 
                onChange={handleInputChange} 
                placeholder="width" 
                className={`${commonClassNameOfInput}`} 
              />
            </div>
            <div className="w-1/2">
              <Caption className="mb-2">
                Medium used <span className="text-purple-400 italic">(Typically, pencil, ink, charcoal or other)</span>
              </Caption>
              <input 
                type="text" 
                name="mediumused" 
                value={product?.mediumused || ""} 
                onChange={handleInputChange} 
                placeholder="Medium used" 
                className={commonClassNameOfInput} 
              />
            </div>
          </div>
          <div className="flex items-center gap-5 mt-4">
            <div className="w-1/2">
              <Caption className="mb-2">
                Weight of piece <span className="text-purple-400 italic">(kg)</span>
              </Caption>
              <input 
                type="number" 
                name="weigth" 
                value={product?.weigth || ""} 
                onChange={handleInputChange} 
                placeholder="weight" 
                className={`${commonClassNameOfInput}`} 
              />
            </div>
            <div className="w-1/2">
              <Caption className="mb-2">Price Range*</Caption>
              <input 
                type="number" 
                name="price" 
                value={product?.price || ""} 
                onChange={handleInputChange} 
                className={`${commonClassNameOfInput}`} 
                placeholder="Price" 
                required 
              />
            </div>
          </div>

          <div>
            <Caption className="mb-2">Description *</Caption>
            <textarea 
              name="description" 
              value={product?.description || ""} 
              onChange={handleInputChange} 
              className={`${commonClassNameOfInput}`} 
              cols="30" 
              rows="5"
              required
            ></textarea>
          </div>
          <div>
            <Caption className="mb-2">Image</Caption>
            <input 
              type="file" 
              className={`${commonClassNameOfInput}`} 
              name="image" 
              onChange={handleImageChange} 
              accept="image/*"
            />
            {imagePreview ? (
              <div>
                <img src={imagePreview} alt="Product preview" className="mt-5 rounded-lg w-48 h-48 object-cover" />
              </div>
            ) : (
              <p className="text-gray-500 mt-2">No image set for this product</p>
            )}
          </div>
          <PrimaryButton 
            type="submit" 
            className="rounded-none my-5"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </PrimaryButton>
        </form>
      </section>
    </>
  );
};
