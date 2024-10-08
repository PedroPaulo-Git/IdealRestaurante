import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../../assets/assets';
import { StoreContext } from '../../../context/StoreContext';

const Order = () => {
    const [orders, setOrders] = useState([]); // Rename state to orders
    const { food_list } = useContext(StoreContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/orders'); // Adjust the URL as needed
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <div className="overflow-x-auto w-[100%] rounded-lg lg:min-w-[60vw] ml-5">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Pedido</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Endereço</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Valor</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Situação</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {orders.length > 0 ? (
                            orders.map((order) => {
                                const totalPrice = order.total.toFixed(2); // Total from the order data

                                return (
                                    <tr key={order.id}>
                                        <td className="whitespace-nowrap px-4 py-0 font-medium text-gray-900">
                                            {order.items.map((item, index) => {
                                                const foodItem = food_list.find(food => food._id === item.productId.toString());
                                                return (
                                                    <div key={index} className='flex items-center my-4'>
                                                        <img src={foodItem?.image || assets.defaultImage} alt={foodItem?.name || 'Product'} className="w-16 h-16 object-cover mr-2" />
                                                        <div className='flex flex-col'>
                                                            <p>{foodItem?.name || 'Unknown Product'} (x{item.quantity})</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-2">
                                            <div className='flex justify-center flex-col items-center'>
                                                <p className='font-medium'>Roberto Alves</p> {/* Replace with actual client data */}
                                                <p>Rua Lagoa Rasa Nº42</p> {/* Replace with actual address */}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            <div className='flex justify-center'>
                                                <p>R$: {totalPrice}</p>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            <div className='flex justify-center'>
                                                <p>{order.status}</p> {/* Displaying order status */}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No orders available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Order;
