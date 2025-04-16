import React, { useEffect, useState } from "react";
import { Title } from "../../router";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { getAllWonedProductofUser } from "../../redux/features/productSlice";
import { Table } from "../../components/Table";

export const WinningBidList = () => {

  useRedirectLoggedOutUser("/"); 
  
    const dispatch = useDispatch();
    const { wonedproducts } = useSelector((state) => state.product);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
  
    useEffect(() => {
      dispatch(getAllWonedProductofUser());
    }, [dispatch]);

    // Calculate pagination values
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = wonedproducts?.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil((wonedproducts?.length || 0) / productsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

  return (
    <>
      <section className="shadow-s1 p-8 rounded-lg">
        <div className="flex justify-between">
          <Title level={5} className=" font-normal">
            Winning Product Lists
          </Title>
        </div>
        <br />

      {wonedproducts && wonedproducts.length > 0  ? (
        <>
          <Table products={currentProducts} isWon={true}/>
          
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
        </>
      ) : 
        <div className="text-center py-5">
          <p className="text-gray-500">No products found. Start by creating a new product!</p>
        </div>
       }
      </section>
    </>
  );
};
