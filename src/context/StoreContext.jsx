import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [clientId, setClientId] = useState(null);

    const login = (id) => {
        setClientId(id);
    };

    useEffect(() => {
        console.log("Client ID:", clientId); // Check the value here
    }, [clientId]);












    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
    }
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }
    const getTotalCart = () => {
        let totalCart = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let findItemInfo = food_list.find((product) => product._id === item);
                totalCart += findItemInfo.price * cartItems[item]

            }

        }
        return totalCart;
    }


    useEffect(() => {
        console.log(cartItems);
    }, [cartItems])


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCart, 
        login, 
        clientId,
      
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;
