import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Loader } from "../router";
import { ProductList } from "../components/hero/ProductList";
import { getAllProduct } from "../redux/features/productSlice";
import { getAllCategory } from "../redux/features/categorySlice";
import { toast } from "react-toastify";
import { BiSearch } from "react-icons/bi";

export const Auctions = () => {
  const dispatch = useDispatch();
  const { products, isLoading, isError, message } = useSelector((state) => state.product);
  const { categorys } = useSelector((state) => state.category);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(getAllProduct());
    dispatch(getAllCategory());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  // Filter and sort products whenever products, selectedCategory, sortOrder, or searchTerm changes
  useEffect(() => {
    if (!products) return;
    // let filtered = [...products];
    const currentTime = new Date();
    
    // First filter out products that haven't started yet or have ended
    let filtered = products.filter(product => {
      const startTime = new Date(product.startDate);
      const endTime = new Date(product.endDate);
      
      // Only include products where:
      // 1. Auction has started (current time is after start time)
      // 2. Auction hasn't ended yet (current time is before end time)
      // 3. Product is not sold out
      return currentTime >= startTime && 
             currentTime <= endTime && 
             !product.isSoldout;
    });

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      const category = categorys.find(cat => cat._id === selectedCategory);
      if (category) {
        filtered = filtered.filter(product => product.category === category.title);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case "ending":
          return new Date(a.endDate) - new Date(b.endDate);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortOrder, categorys, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The search is already handled by the useEffect above
    // This is just to prevent form submission
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="auctions-page py-16">
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
      <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
        <Container>
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Live Auctions</h1>
            <div className="flex items-center gap-3">
              <h5 className="text-green font-normal text-xl">Home</h5>
              <h5 className="text-white font-normal text-xl">/</h5>
              <h5 className="text-white font-normal text-xl">Auctions</h5>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="mt-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">All Active Auctions</h2>
            <p className="text-gray-600">Discover and bid on amazing products</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by product title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green pr-12"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-green"
                >
                  <BiSearch size={20} />
                </button>
              </div>
            </form>

            <select 
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categorys?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>

            <select 
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="ending">Ending Soon</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-xl text-gray-600">
                {searchTerm.trim() 
                  ? `No products found matching "${searchTerm}"` 
                  : "No active auctions found in this category"}
              </h3>
            </div>
          ) : (
            <ProductList products={filteredProducts} />
          )}
        </div>
      </Container>
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
    </section>
  );
}; 