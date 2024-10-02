import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";


export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    //const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

    const [cartItems, setCartItems] = useState({});
    const [clientId, setClientId] = useState(null);
    const [clientName, setClientname] = useState(null);
    //stripe const >

    const logout = () => {
        setClientId(null);
        setClientname(null);
        localStorage.removeItem("clientId");
        localStorage.removeItem("clientName");
        setCartItems({}); // Optional: Clear cart items on logout
    };

    useEffect(() => {
        
        const storedClientId = localStorage.getItem("clientId");
        const storedUsername = localStorage.getItem("clientName");
        //console.log('Stored Client ID:', storedClientId, 'Stored Username:', storedUsername); // Add this for debugging

        if (storedClientId) {
            setClientId(storedClientId);
        }else {
            console.error("Invalid storedClientId:", storedClientId);
        }

        if (storedUsername) {
            setClientname(storedUsername);
        } else {
            console.error("Invalid storedUsername:", storedUsername);
        }
          if (storedClientId && storedUsername) {
        login(storedClientId, storedUsername);
    }

    }, []);


    useEffect(() => {
       // console.log('Username :', clientName)
       // console.log("Client ID:", clientId); 
        if (clientId && clientId) {
            fetchCartItems(clientId)
        } else {
            setCartItems({});
        }
    }, [clientId]);


    const login = (id, username) => {
        setClientId(id);
        setClientname(username);
        //console.log('Login function - ID:', id, 'Username:', username); 
        localStorage.setItem("clientId", id);
        localStorage.setItem("clientName", username);
        //console.log('Stored in localStorage - Client ID:', localStorage.getItem('clientId'), 'Username:', localStorage.getItem('clientName'));
        console.log("Storing to localStorage:", { id, username });

        // if (process.env.REACT_APP_STRIPE_PUBLISH_KEY === String) {
        //     console.log(process.env.REACT_APP_STRIPE_PUBLISH_KEY);
        // }
        // else{
        //     console.log('isnt string' + process.env.REACT_APP_A)
        // }
    };



    const fetchCartItems = async (clientId) => {
        if (clientId) {
            try {
                const response = await fetch(`http://localhost:3000/api/carrinho/${clientId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }
                const data = await response.json();
                const newCartItems = {};
                data.items.forEach(item => {
                    newCartItems[item.productId] = item.quantity; // Adjust based on your API response
                });
                setCartItems(newCartItems);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        }
    };

    const addToCart = async (itemId) => {

        if (clientId) {
            try {
                // Fetch the updated quantity directly from prev
                const updatedCartItems = await new Promise((resolve) => {
                    setCartItems((prev) => {
                        const newQuantity = (prev[itemId] || 0) + 1; // Increment by 1
                        resolve(newQuantity);
                        return { ...prev, [itemId]: newQuantity };
                    });
                });

                const response = await fetch(`http://localhost:3000/api/carrinho/${clientId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        clientId: clientId,
                        productId: itemId,
                        quantity: updatedCartItems, // Use the updated quantity
                    }),
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error('Error adding to cart:', errorMessage);
                } else {
                    const result = await response.json();
                    const addedItems = result.items; // Array of cart items
                    console.log(addedItems)
                    if (addedItems.length > 0) {
                        const lastAddedItem = addedItems[addedItems.length - 2]; // The last item in the array
                        console.log('Last item added:', {
                            productId: lastAddedItem.productId,
                            quantity: lastAddedItem.quantity,
                        });
                    }

                }
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        } else {
            console.error('Client ID is not defined');
        }
    };

    const ReduceItem = async (itemId) => {

        const currentQuantity = cartItems[itemId] || 0;

        const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 0;

        if (currentQuantity === 0) {
            console.error('item not in cart')
            return;
        }
        console.log(currentQuantity)
        console.log(newQuantity)
        if (clientId) {
            try {
                const response = await fetch(`http://localhost:3000/api/carrinho/${clientId}/${itemId}`, {
                    method: 'DELETE',
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
                    console.error('Error Deleting to cart:', errorMessage);
                    console.log({
                        clientId: clientId,
                        productId: itemId,
                        quantity: newQuantity,
                    });

                } else {
                    const result = await response.json();
                    console.log('ITEM ID :', itemId)
                    const deletedItem = result.items.find(item => item.quantity === 0 || item.productId === itemId);

                    if (deletedItem) {
                        console.log(`One this Product ID ${deletedItem.productId} was deleted from the cart.`);
                    } else {
                        console.log(`Product ID ${itemId} was deleted.`);
                    }
                    setCartItems((prev) => ({ ...prev, [itemId]: newQuantity }));

                }
            } catch (error) {
                console.error('Error deleting to cart ERROR SERVER:', error);
            }
        } else {
            console.error('Client ID is not defined');
        }

    }
    ////////////////////////////////////


    const removeFromCart = async (itemId) => {

        const currentQuantity = cartItems[itemId] || 0;

        const newQuantity = currentQuantity > 1 ? currentQuantity - currentQuantity : 0;

        if (currentQuantity === 0) {
            console.error('item not in cart')
            return;
        }
        console.log(currentQuantity)
        console.log(newQuantity)
        if (clientId) {
            try {
                const response = await fetch(`http://localhost:3000/api/carrinho/${clientId}/${itemId}`, {
                    method: 'DELETE',
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
                    console.error('Error Deleting to cart:', errorMessage);
                    console.log({
                        clientId: clientId,
                        productId: itemId,
                        quantity: newQuantity,
                    });

                } else {
                    const result = await response.json();
                    console.log('ITEM ID :', itemId)
                    const deletedItem = result.items.find(item => item.quantity === 0 || item.productId === itemId);

                    if (deletedItem) {
                        console.log(`One this Product ID ${deletedItem.productId} was deleted from the cart.`);
                    } else {
                        console.log(`Product ID ${itemId} was deleted.`);
                    }
                    setCartItems((prev) => ({ ...prev, [itemId]: newQuantity }));

                }
            } catch (error) {
                console.error('Error deleting to cart ERROR SERVER:', error);
            }
        } else {
            console.error('Client ID is not defined');
        }

    }





    ///////////////////////////////////////


    const getTotalCart = () => {
        let totalCart = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let findItemInfo = food_list.find((product) => product._id === item);
                if (findItemInfo) {
                    totalCart += findItemInfo.price * cartItems[item];
                } else {
                    console.log(`Product not found for ID: ${item}`)
                }


            }

        }
        return totalCart;
    }


    // useEffect(() => {
    //     console.log(cartItems);
    // }, [cartItems])

    const contextValue = {
        food_list,
        cartItems,
        clientId,
        clientName,
        setCartItems,
        addToCart,
        removeFromCart,
        ReduceItem,
        getTotalCart,
        login,
        logout,
        fetchCartItems,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;
