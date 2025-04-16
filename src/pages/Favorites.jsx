import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Loader } from "../router";
import { ProductList } from "../components/hero/ProductList";
import { getAllProduct } from "../redux/features/productSlice";
import { selectFavorites } from "../redux/features/favoriteSlice";
import { toast } from "react-toastify";
import { useRedirectLoggedOutUser } from "../hooks/useRedirectLoggedOutUser";
import { Header } from "../components/common/Header";

export const Favorites = () => {
  useRedirectLoggedOutUser("/login");
  
  const dispatch = useDispatch();
  const { products, isLoading, isError, message } = useSelector((state) => state.product);
  const favoriteIds = useSelector(selectFavorites);

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  // Filter products to show only favorites
  const favoriteProducts = products?.filter(product => favoriteIds.includes(product._id)) || [];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <section className="favorites-page py-16">
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
        <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
          <Container>
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">My Favorite Auctions</h1>
              <div className="flex items-center gap-3">
                <h5 className="text-green font-normal text-xl">Home</h5>
                <h5 className="text-white font-normal text-xl">/</h5>
                <h5 className="text-white font-normal text-xl">Favorites</h5>
              </div>
            </div>
          </Container>
        </div>

        <Container>
          <div className="mt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Favorite Auctions</h2>
              <p className="text-gray-600">Your collection of favorite auction items</p>
            </div>

            {favoriteProducts.length > 0 ? (
              <>
                <ProductList products={favoriteProducts} />
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg mb-4">No favorite items yet.</p>
                <p className="text-gray-400">Start adding items to your favorites by clicking the heart icon on products!</p>
              </div>
            )}
          </div>
        </Container>
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
      </section>
    </>
  );
}; 