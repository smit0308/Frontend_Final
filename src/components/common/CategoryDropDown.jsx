import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { getAllCategory } from "../../redux/features/categorySlice";
import { Loader } from "./Loader";

export const CategoryDropDown = (props) => {

    const dispatch = useDispatch(); 
    const {categorys, loading} = useSelector(state => state.category);
  
    useEffect(() => {
      dispatch(getAllCategory())
    }, [dispatch]);

    const allCategory = categorys?.map((category) => {
      return {
        label: category?.title,
        value: category?._id,
      }
    })

    const handleChange = selectedOption => {
      props.onChange(selectedOption);
    }
  return <>{ loading ? <Loader /> : <Select id="category" onChange={handleChange} options={allCategory} value={props.value} />}</>;
};
