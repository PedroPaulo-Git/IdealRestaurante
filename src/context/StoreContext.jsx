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
          if (clientId) {
            setCartItems({});
        }
    }, [clientId]);


    const addToCart = async  (itemId) => {
   

        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }

        const newQuantity = cartItems[itemId] ? cartItems[itemId] + 1 : 1;
      
        if (clientId) {
            try {
                const response = await fetch(`http://localhost:3000/api/carrinho/${clientId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        clientId: clientId,
                        productId: itemId,
                        quantity: newQuantity,// You might want to adjust this to reflect the current quantity
                    }),
                });
    
                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error('Error adding to cart:', errorMessage);
                    console.log({
                        clientId: clientId,
                        productId: itemId,
                        quantity: newQuantity,
                    });  
                } else {
                    const result = await response.json();
                    console.log('Item added to cart:', result);
                    setCartItems((prev) => ({ ...prev, [itemId]: newQuantity }));
                }
            } catch (error) {
                console.error('Error adding to cart ERROR SERVER:', error);
            }
        } else {
            console.error('Client ID is not defined');
        }


    }

////////////////////////////////////


    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }


///////////////////////////////////////


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
