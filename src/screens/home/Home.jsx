import { CategorySlider, Hero, Process, TopCollection, TopSeller, Trust } from "../../router";
import { ProductList } from "../../components/hero/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProduct } from "../../redux/features/productSlice";

export const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  
    useEffect(() => {
      dispatch(getAllProduct());
    }, [dispatch]);
  
  return (
    <>
      <Hero />
      <CategorySlider />
      <ProductList products={products} isHomePage={true} />
      <TopSeller />
      <Process />
      <Trust />
      <TopCollection />
    </>
  );
};
