import { Container, Heading } from "../../router";
import { ProductCard } from "../cards/ProductCard";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export const ProductList = ({ products, isHomePage = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const productsPerPage = 9;

  // Process products based on verification, auction timing, and sold status
  useEffect(() => {
    // Ensure products is always an array
    if (!Array.isArray(products)) {
      setFilteredProducts({ onStock: [], soldOut: [] });
      return;
    }

    const currentTime = new Date();
    
    // Filter verified products and check auction timing
    const verifiedProducts = products.filter(item => item?.isverify);
    
    // Separate active auctions and sold out/ended auctions
    const onStock = verifiedProducts.filter(product => {
      // Skip if product is sold out
      if (product.isSoldout) return false;
      
      // Check auction timing
      const startTime = new Date(product.startDate);
      const endTime = new Date(product.endDate);
      
      // Only include products where the auction is active:
      // 1. Auction has started (current time is after start time)
      // 2. Auction hasn't ended yet (current time is before end time)
      return currentTime >= startTime && currentTime <= endTime;
    });
    
    // Get sold out or ended auctions
    const soldOut = verifiedProducts.filter(product => {
      // Include explicitly sold out products
      if (product.isSoldout) return true;
      
      // Include products with ended auctions
      const endTime = new Date(product.endDate);
      return currentTime > endTime;
    });
    
    setFilteredProducts({ onStock, soldOut });
  }, [products]);

  // If on home page, only show first 3 on stock products
  const displayOnStockProducts = isHomePage 
    ? filteredProducts.onStock?.slice(0, 3) || []
    : filteredProducts.onStock || [];

  const displaySoldOutProducts = isHomePage 
    ? [] // Don't show sold out products on home page
    : filteredProducts.soldOut || [];

  // Pagination logic
  const totalPages = Math.ceil((displayOnStockProducts.length + displaySoldOutProducts.length) / productsPerPage);
  
  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  // Get products for current page
  const currentOnStockProducts = displayOnStockProducts.slice(
    startIndex,
    Math.min(endIndex, displayOnStockProducts.length)
  );

  const remainingSlots = productsPerPage - currentOnStockProducts.length;
  const currentSoldOutProducts = remainingSlots > 0
    ? displaySoldOutProducts.slice(
        Math.max(0, startIndex - displayOnStockProducts.length),
        Math.max(0, startIndex - displayOnStockProducts.length) + remainingSlots
      )
    : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the product section
    document.querySelector('.product-home')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="product-home">
        <Container>
          {isHomePage && (
          <Heading
            title="Live Auction"
            subtitle="Explore on the world's best & largest Bidding marketplace with our beautiful Bidding products. We want to be a part of your smile, success and future growth."
          />
          )}

          {/* On Stock Products Section */}
          {currentOnStockProducts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Available for Bidding
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {currentOnStockProducts.map((item, index) => (
                  <ProductCard item={item} key={`stock-${index}`} />
                ))}
              </div>
            </div>
          )}

          {/* Sold Out Products Section */}
          {!isHomePage && currentSoldOutProducts.length > 0 && (
            
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Sold Out/Ended Auctions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {currentSoldOutProducts.map((item, index) => (
                  <ProductCard item={item} key={`sold-${index}`} />
                ))}
              </div>
            </div>
          )}

          {/* Show message if no products */}
          {currentOnStockProducts.length === 0 && currentSoldOutProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {Array.isArray(products) && products.length > 0 
                  ? "No active auctions available at this time." 
                  : "No verified products available."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {!isHomePage && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green text-white hover:bg-opacity-90'
                }`}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === index + 1
                      ? 'bg-green text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green text-white hover:bg-opacity-90'
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* View All button on homepage */}
          {isHomePage && filteredProducts.onStock?.length > 3 && (
            <div className="flex justify-center mt-8">
              <NavLink 
                to="/auctions"
                className="bg-green text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
              >
                View All Auctions
              </NavLink>
          </div>
          )}
        </Container>
      </section>
    </>
  );
};
