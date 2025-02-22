import axios from "axios";



export const createProduct = (newForm) => async (dispatch) => {
    try {
        dispatch({
            type: "productCreateRequest",
        });

        const config = {headers: {"Content-Type": "multipart/form-data"}};
        const { data } = await axios.post(
            "http://localhost:8000/api/v2/product/create-product",
            newForm,
            config
          );
        
          dispatch({
            type: "productCreateSuccess",
            payload: data.product,
          });

    } catch (error) {
        dispatch({
            type: "productCreateFail",
            payload: error.response.data.message,
          });
    }
};



// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const { data } = await axios.get(
      `http://localhost:8000/api/v2/product/get-all-products-shop/${id}`
    );
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response.data.message,
    });
  }
};



// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
    });

    const { data } = await axios.delete(
      `http://localhost:8000/api/v2/product/delete-shop-product/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response.data.message,
    });
  }
};
