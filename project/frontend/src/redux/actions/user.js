import axios from "axios";


// load user
export const loadUser = () => async (dispatch) => {
    try {
      dispatch({
        type: "LoadUserRequest",
      });
      const { data } = await axios.get("http://localhost:8000/api/v2/user/getuser", {
        withCredentials: true,
      });
      dispatch({
        type: "LoadUserSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "LoadUserFail",
        payload: error.response.data.message,
      });
    }
  };



  // load Seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get("http://localhost:8000/api/v2/shop/getSeller", {
      withCredentials: true,
    });
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response.data.message,
    });
  }
};