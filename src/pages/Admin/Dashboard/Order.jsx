import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../../assets/assets";
import { StoreContext } from "../../../context/StoreContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";

const Order = () => {
  const [orders, setOrders] = useState([]); // Rename state to orders
  const { food_list,clientId } = useContext(StoreContext);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const toggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Make sure to include the clientId in the request headers
        const response = await fetch("http://localhost:3000/admin/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Client-ID": clientId, // Include the clientId here
          },
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(`Failed to fetch orders: ${errorDetails.message}`);
        }

        const data = await response.json();
        setOrders(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [clientId]); // Add clientId as a dependency

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Client-ID": clientId, // Include the clientId here as well
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      console.log("Order status updated:", updatedOrder);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return ""; // Verifica se a string é vazia
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <div className="overflow-x-auto w-[100%] rounded-lg lg:min-w-[60vw] ml-5">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Pedido
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Endereço
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Valor
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Situação
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {orders.length > 0 ? (
              [
                ...orders
                  .filter((order) => order.status === "pendente")
                  .sort((a, b) => new Date(b.date) - new Date(a.date)),
                ...orders.filter((order) => order.status !== "pendente"),
              ].map((order) => {
                const totalPrice = order.total.toFixed(2); // Total from the order data

                return (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap px-4 py-0 font-medium text-gray-900">
                      {order.items.map((item, index) => {
                        const foodItem = food_list.find(
                          (food) => food._id === item.productId.toString()
                        );
                        return (
                          <div key={index} className="flex items-center my-4">
                            <img
                              src={foodItem?.image || assets.defaultImage}
                              alt={foodItem?.name || "Product"}
                              className="w-16 h-16 object-cover mr-2"
                            />
                            <div className="flex flex-col">
                              <p>
                                {foodItem?.name || "Unknown Product"} (x
                                {item.quantity})
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </td>

                    <td className="whitespace-nowrap px-4 py-2">
                      <div className="flex justify-center flex-col items-center">
                        <p className="font-medium">Roberto Alves</p>{" "}
                        {/* Replace with actual client data */}
                        <p>Rua Lagoa Rasa Nº42</p>{" "}
                        {/* Replace with actual address */}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <div className="flex justify-center">
                        <p>R$: {totalPrice}</p>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <div className="flex justify-center">
                        {capitalizeFirstLetter(order.status)}
                        <p className="flex items-center">
                          {" "}
                          <GoDotFill
                            className={` ${
                              order.status === "pendente"
                                ? "text-yellow-300"
                                : order.status === "completo"
                                ? "text-green-500"
                                : order.status === "cancelado"
                                ? "text-red-500"
                                : ""
                            } text-xl`}
                          />
                        </p>{" "}
                        {/* Displaying order status */}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <BsThreeDotsVertical
                        className="cursor-pointer text-lg"
                        onClick={() => toggleDropdown(order.id)}
                      />
                      <div
                        id="dropdown"
                        className={`z-10 ${
                          openDropdownId === order.id ? "block" : "hidden"
                        } bg-white divide-y absolute right-32 divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
                      >
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                          <li>
                            <a
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() =>
                                updateOrderStatus(order.id, "completo")
                              }
                            >
                              Completo
                            </a>
                          </li>
                          <li>
                            <a
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() =>
                                updateOrderStatus(order.id, "pendente")
                              }
                            >
                              Pendente
                            </a>
                          </li>
                          <li>
                            <a
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() =>
                                updateOrderStatus(order.id, "cancelado")
                              }
                            >
                              Cancelar
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
