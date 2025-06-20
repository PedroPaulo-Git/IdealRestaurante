import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ setShowLoginPopup, children }) => {
  const [cartItems, setCartItems] = useState({});
  const [clientId, setClientId] = useState(null); //CORRECT CLIENT ID IN PRODUCTION DEVELOPMENT
  const [token, setToken] = useState(null);
  //const [clientId, setClientId] = useState(99999);// PREVIOUS CLIEND ID ONLY TO DEVELOPMENT
  const [clientName, setClientName] = useState(null);
  const [clientEmail, setClientEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const storedClientId = localStorage.getItem("clientId");
    const storedUsername = localStorage.getItem("clientName");
    const storedEmail = localStorage.getItem("clientEmail");
    const storedIsAdmin = localStorage.getItem("isAdmin") === "true"; // Parse as boolean
    setIsAdmin(storedIsAdmin);
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    const storedToken = localStorage.getItem("token");
    
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
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error("Token não encontrado no localStorage");
    }
    if (storedClientId && storedUsername) {
      login(storedClientId, storedUsername, storedEmail, storedIsAdmin, storedToken);

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
    // setToken(localStorage.getItem("token"))
    // console.log(token)
    if (clientId) {
      fetchCartItems(clientId);
    } else {
      setCartItems({});
    }
  }, [clientId]);

  // useEffect(() => {

  //   console.log("TOKEN :", token);
  // }, [clientId]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const login = (id, username, email, adminStatus, tokenValue) => {
    setClientId(id);
    setClientName(username);
    setClientEmail(email);
    setIsAdmin(adminStatus);
    setToken(tokenValue);
    //console.log('Login function - ID:', id, 'Username:', username);
    localStorage.setItem("clientId", id);
    localStorage.setItem("clientName", username);
    localStorage.setItem("clientEmail", email);
    localStorage.setItem("isAdmin", adminStatus);
    localStorage.setItem("token", tokenValue);
  };

  const logout = () => {
    setClientId(null);
    setClientName(null);
    setClientEmail(null);
    localStorage.removeItem("clientId");
    localStorage.removeItem("clientName");
    localStorage.removeItem("clientEmail");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("token");
    setCartItems({});
    window.location.reload();
  };

  const fetchCartItems = async (clientId) => {
    if (clientId) {
      try {
        const response = await fetch(`${backendUrl}/api/cart/${clientId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }
        const data = await response.json();
        const newCartItems = {};
        if (data.items) {
          data.items.forEach((item) => {
            newCartItems[item.productId] = item.quantity;
          });
        }
        setCartItems(newCartItems);
        localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    }
  };
  const [pendingUpdates, setPendingUpdates] = useState(new Set());

  const addToCart = async (itemId) => {
    // Se já tem request pendente para este item, ignora
    if (pendingUpdates.has(itemId)) return;

    // Marca como pendente
    setPendingUpdates((prev) => new Set([...prev, itemId]));

    // Atualiza UI imediatamente (otimistic update)
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    try {
      // Faz a requisição
      const response = await fetch(`${backendUrl}/api/cart/${clientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: itemId, quantity: 1 }),
      });

      const updatedCart = await response.json();

      // SÓ ATUALIZA O ESTADO COM O BACKEND SE NÃO TEM MAIS REQUESTS PENDENTES
      setPendingUpdates((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);

        // Se não tem mais requests pendentes, sincroniza com backend
        if (newSet.size === 0) {
          setCartItems(
            updatedCart.items.reduce(
              (acc, item) => ({
                ...acc,
                [item.productId]: item.quantity,
              }),
              {}
            )
          );
        }

        return newSet;
      });
    } catch (error) {
      // Se der erro, reverte o update otimistic
      setCartItems((prev) => ({
        ...prev,
        [itemId]: Math.max(0, (prev[itemId] || 1) - 1),
      }));

      // Remove da lista de pendentes
      setPendingUpdates((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const ReduceItem = async (itemId) => {
    if (pendingUpdates.has(itemId)) return;

    setPendingUpdates((prev) => new Set([...prev, itemId]));

    // Update otimistic
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1),
    }));

    try {
      const response = await fetch(
        `${backendUrl}/api/cart/${clientId}/${itemId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const updatedCart = await response.json();

      setPendingUpdates((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);

        // Só sincroniza se não tem mais pendentes
        if (newSet.size === 0) {
          setCartItems(
            updatedCart.items.reduce(
              (acc, item) => ({
                ...acc,
                [item.productId]: item.quantity,
              }),
              {}
            )
          );
        }

        return newSet;
      });
    } catch (error) {
      // Reverte se der erro
      setCartItems((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));

      setPendingUpdates((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };
  ////////////////////////////////////
  const removeFromCart = async (itemId) => {
    console.log("RemoveFromCart - Removing entire item");
    const currentQuantity = cartItems[itemId] || 0;

    if (currentQuantity === 0) {
      console.error("item not in cart");
      return;
    }

    console.log("Current quantity:", currentQuantity);
    console.log("Removing entire item from cart");

    if (clientId) {
      // Remove o item completamente do estado local (optimistic update)
      setCartItems((prev) => {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      });

      try {
        const response = await fetch(
          `${backendUrl}/api/cart/${clientId}/${itemId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: 0 }),
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error("Error removing from cart:", errorMessage);

          // Reverte o estado em caso de erro
          setCartItems((prev) => ({ ...prev, [itemId]: currentQuantity }));
        } else {
          const result = await response.json();

          const updatedCartItems = {};
          result.items.forEach((item) => {
            updatedCartItems[item.productId] = item.quantity;
          });

          setCartItems(updatedCartItems);
        }
      } catch (error) {
        console.error("Error removing from cart:", error);

        // Reverte o estado em caso de erro
        setCartItems((prev) => ({ ...prev, [itemId]: currentQuantity }));
      }
    } else {
      console.error("Client ID is not defined");
    }
  };
  const clearCart = async () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
  };

  const createOrder = async () => {
    const getProductDetailsById = (productId) => {
      const product = food_list.find((item) => item._id === productId);
      return product
        ? { name: product.name, price: product.price }
        : { name: "", price: 0 }; // Return default values if product not found
    };

    if (!clientId) {
      console.error("Client ID is not defined");
      return;
    }
    const itemsArray = Object.entries(cartItems).map(
      ([productId, quantity]) => {
        const { name, price } = getProductDetailsById(productId); // Get product details
        return {
          productId: Number(productId),
          quantity,
          price,
          name,
        };
      }
    );
    console.log("creating order... ", clientId, itemsArray);
    try {
      const response = await fetch(`${backendUrl}/api/createorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: Number(clientId), // Assuming you have this in your context or props
          items: itemsArray, // Ensure this contains the items from the cart
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      console.log("Payload being sent:", {
        clientId: Number(clientId),
        items: itemsArray,
      });

      const orderData = await response.json();
      console.log("Order created successfully:", orderData);

      clearCart();
    } catch (error) {
      console.error("Error create order:", error);
    }
    console.log("Payload being sent:", {
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
          console.log(`Product not found for ID: ${item}`);
        }
      }
    }
    return totalCart;
  };

  // useEffect(() => {
  //     console.log(cartItems);
  // }, [cartItems])

  const contextValue = {
    food_list,
    cartItems,
    clientId,
    token,
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
  );
};
export default StoreContextProvider;
