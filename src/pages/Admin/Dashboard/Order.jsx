import React from 'react'
import { assets_menuList } from '../../../assets/assets';
const Order = () => {
    return (
        <div>
            {/*
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
*/}

            <div className="overflow-x-auto w-[64vw] rounded-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Pedido</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Endereço</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Valor</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Situação</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {assets_menuList.map((item, index) => (
                            <tr key={index}>


                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 flex">
                                    <img src={item.menu_image} alt={item.menu_name} className="w-16 h-16 object-cover" />
                                    <div className='flex flex-col pl-5 justify-evenly'>
                                        {item.menu_name}
                                        <p>id:#2198319</p>
                                    </div>

                                </td>

                                <td className="whitespace-nowrap px-4 py-2">
                                    <div className='flex justify-center flex-col items-center'>
                                        <p className='font-medium'>Roberto Alves</p>
                                        <p>Rua Lagoa Rasa Nº42</p>
                                    </div>
                                </td>

                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    <div className='flex justify-center'>
                                        <p>R$:45,99</p>
                                    </div>
                                </td>

                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    <div className='flex justify-center'>
                                        <p>Pendente</p>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Order;