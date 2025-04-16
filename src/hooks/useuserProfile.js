import { useDispatch, useSelector } from "react-redux"
import { getuserProfile, selectIsLoggedIn } from "../redux/features/authSlice";
import { useEffect, useState } from "react";


export const UseUserProfile = () => {
  const dispatch = useDispatch;
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const {user , isloading} = useSelector(state => state.auth);
  const [role, setRole] = useState(() => user?.role || JSON.parse(localStorage.getItem("user")));

useEffect(() => {
    if(isloading && !user){
        dispatch(getuserProfile())
    }else if(user){
        setRole(user.role);
    }
}, [dispatch, isloading, user]);

    useEffect(() => {
        if(user){
            setRole(user.role);
        }
    }, [user]);

    return {role, isLoggedIn, isloading};
}
