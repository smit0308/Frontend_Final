import { CategoryDropDown, Caption, PrimaryButton, Title, Loader } from "../../router";

import { commonClassNameOfInput } from "../../components/common/Design";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createProduct } from "../../redux/features/productSlice";
import { createNotification } from "../../redux/features/notificationService";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";

const initialState = {
  title: "",
  description: "",
  price: "",
  height: "",
  lengthpic: "",
  width: "",
  mediumused: "",
  weigth: "",
  category: null,
  startDate: "",
  endDate: "",
  buyNowPrice: "",
  reservePrice: "",
  biddingIncrement: "",
  condition: "new",
  currency: "USD",
};

// Common currencies list
const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
];

export const AddProduct = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(initialState);
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const {
    title, 
    description, 
    price, 
    height, 
    lengthpic, 
    width, 
    mediumused, 
    weigth, 
    category,
    startDate,
    endDate,
    buyNowPrice,
    reservePrice,
    biddingIncrement,
    condition,
    currency
  } = product;
  
  const {isSuccess} = useSelector((state) => state.product);  

  // Fetch exchange rates on component mount
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setIsLoadingRates(true);
      try {
        // Try exchangerate-api.com (requires API key but more reliable)
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
          setExchangeRates(data.rates);
          console.log("Exchange rates loaded successfully");
        } else {
          // Fallback to another API if the first one fails
          console.log("Primary API failed, trying fallback...");
          const fallbackResponse = await fetch('https://api.exchangerate.host/latest?base=USD');
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData && fallbackData.rates) {
            setExchangeRates(fallbackData.rates);
            console.log("Exchange rates loaded from fallback API");
          } else {
            throw new Error("All API endpoints failed");
          }
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        toast.error("Error loading exchange rates. Using default USD conversion.");
        
        // Set default exchange rates for common currencies as a last resort
        setExchangeRates({
          "EUR": 0.93,
          "GBP": 0.79,
          "JPY": 150.5,
          "CAD": 1.38,
          "AUD": 1.52,
          "INR": 83.5,
          "CNY": 7.14,
          "SGD": 1.34,
          "CHF": 0.9
        });
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchExchangeRates();
  }, []);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setProduct({...product, [name]: value });
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    
    // Convert price fields from old currency to new currency
    if (exchangeRates && Object.keys(exchangeRates).length > 0) {
      const oldCurrencyToUSD = currency === "USD" ? 1 : 1 / (exchangeRates[currency] || 1);
      const usdToNewCurrency = newCurrency === "USD" ? 1 : (exchangeRates[newCurrency] || 1);
      
      // Function to convert prices
      const convertPrice = (priceValue) => {
        if (!priceValue) return "";
        const priceInUSD = parseFloat(priceValue) * oldCurrencyToUSD;
        return (priceInUSD * usdToNewCurrency).toFixed(2);
      };
      
      setProduct({
        ...product,
        currency: newCurrency,
        price: convertPrice(price),
        buyNowPrice: convertPrice(buyNowPrice),
        reservePrice: convertPrice(reservePrice),
        biddingIncrement: convertPrice(biddingIncrement)
      });
    } else {
      // Just update the currency if exchange rates aren't available
      setProduct({...product, currency: newCurrency});
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding these files would exceed the maximum
    if (productImages.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ["image/jpeg", "image/jpg", "image/png"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast.error(`File ${file.name} is not a valid image type (JPEG, JPG or PNG).`);
      }
      if (!isValidSize) {
        toast.error(`File ${file.name} exceeds the 5MB size limit.`);
      }
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length > 0) {
      // Create previews for the valid files
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      
      // Update state
      setProductImages([...productImages, ...validFiles]);
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...productImages];
    const newPreviews = [...imagePreviews];
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    
    // Remove the image and preview from arrays
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setProductImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) =>{
        e.preventDefault();
    
    if (productImages.length === 0) {
      toast.error("Please add at least one image");
      return;
    }
    
    // Start showing loader
    setIsSubmitting(true);
    
        const formData = new FormData();
        formData.append("title", title);
        formData.append("price", price);
        formData.append("lengthpic", lengthpic);
        formData.append("height", height);
        formData.append("width", width);
        formData.append("mediumused", mediumused);
        formData.append("weigth", weigth);
        formData.append("description", description);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("buyNowPrice", buyNowPrice);
    formData.append("reservePrice", reservePrice);
    formData.append("biddingIncrement", biddingIncrement);
    formData.append("condition", condition);
    formData.append("currency", currency);

    // Add the first image as main image
    if (productImages[0]) {
      formData.append("image", productImages[0]);
    }
    
    // Add all images to the images array, including the first one
    productImages.forEach((image) => {
      formData.append("images", image);
    });

        if(category){
          formData.append("category",category.label);
        }
    
    try {
      // Create the product
      const result = await dispatch(createProduct(formData));
      
      if (result && result.payload) {
        // Send notification to admin
        const notification = {
          recipient: "admin", // Admin role
          sender: user._id,
          title: "New Product Added",
          message: `${user.name} added a new product: ${title}. Please verify and add commission.`,
          link: `/product/admin`,
          isRead: false
        };
        
        await createNotification(notification);
        
        // Show completion animation
        setIsCompleted(true);
        
        // Wait for animation to complete before redirecting
        setTimeout(() => {
          navigate("/product");
        }, 1500);
      }
    } catch (error) {
      toast.error("Error creating product");
      console.error("Error creating product:", error);
      setIsSubmitting(false);
    }
  };

  // Get currency symbol for display
  const getCurrencySymbol = (currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? currency.symbol : currencyCode;
  };

  return (
    <>
      {isSubmitting && (
        <Loader 
          message="Creating product..." 
          isCompleted={isCompleted} 
          completedMessage="Product created successfully!"
        />
      )}
      
      <section className="bg-white shadow-s1 p-8 rounded-xl">
        <Title level={5} className=" font-normal mb-5">
          Create Product
        </Title>
        <hr className="my-5" />
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <Caption className="mb-2">Title *</Caption>
            <input 
              type="text" 
              value={product?.title} 
              onChange={handleInputChange} 
              name="title" 
              className={`${commonClassNameOfInput}`} 
              placeholder="Title" 
              required 
            />
          </div>

          {/* Auction Settings */}
          <div className="py-5">
            <Title level={6} className="font-semibold mb-4">Auction Settings</Title>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Caption className="mb-2">Start Date & Time *</Caption>
                <input 
                  type="datetime-local" 
                  name="startDate" 
                  value={startDate} 
                  onChange={handleInputChange} 
                  className={`${commonClassNameOfInput}`} 
                  required 
                />
              </div>
              <div>
                <Caption className="mb-2">End Date & Time *</Caption>
                <input 
                  type="datetime-local" 
                  name="endDate" 
                  value={endDate} 
                  onChange={handleInputChange} 
                  className={`${commonClassNameOfInput}`} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <Caption className="mb-2">Currency *</Caption>
                <select
                  name="currency"
                  value={currency}
                  onChange={handleCurrencyChange}
                  className={`${commonClassNameOfInput}`}
                  required
                  disabled={isLoadingRates}
                >
                  {isLoadingRates ? (
                    <option value="">Loading currencies...</option>
                  ) : (
                    currencies.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} - {curr.name} ({curr.symbol})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <Caption className="mb-2">Starting Price *</Caption>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {getCurrencySymbol(currency)}
                  </span>
                  <input 
                    type="number" 
                    name="price" 
                    value={price} 
                    onChange={handleInputChange} 
                    className={`${commonClassNameOfInput} pl-8`} 
                    placeholder="Starting Price" 
                    required 
                  />
                </div>
              </div>
              <div>
                <Caption className="mb-2">Buy Now Price</Caption>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {getCurrencySymbol(currency)}
                  </span>
                  <input 
                    type="number" 
                    name="buyNowPrice" 
                    value={buyNowPrice} 
                    onChange={handleInputChange} 
                    className={`${commonClassNameOfInput} pl-8`} 
                    placeholder="Optional" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Caption className="mb-2">Reserve Price</Caption>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {getCurrencySymbol(currency)}
                  </span>
                  <input 
                    type="number" 
                    name="reservePrice" 
                    value={reservePrice} 
                    onChange={handleInputChange} 
                    className={`${commonClassNameOfInput} pl-8`} 
                    placeholder="Optional" 
                  />
                </div>
              </div>
              <div>
                <Caption className="mb-2">Bidding Increment *</Caption>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {getCurrencySymbol(currency)}
                  </span>
                  <input 
                    type="number" 
                    name="biddingIncrement" 
                    value={biddingIncrement} 
                    onChange={handleInputChange} 
                    className={`${commonClassNameOfInput} pl-8`} 
                    placeholder="Minimum bid increase" 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Caption className="mb-2">Condition *</Caption>
              <select 
                name="condition" 
                value={condition} 
                onChange={handleInputChange} 
                className={`${commonClassNameOfInput}`}
                required
              >
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>
          </div>

          <div className="py-5">
            <Caption className="mb-2">Category *</Caption>
            <CategoryDropDown 
              value={category} 
              onChange={(selectedCategory) => setProduct({ ...product, category: selectedCategory})} 
              className={`${commonClassNameOfInput}`} 
            />
          </div>

        {category && (
          <>
          <div className="flex items-center gap-5 my-4">
            <div className="w-1/2">
              <Caption className="mb-2">Height (cm) </Caption>
                  <input 
                    type="number" 
                    name="height" 
                    value={product?.height} 
                    onChange={handleInputChange}  
                    placeholder="height" 
                    className={`${commonClassNameOfInput}`} 
                  />
            </div>
            <div className="w-1/2">
              <Caption className="mb-2">Length (cm) </Caption>
                  <input 
                    type="number" 
                    name="lengthpic" 
                    value={product?.lengthpic} 
                    onChange={handleInputChange}  
                    placeholder="Length" 
                    className={`${commonClassNameOfInput}`} 
                  />
            </div>
          </div>
          <div className="flex items-center gap-5 my-4">
            <div className="w-1/2">
              <Caption className="mb-2">Width (cm) </Caption>
                  <input 
                    type="number"  
                    name="width" 
                    value={product?.width} 
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
                    value={product?.mediumused} 
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
                    value={product?.weigth} 
                    onChange={handleInputChange} 
                    placeholder="weight" 
                    className={`${commonClassNameOfInput}`} 
                  />
            </div>
          </div>
          </>
        )}

          <div>
            <Caption className="mb-2">Description *</Caption>
            <textarea 
              name="description" 
              value={product?.description} 
              onChange={handleInputChange} 
              className={`${commonClassNameOfInput}`} 
              cols="30" 
              rows="5"
              required
            ></textarea>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <Caption>Product Images (1-5) <span className="text-red-500">*</span></Caption>
              <label className="cursor-pointer bg-green text-white py-1 px-3 rounded-lg flex items-center">
                <FaPlus className="mr-1" /> Add Images
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={handleImagesChange} 
                  accept="image/jpeg,image/jpg,image/png"
                  disabled={productImages.length >= 5}
                />
              </label>
            </div>
            
            <p className="text-sm text-gray-500 mb-3">The first image will be used as the main product image. You can drag to reorder.</p>
            
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className={`relative rounded-lg overflow-hidden ${index === 0 ? 'border-2 border-green' : ''}`}>
                    <img src={preview} alt={`Product ${index + 1}`} className="w-full h-32 object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FaTrash size={12} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-green text-white text-xs py-1 text-center">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-2">No images added yet</p>
                <p className="text-sm text-gray-400">Click "Add Images" to upload (JPEG, JPG, PNG up to 5MB)</p>
              </div>
            )}
          </div>

          <PrimaryButton type="submit" className="rounded-none my-5">
            CREATE
          </PrimaryButton>
        </form>
      </section>
    </>
  );
};
