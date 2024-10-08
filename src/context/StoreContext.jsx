import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";


export const StoreContext = createContext(null)

const StoreContextProvider = ({ setShowLoginPopup, children }) => {
    const [cartItems, setCartItems] = useState({});
    const [clientId, setClientId] = useState(null);
    const [clientName, setClientName] = useState(null);
    const [clientEmail, setClientEmail] = useState(null);


    useEffect(() => {

        const storedClientId = localStorage.getItem("clientId");
        const storedUsername = localStorage.getItem("clientName");
        const storedEmail = localStorage.getItem("clientEmail");

        const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
        //console.log(storedCartItems)
        //console.log('Stored Client ID:', storedClientId, 'Stored Username:', storedUsername); // Add this for debugging
        setCartItems(storedCartItems);
        if (storedCartItems && Object.keys(storedCartItems).length > 0) {
            setCartItems(storedCartItems);
        } else {
            setCartItems({}); // Initialize to empty if no stored items
        }

        if (storedClientId) {
            setClientId(storedClientId);
        } else {
            console.error("Invalid storedClientId:", storedClientId);
        }

        if (storedUsername) {
            setClientName(storedUsername);
        } else {
            console.error("Invalid storedUsername:", storedUsername);
        }

        if (storedEmail) {
            setClientEmail(storedEmail);
        } else {
            console.error("Invalid storedEmail:", storedEmail);
        }
        if (storedClientId && storedUsername) {
            login(storedClientId, storedUsername, storedEmail);
        }

    }, []);

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
        if (storedCartItems) {
            setCartItems(storedCartItems);
        } else {
            setCartItems({});
        }
    }, []);

    useEffect(() => {
        // console.log('Username :', clientName)
        // console.log("Client ID:", clientId); 
        if (clientId) {
            fetchCartItems(clientId)
        } else {
            setCartItems({});
        }
    }, [clientId]);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);



    const login = (id, username, email) => {
        setClientId(id);
        setClientName(username);
        setClientEmail(email);
        //console.log('Login function - ID:', id, 'Username:', username); 
        localStorage.setItem("clientId", id);
        localStorage.setItem("clientName", username);
        localStorage.setItem("clientEmail", email);
    };


    const logout = () => {
        setClientId(null);
        setClientName(null);
        setClientEmail(null);
        localStorage.removeItem("clientId");
        localStorage.removeItem("clientName");
        localStorage.removeItem("clientEmail");
        localStorage.removeItem("cartItems");
        setCartItems({});
        window.location.reload(); 
    };

    const fetchCartItems = async (clientId) => {
        if (clientId) {
            try {
                const response = await fetch(`http://localhost:3000/api/cart/${clientId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }
                const data = await response.json();
                const newCartItems = {};
                if (data.items) {
                    data.items.forEach(item => {
                        newCartItems[item.productId] = item.quantity;
                    });
                }
                setCartItems(newCartItems);
                localStorage.setItem("cartItems", JSON.stringify(newCartItems));
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        }
    };

    const addToCart = async (itemId) => {

        if (clientId) {
            try {

                const updatedCartItems = await new Promise((resolve) => {
                    setCartItems((prev) => {
                        const newQuantity = (prev[itemId] || 0) + 1; // Increment by 1
                        resolve(newQuantity);
                        return { ...prev, [itemId]: newQuantity };
                    });

                });

                const response = await fetch(`http://localhost:3000/api/cart/${clientId}`, {
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
    
                    if (addedItems.length > 0) {
                        let lastAddedItem;
                        if (addedItems.length === 1) {
                            // If there's only one item, use the first item
                            lastAddedItem = addedItems[0];
                        } else {
                            // Otherwise, access the most recently added item
                            lastAddedItem = addedItems[addedItems.length - 1];
                        }
    
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
            setShowLoginPopup(true)

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
                const response = await fetch(`http://localhost:3000/api/cart/${clientId}/${itemId}`, {
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
                const response = await fetch(`http://localhost:3000/api/cart/${clientId}/${itemId}`, {
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
    const createOrder = async () => {
        
        const getProductDetailsById = (productId) => {
            const product = food_list.find(item => item._id === productId);
            return product ? { name: product.name, price: product.price } : { name: '', price: 0 }; // Return default values if product not found
        };
    
        if (!clientId) {
            console.error('Client ID is not defined');
            return;
        }
        const itemsArray = Object.entries(cartItems).map(([productId, quantity]) => {
            const { name, price } = getProductDetailsById(productId); // Get product details
            return {
                productId: Number(productId), // Ensure productId is a number
                quantity,
                price,
                name, // Include product name in the item object
            };
        });
        console.log('creating order... |',clientId, itemsArray)
        try {
            const response = await fetch(`http://localhost:3000/api/createorder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientId: Number(clientId), // Assuming you have this in your context or props
                    items: itemsArray, // Ensure this contains the items from the cart
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }
            console.log('Payload being sent:', {
                clientId: Number(clientId),
                items: itemsArray,
            });
            
            const orderData = await response.json();
            console.log('Order created successfully:', orderData);
        } catch (error) {
            console.error('Error create order:', error);
        }
        console.log('Payload being sent:', {
            clientId: Number(clientId),
            items: itemsArray,
        });
        
    };



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
        clientEmail,
        setCartItems,
        addToCart,
        removeFromCart,
        ReduceItem,
        getTotalCart,
        login,
        logout,
        fetchCartItems,
        createOrder,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;
