import React, { useEffect } from "react";
import { Title } from "../../router";
import { CiMedal } from "react-icons/ci";
import { GiBarbedStar } from "react-icons/gi";
import { BsCashCoin } from "react-icons/bs";
import { MdDashboard, MdOutlineCategory } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { HiOutlineUsers } from "react-icons/hi2";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { UseUserProfile } from "../../hooks/useuserProfile";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser, getUserIncome, getuserProfile } from "../../redux/features/authSlice";
import { getAllProduct, getAllProductofUser, getAllWonedProductofUser } from "../../redux/features/productSlice";

export const Dashboard = () => {
  useRedirectLoggedOutUser("/login");
  const {role} = UseUserProfile();
  const {income, users} = useSelector((state) => state.auth);
  const {products, userproducts, wonedproducts } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getuserProfile());
    dispatch(getUserIncome());
    dispatch(getAllProduct());
    dispatch(getAllProductofUser());
    dispatch(getAllWonedProductofUser());
    dispatch(getAllUser());
  }, [dispatch]);


  console.log(income);
  console.log("Won products data:", wonedproducts );

  return (
    <>
      <section>
        <div className="shadow-s1 p-8 rounded-lg mb-12">
          <Title level={5} className="font-normal">
            My Activity
          </Title>
          <hr className="my-5" />
          
          {/* Balance display for buyers only */}
          {role === "buyer" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="shadow-s3 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
                <BsCashCoin size={80} className="text-green" />
                <div>
                  <Title level={1}>{income?.balance || 0}</Title>
                  <Title>Account Balance</Title>
                </div>
              </div>
              <div className="shadow-s3 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
                <CiMedal size={80} className="text-green" />
                <div>
                  <Title level={1}>{wonedproducts?.length}</Title>
                  <Title>Items Won</Title>
                </div>
              </div>
            </div>
          )}
          
          {/* {role === "buyer" && <h1 className="text-xl text-center font-semibold py-8 text-[#091c2e]">Please become a seller.</h1>} */}
          {(role === "seller" || role === "admin") && (
                <div className="grid grid-cols-3 gap-8 mt-8">
            <div className="shadow-s3 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
              <BsCashCoin size={80} className="text-green" />
              <div>
                <Title level={1}>{income?.balance} </Title>
                <Title>Balance</Title>
              </div>
            </div>
            <div className="shadow-s3 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
              <CiMedal size={80} className="text-green" />
              <div>
                <Title level={1}>{wonedproducts?.length}</Title>
                <Title>Items Won</Title>
              </div>
            </div>
            <div className="shadow-s3 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
              <GiBarbedStar size={80} className="text-green" />
              <div>
                <Title level={1}>{userproducts?.length}</Title>
                <Title>Your Products </Title>
              </div>
            </div>
            
            { role === "admin" && (
              <>
                <div className="shadow-s3 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
                  <MdOutlineCategory size={80} className="text-green" />
                  <div>
                    <Title level={1}>{products?.length}</Title>
                    <Title>All Products </Title>
                  </div>
                </div>
                <div className="shadow-s3 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
                  <HiOutlineUsers size={80} className="text-green" />
                  <div>
                    <Title level={1}>{users?.length}</Title>
                    <Title>All Users </Title>
                  </div>
                </div>
              </>
              )}
                </div>
              )}
        </div>
      </section>
    </>
  );
};

export const UserProduct = () => {
  return (
    <>
      <div className="shadow-s1 p-8 rounded-lg">
        <Title level={5} className=" font-normal">
          Purchasing
        </Title>
        <hr className="my-5" />
        <div className="relative overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Bidding ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Bid Amount(USD)
                </th>
                <th scope="col" className="px-6 py-3">
                  Image
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">Auction Title 01</td>
                <td className="px-6 py-4">Bidding_HvO253gT</td>
                <td className="px-6 py-4">1222.8955</td>
                <td className="px-6 py-4">
                  <img className="w-10 h-10" src="https://bidout-react.vercel.app/images/bg/order1.png" alt="Jeseimage" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green me-2"></div> Success
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <NavLink to="#" type="button" className="font-medium text-green">
                    <MdDashboard size={25} />
                  </NavLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
