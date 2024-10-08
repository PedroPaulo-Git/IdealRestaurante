import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../../assets/assets';
import { StoreContext } from '../../../context/StoreContext';

const Order = () => {
    const [carts, setCarts] = useState([]);
    const { food_list } = useContext(StoreContext);

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/carts'); // Adjust the URL as needed
                if (!response.ok) {
                    throw new Error('Failed to fetch carts');
                }
                const data = await response.json();
                setCarts(data);
            } catch (error) {
                console.error('Error fetching carts:', error);
            }
        };

        fetchCarts();
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
                        {carts.length > 0 ? (
                            carts.filter(cart => cart.items.length > 0).map((cart) => {
                                // Calculate total price for the cart
                                const totalPrice = cart.items.reduce((total, item) => {
                                    const foodItem = food_list.find(food => food._id === item.productId.toString());
                                    return total + (foodItem ? foodItem.price * item.quantity : 0);
                                }, 0).toFixed(2);

                                return (
                                    <tr key={cart.id}>
                                        <td className="whitespace-nowrap px-4 py-0 font-medium text-gray-900">
                                            {cart.items.map((item, index) => {
                                                const foodItem = food_list.find(food => food._id === item.productId.toString());
                                                return (
                                                    <div key={index} className='flex items-center my-4'>
                                                        <img src={foodItem?.image || assets.defaultImage} alt={foodItem?.name || 'Product'} className="w-16 h-16 object-cover mr-2" />
                                                        <div className='flex flex-col'>
                                                            <p>{foodItem?.name || 'Unknown Product'} (x{item.quantity})</p>
                                                            <p className='text-gray-400'>#1A56DB</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-2">
                                            <div className='flex justify-center flex-col items-center'>
                                                <p className='font-medium'>Roberto Alves</p>
                                                <p>Rua Lagoa Rasa Nº42</p>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            <div className='flex justify-center'>
                                                <p>R$: {totalPrice}</p>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            <div className='flex justify-center'>
                                                <p>Pendente</p>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No carts available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Order;
