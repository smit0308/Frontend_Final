import { Body, Caption, Container, DateFormatter, Loader, Title } from "../../router";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { commonClassNameOfInput } from "../../components/common/Design";
import { AiOutlinePlus } from "react-icons/ai";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct, getProduct } from "../../redux/features/productSlice";
import { useParams } from "react-router-dom";
import { fetchbiddingHistory, placebid } from "../../redux/features/biddingSlice";
import { toast } from "react-toastify";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import notificationService from "../../redux/features/notificationService";

export const ProductsDetailsPage = () => {
    useRedirectLoggedOutUser("/login");
    
    const dispatch = useDispatch();
    const { id } = useParams();
    const { product, isLoading } = useSelector((state) => state.product);
    const { history } = useSelector((state) => state.bidding);
    const { user } = useSelector((state) => state.auth);

    const [rate, setRate] = useState(0);
    const [activeTab, setActiveTab] = useState("description");
    const [timeLeft, setTimeLeft] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});
    const [auctionStatus, setAuctionStatus] = useState("active");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [allImages, setAllImages] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [exchangeRates, setExchangeRates] = useState({});
    const [isLoadingRates, setIsLoadingRates] = useState(false);
    
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

    // Load product data
    useEffect(() => {
        dispatch(getProduct(id));
    }, [dispatch, id]);

    // Fetch bidding history
    useEffect(() => {
        if(product && !product.isSoldout){
            dispatch(fetchbiddingHistory(id));
        }
    }, [dispatch, id, product]);

    // Set initial rate from highest bid or product price
    useEffect(() => {
        if(history && history.length > 0){
            const highestBid = Math.max(...history.map((bid) => bid.price));
            setRate(highestBid);
        }else if(product){
            setRate(product.price);
        }
    }, [history, product]);

    // Fetch exchange rates on component mount
    useEffect(() => {
      const fetchExchangeRates = async () => {
        setIsLoadingRates(true);
        try {
          const today = new Date().toISOString().split('T')[0]; // e.g., '2025-04-22'
          const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${today}/v1/currencies/usd.json`;

          const response = await fetch(url);
          const data = await response.json();

          if (data && data.usd) {
            setExchangeRates(data.usd);
            console.log("Exchange rates loaded from fawazahmed0 API");
    
            if (product && product.currency) {
              setSelectedCurrency(product.currency);
            }
          } else {
            throw new Error("Currency data not available in response");
          }
        } catch (error) {
          console.error("Error fetching exchange rates:", error);
          toast.error("Error loading exchange rates. Using default USD conversion.");
    
          // Fallback exchange rates
      setExchangeRates({
        "eur": 0.93,
        "gbp": 0.79,
        "jpy": 150.5,
        "cad": 1.38,
        "aud": 1.52,
        "inr": 83.5,
        "cny": 7.14,
        "sgd": 1.34,
        "chf": 0.9
      });

      if (product && product.currency) {
        setSelectedCurrency(product.currency);
      }
    } finally {
      setIsLoadingRates(false);
    }
  };

  fetchExchangeRates();
}, [product]);


          // Try openexchangerates API (more reliable, no API key for this endpoint)
          // const response = await fetch('https://open.er-api.com/v6/latest/USD');
          // const data = await response.json();
          
        //   if (data && data.rates) {
        //     setExchangeRates(data.rates);
        //     console.log("Exchange rates loaded successfully");
            
        //     // Set initial currency based on product's currency
        //     if (product && product.currency) {
        //       setSelectedCurrency(product.currency);
        //     }
        //   } else {
        //     // Fallback to another API if the first one fails
        //     console.log("Primary API failed, trying fallback...");
        //     const fallbackResponse = await fetch('https://api.exchangerate.host/latest?base=USD');
        //     const fallbackData = await fallbackResponse.json();
            
        //     if (fallbackData && fallbackData.rates) {
        //       setExchangeRates(fallbackData.rates);
        //       console.log("Exchange rates loaded from fallback API");
              
        //       // Set initial currency based on product's currency
        //       if (product && product.currency) {
        //         setSelectedCurrency(product.currency);
        //       }
        //     } else {
        //       throw new Error("All API endpoints failed");
        //     }
        //   }
        // } catch (error) {
        //   console.error("Error fetching exchange rates:", error);
        //   toast.error("Error loading exchange rates. Using default USD conversion.");
          
          // Set default exchange rates for common currencies as a last resort
    //       setExchangeRates({
    //         "EUR": 0.93,
    //         "GBP": 0.79,
    //         "JPY": 150.5,
    //         "CAD": 1.38,
    //         "AUD": 1.52,
    //         "INR": 83.5,
    //         "CNY": 7.14,
    //         "SGD": 1.34,
    //         "CHF": 0.9
    //       });
          
    //       // Set initial currency based on product's currency
    //       if (product && product.currency) {
    //         setSelectedCurrency(product.currency);
    //       }
    //     } finally {
    //       setIsLoadingRates(false);
    //     }
    //   };

    //   fetchExchangeRates();
    // }, [product]);

    // Convert price from product currency to selected currency with error checking
    const convertPrice = (price, fromCurrency, toCurrency) => {
      if (!price || !fromCurrency || !toCurrency) {
        return price;
      }
      
      const from = fromCurrency.toLowerCase();
      const to = toCurrency.toLowerCase();

      // If currencies are the same, no conversion needed
      if (from === to) {
        return parseFloat(price).toFixed(2);
      }
      
      // Check if exchange rates are available
      if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
        return price; // Return original price if no exchange rates
      }
      
      try {
        // Convert to USD first
        const priceInUSD = from === "USD" 
          ? parseFloat(price) 
          : parseFloat(price) / (exchangeRates[from] || 1);
        
        // Then convert from USD to target currency
        const convertedPrice = to === "USD"
          ? priceInUSD
          : priceInUSD * (exchangeRates[to] || 1);
          
        return convertedPrice.toFixed(2);
      } catch (error) {
        console.error("Error converting price:", error);
        return price; // Return original price on error
      }
    };

    // Get currency symbol for display
    const getCurrencySymbol = (currencyCode) => {
      const currency = currencies.find(c => c.code === currencyCode);
      return currency ? currency.symbol : currencyCode;
    };

    // Combine all product images when product data is loaded
    useEffect(() => {
        if (product) {
            let imagesList = [];
            
            // Add main image if it exists
            if (product.image && product.image.filePath) {
                imagesList.push(product.image);
            }
            
            // Add additional images if they exist
            if (product.images && product.images.length > 0) {
                // Filter out duplicates (in case main image is also in images array)
                const additionalImages = product.images.filter(img => 
                    !product.image || img.public_id !== product.image.public_id
                );
                imagesList = [...imagesList, ...additionalImages];
            }
            
            setAllImages(imagesList);
            setCurrentImageIndex(0); // Reset to first image
        }
    }, [product]);

    // Calculate time left for auction
    useEffect(() => {
        if (product && product.endDate) {
            const calculateTimeLeft = () => {
                const startTime = new Date(product.startDate).getTime();
                const endTime = new Date(product.endDate).getTime();
                const now = new Date().getTime();
                
                // Determine auction status
                if (now < startTime) {
                    setAuctionStatus("upcoming");
                } else if (now > endTime) {
                    setAuctionStatus("ended");
                    
                    // If auction has ended and product is not sold out, mark it as unsold
                    if (product && !product.isSoldout && auctionStatus !== "ended") {
                        // You could dispatch an action here to update the product status in the database
                        // This is a frontend update only for now
                        toast.info("This auction has ended.");
                    }
                } else {
                    setAuctionStatus("active");
                }
                
                // Calculate remaining time until end
                const difference = endTime - now;
                
                if (difference > 0) {
                    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                    
                    setTimeLeft({days, hours, minutes, seconds});
                } else {
                    setTimeLeft({days: 0, hours: 0, minutes: 0, seconds: 0});
                }
            };
            
            calculateTimeLeft();
            const timer = setInterval(calculateTimeLeft, 1000);
            
            return () => clearInterval(timer);
        }
    }, [product, auctionStatus]);
    
  const save = async(e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    // Ensure auction has started and not ended
    const currentTime = new Date();
    if (currentTime < new Date(product?.startDate)) {
      toast.error("Auction has not started yet");
      return;
    }
    
    if (currentTime > new Date(product?.endDate)) {
      toast.error("Auction has ended");
      return;
    }

    // Get the bid amount
    const bidAmount = parseFloat(rate);
    
    // Ensure bid amount is valid
    if (isNaN(bidAmount) || bidAmount <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }
    
    // Ensure bid meets minimum requirements
    const productPrice = parseFloat(product?.price);
    if (bidAmount < productPrice) {
      toast.error(`Bid must be at least ${product?.currency} ${productPrice}`);
      return;
    }
    
    // Ensure user has sufficient balance
    const userBalance = parseFloat(user.balance);
    if (bidAmount > userBalance) {
      toast.error("Insufficient balance to place bid");
      return;
    }
    
    // Convert bid amount to product's original currency if viewing in different currency
    let convertedBidAmount = bidAmount;
    if (selectedCurrency !== (product?.currency || "USD")) {
      convertedBidAmount = convertPrice(bidAmount, selectedCurrency, product?.currency || "USD");
      console.log(`Converting bid from ${selectedCurrency} to ${product?.currency || "USD"}: ${bidAmount} → ${convertedBidAmount}`);
    }
    
    // Add currency information to the form data
    const formData = {
      productId: product?._id,
      price: convertedBidAmount,
      currency: product?.currency || "USD"
    };
    
    console.log("Submitting bid with data:", formData);

    try {
      const result = await dispatch(placebid(formData)).unwrap();
      
      // Check if there were previous bids
      if (history && history.length > 0) {
        // Get the previous highest bidder
        const previousHighestBid = Math.max(...history.map((bid) => bid.price));
        const previousHighestBidder = history.find(bid => bid.price === previousHighestBid);
        
        // If the previous highest bidder is not the current user, create a notification
        if (previousHighestBidder && previousHighestBidder.user._id !== user._id) {
          try {
            const notification = {
              recipient: previousHighestBidder.user._id,
              sender: user._id,
              title: "You've Been Outbid",
              product: product._id,
              type: "OUTBID",
              message: `Someone has placed a higher bid of ${product?.currency || "USD"} ${convertedBidAmount} on ${product.title}`,
              link: `/details/${product._id}`
            };
            
            await notificationService.createNotification(notification);
          } catch (error) {
            console.error("Error creating notification:", error);
          }
        }
      }

      // Refresh the data
      dispatch(fetchbiddingHistory(product._id));
      dispatch(getProduct(product._id));
      dispatch(getAllProduct());
      
      // Reset the bid input
      setRate(convertedBidAmount);
      
    } catch (error) {
      console.error("Error placing bid:", error);
      // Error message is already handled in the slice
    }
  };

  const handleBuyNow = async() => {
    // Check auction status
    if (auctionStatus === "upcoming") {
      return toast.error("This auction has not started yet.");
    }
    
    if (auctionStatus === "ended") {
      return toast.error("This auction has ended.");
    }
    
    if (!product.buyNowPrice) {
      return toast.error("This item does not have a buy now price");
    }
    
    // Check if user has sufficient balance for Buy Now
    if(user.balance < product.buyNowPrice){
      return toast.error("Insufficient balance for Buy Now. Please add funds to your account.");
    }
    
    // Convert Buy Now price to product's original currency if viewing in different currency
    let buyNowAmount = product.buyNowPrice;
    if (selectedCurrency !== (product.currency || "USD")) {
      // We don't need to convert here as we're using the original product buyNowPrice
      console.log(`Using original Buy Now price in ${product.currency || "USD"}: ${buyNowAmount}`);
    }
    
    const formData = {
      price: parseFloat(buyNowAmount),
      productId: product._id,
      currency: product.currency || "USD"
    };
    
    // Debug log
    console.log("Submitting Buy Now:", formData);

    try {
      await dispatch(placebid(formData)).unwrap();
      toast.success("Item purchased successfully at buy now price!");
      dispatch(getProduct(product._id));
      dispatch(getAllProduct());
    } catch (error) {
      return toast.error("An error occurred while purchasing the item");
    }
  };

  if(isLoading) return <Loader />;
  
  const incrementBid = () => {
    const minIncrement = product?.biddingIncrement || 1;
    setRate(prevRate => Number(prevRate) + Number(minIncrement));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Navigate to the previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  // Navigate to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if(!product) return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-3xl text-gray-700">Product not found!</h2>
    </div>
  );

  return (
    <>
      <section className="pt-24 px-8">
        <Container>
          <div className="flex justify-between gap-8">
            <div className="w-1/2">
              <div className="h-[70vh] relative group">
                <img 
                  src={allImages[currentImageIndex]?.filePath || "https://via.placeholder.com/600x400?text=No+Image+Available"} 
                  alt={product?.title || "Product image"} 
                  className="w-full h-full object-cover rounded-xl" 
                />
                
                {allImages.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdKeyboardArrowLeft size={30} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdKeyboardArrowRight size={30} />
                    </button>
                  </>
                )}
                
                {allImages.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {allImages.map((image, index) => (
                      <button 
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? 'bg-green' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/2">
              <Title level={2} className="capitalize">
                {product?.title}
              </Title>
              <div className="flex gap-5">
                <div className="flex text-green ">
                  <IoIosStar size={20} />
                  <IoIosStar size={20} />
                  <IoIosStar size={20} />
                  <IoIosStarHalf size={20} />
                  <IoIosStarOutline size={20} />
                </div>
                <Caption>(2 customer reviews)</Caption>
              </div>
              <br />
              <Body>{product?.description}</Body>
              <br />
              <Caption>Item condition: {product?.condition || 'New'}</Caption>
              <br />
              <Caption>Item Verified: {product?.isverify ? "Yes" : "No"}</Caption>
              <br />
              
              {/* Currency selector */}
              <div className="flex items-center gap-3 mb-3">
                <Caption>Select Currency:</Caption>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="px-2 py-1 border rounded-md"
                  disabled={isLoadingRates}
                >
                  {isLoadingRates ? (
                    <option value="">Loading...</option>
                  ) : (
                    currencies.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} - {curr.symbol}
                      </option>
                    ))
                  )}
                </select>
                <Caption className="text-gray-500 text-xs italic">
                  {product?.currency && selectedCurrency !== product.currency 
                    ? `Original currency: ${product.currency}`
                    : ''}
                </Caption>
              </div>
              
              
              <Caption>Your Balance: <span className="font-bold text-green">${user?.balance || 0}</span></Caption>
              <br />
              <div className="mb-2">
                <Caption className="font-semibold">
                  Auction Status: 
                  {auctionStatus === "upcoming" && <span className="text-yellow-500 ml-2">Upcoming</span>}
                  {auctionStatus === "active" && <span className="text-green ml-2">Active</span>}
                  {auctionStatus === "ended" && <span className="text-red-500 ml-2">Ended</span>}
                </Caption>
              </div>
              <br />
              <Caption>Time left:</Caption>
              <br />
              <div className="flex gap-8 text-center">
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>{timeLeft.days}</Title>
                  <Caption>Days</Caption>
                </div>
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>{timeLeft.hours}</Title>
                  <Caption>Hours</Caption>
                </div>
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>{timeLeft.minutes}</Title>
                  <Caption>Minutes</Caption>
                </div>
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>{timeLeft.seconds}</Title>
                  <Caption>Seconds</Caption>
                </div>
              </div>
              <br />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Title className="flex items-center gap-2">
                    Auction starts:
                    <Caption> {formatDate(product?.startDate)}</Caption>
                  </Title>
                </div>
                <div>
                  <Title className="flex items-center gap-2">
                    Auction ends:
                    <Caption> {formatDate(product?.endDate)}</Caption>
                  </Title>
                </div>
              </div>
              <br />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Title className="flex items-center gap-2">
                    Starting price:
                    <Caption>${product?.price}</Caption>
                  </Title>
                </div>
                {product?.buyNowPrice && (
                  <div>
                    <Title className="flex items-center gap-2">
                      Buy Now price:
                      <Caption>${product?.buyNowPrice}</Caption>
                    </Title>
                  </div>
                )}
              </div>
              <br />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Title className="flex items-center gap-2">
                    Current bid:
                    <Caption className="text-3xl">${rate}</Caption>
                  </Title>
                </div>
                <div>
                  <Title className="flex items-center gap-2">
                    Min increment:
                    <Caption>${product?.biddingIncrement || 1}</Caption>
                  </Title>
                </div>
              </div>
              <br />
              <div className="p-5 px-10 shadow-s3 py-8">
                <form onSubmit={save} className="flex gap-3 justify-between">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {getCurrencySymbol(product?.currency || "USD")}
                    </span>
                  <input 
                      className={`${commonClassNameOfInput} pl-8`} 
                  type="number" 
                  name="price" 
                  value={rate} 
                  onChange={(e) => setRate(e.target.value)} 
                      min={product?.price} 
                      step={product?.biddingIncrement || 1} />
                    <Caption className="text-xs text-gray-500 mt-1">
                      {product?.currency !== selectedCurrency && (
                        <>Bid in {product?.currency} - converted from {selectedCurrency}</>
                      )}
                    </Caption>
                  </div>
                  <button type="button" onClick={incrementBid} className="bg-gray-100 rounded-md px-5 py-3">
                    <AiOutlinePlus />
                  </button>
                  <button 
                    type="submit" 
                    className={`py-3 px-8 rounded-lg ${
                      product?.isSoldout || !product?.isverify || auctionStatus !== "active"
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                        : "bg-green text-white"
                    }`}
                    disabled={product?.isSoldout || !product?.isverify || auctionStatus !== "active" || user?.balance < rate}
                  >              
                    Place Bid
                  </button>
                </form>
                {user?.balance < rate && (
                  <p className="text-red-500 text-sm mt-2">
                    Insufficient balance to place this bid. Please add funds to your account.
                  </p>
                )}
                {product?.buyNowPrice && !product?.isSoldout && product?.isverify && auctionStatus === "active" && (
                  <button 
                    onClick={handleBuyNow} 
                    className={`w-full mt-4 py-3 px-8 rounded-lg ${
                      user?.balance < product?.buyNowPrice
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={user?.balance < product?.buyNowPrice}
                  >
                    {/* Buy Now for ${product.buyNowPrice} */}
                    Buy Now for {getCurrencySymbol(selectedCurrency)}
                    {convertPrice(product?.buyNowPrice, product?.currency || "USD", selectedCurrency)}
                  </button>
                )}
                {user?.balance < product?.buyNowPrice && product?.buyNowPrice && (
                  <p className="text-red-500 text-sm mt-2">
                    Insufficient balance for Buy Now. Please add funds to your account.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="details mt-8">
            <div className="flex items-center gap-5">
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "description" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("description")}>
                Description
              </button>
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "auctionHistory" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("auctionHistory")}>
                Auction History
              </button>
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "reviews" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("reviews")}>
                Reviews(2)
              </button>
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "moreProducts" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("moreProducts")}>
                More Products
              </button>
            </div>

            <div className="tab-content mt-8">
              {activeTab === "description" && (
                <div className="description-tab shadow-s3 p-8 rounded-md">
                  <Title level={4}>Description</Title>
                  <br />
                  <Caption className="leading-7">
                  {product?.description}
                  </Caption>
                  <br />
                  <Title level={4}>Product Overview</Title>
                  <div className="flex justify-between gap-5">
                    <div className="mt-4 capitalize w-1/2">
                      <div className="flex justify-between border-b py-3">
                        <Title>category</Title>
                        <Caption>{product?.category}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>condition</Title>
                        <Caption>{product?.condition || 'New'}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>auction starts</Title>
                        <Caption>{formatDate(product?.startDate)}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>auction ends</Title>
                        <Caption>{formatDate(product?.endDate)}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>starting price</Title>
                        <Caption>${product?.price}</Caption>
                      </div>
                      {product?.buyNowPrice && (
                        <div className="flex justify-between border-b py-3">
                          <Title>buy now price</Title>
                          <Caption>${product?.buyNowPrice}</Caption>
                        </div>
                      )}
                      {product?.reservePrice && (
                        <div className="flex justify-between border-b py-3">
                          <Title>reserve price</Title>
                          <Caption>${product?.reservePrice}</Caption>
                        </div>
                      )}
                      <div className="flex justify-between border-b py-3">
                        <Title>bidding increment</Title>
                        <Caption>${product?.biddingIncrement || 1}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>height</Title>
                        <Caption>{product?.height} (cm)</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>length</Title>
                        <Caption>{product?.lengthpic} (cm)</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>width</Title>
                        <Caption>{product?.width} (cm)</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>weight</Title>
                        <Caption>{product?.weigth} (kg)</Caption>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Material used</Title>
                        <Caption>{product?.mediumused} </Caption>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Sold out</Title>
                        {product?.isSoldout ? (
                          <Caption className="text-red-500 font-bold">Sold Out</Caption>
                        ) : (
                          <Caption className="text-green font-bold">On Stock</Caption>
                        )}
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Verify</Title>
                        {product?.isverify ? (
                          <Caption className="text-green font-bold">Yes</Caption>
                        ) : (
                          <Caption className="text-red-500 font-bold">No</Caption>
                        )}
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Create At</Title>
                        <Caption>
                          <DateFormatter date={product?.createdAt} />
                        </Caption>
                      </div>
                      <div className="flex justify-between py-3">
                        <Title>Update At</Title>
                        <Caption>
                          <DateFormatter date={product?.updatedAt} />
                        </Caption>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="h-[60vh] p-2 bg-green rounded-xl">
                        <img src={allImages[currentImageIndex]?.filePath || "https://via.placeholder.com/600x400?text=No+Image+Available"} alt={product?.title || "Product image"} className="w-full h-full object-cover rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "auctionHistory" && <AuctionHistory history={history}/>}
              {activeTab === "reviews" && (
                <div className="reviews-tab shadow-s3 p-8 rounded-md">
                  <Title level={5} className=" font-normal">
                    Reviews
                  </Title>
                  <hr className="my-5" />
                  <Title level={5} className=" font-normal text-red-500">
                    Cooming Soon!
                  </Title>
                </div>
              )}
              {activeTab === "moreProducts" && (
                <div className="more-products-tab shadow-s3 p-8 rounded-md">
                  <h1>More Products</h1>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export const AuctionHistory = ({ history }) => {
  return (
    <>
      <div className="shadow-s1 p-8 rounded-lg">
        <Title level={5} className=" font-normal">
          Auction History
        </Title>
        <hr className="my-5" />
        {history?.length === 0 ? (
          <h2 className="m-2" >No Bidding Record Found!</h2>
        ) : (

        <div className="relative overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Bid Amount(USD)
                </th>
                <th scope="col" className="px-6 py-3">
                  User
                </th>
                <th scope="col" className="px-6 py-3">
                  Auto
                </th>
              </tr>
            </thead>
            <tbody>
            {history.map((item,index) => (
              <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                <td className="px-6 py-4">
                  <DateFormatter date={item?.createdAt}/>
                </td>
                <td className="px-6 py-4">${item?.price}</td>
                <td className="px-6 py-4">{item?.user?.name}</td>
                <td className="px-6 py-4"> </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </>
  );
};
