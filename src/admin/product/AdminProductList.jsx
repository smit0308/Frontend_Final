import { Loader, Title } from "../../router";
import { Table } from "../../components/Table";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllProduct } from "../../redux/features/productSlice";

export const AdminProductList = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  
  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  // Calculate pagination values
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products?.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil((products?.length || 0) / productsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if(isLoading){
    return <Loader/>;
  }

  if(products?.length === 0 ){
    return (
      <div className="flex justify-center items-center h-auto w-auto">
         <h2 className="text-3xl text-gray-700" >No Products Found!</h2>
      </div>
    )
  }

  return (
    <>
      <section className="shadow-s1 p-8 rounded-lg">
        <div className="flex justify-between">
          <Title level={5} className="font-normal">
            Product Lists
          </Title>
        </div>
        <hr className="my-5" />
        <Table products={currentProducts} isAdmin={true}/>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green text-white hover:bg-opacity-90"
              }`}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? "bg-green text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green text-white hover:bg-opacity-90"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </>
  );
};
