import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";
import { useEffect } from "react";



export default function AdminHomePage() {
    const dispatch = useDispatch();
    const { products, loading: productLoading, error: productError } = useSelector((state) => state.adminProducts);
    const { orders, totalOrders, totalSales, loading: ordersLoading, error: ordersError } = useSelector((state) => state.adminOrders);
    console.log("orders", orders);
    const stats = [
        { label: 'Revenue', value: totalSales, currency: true },
        { label: 'Total Orders', value: totalOrders, link: '/admin/orders' },
        { label: 'Total Products', value: products.length, link: '/admin/products' },
    ];
    useEffect(() => {
        dispatch(fetchAdminProducts());
        dispatch(fetchAllOrders());
    }, [dispatch]);
    return (
        <div className="min-h-screen     font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                {productLoading || ordersLoading ? (
                    <p>Loading...</p>
                ) : productError ? (
                    <p className="text-red-500">Error loading products. {productError}</p>
                ) : ordersError ? (
                    <p className="text-red-500">Error loading orders. {ordersError}</p>
                ) : (
                    <>
                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-white p-6 rounded-lg shadow-sm flex flex-col space-y-2"
                                >
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                    <div className="text-3xl font-bold">
                                        {stat.currency && '$'}
                                        {stat.value}
                                    </div> 
                                    {stat.link && (
                                        <Link
                                            to={stat.link}
                                            className="text-sm text-blue-600 hover:underline mt-auto "
                                        >
                                            Manage{' '}
                                            {stat.label.includes('Orders') ? 'Orders' : 'Products'}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div></>
                )}


                {orders.length > 0 ?
                    <>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-200 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                ORDER ID
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Name/User
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                TOTAL PRICE
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                STATUS
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order._id}>
                                                <td className="px-6 py-5 text-sm text-gray-900 font-mono">
                                                    {order._id}
                                                </td>
                                                <td className="px-6 py-5 text-sm text-gray-600">
                                                    {order?.user?.name}
                                                </td>
                                                <td className="px-6 py-5 text-sm text-gray-600">
                                                    {order?.user?.role}
                                                </td>
                                                <td className="px-6 py-5 text-sm text-gray-900">
                                                    ${order.totalPrice.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-5 text-sm">
                                                    <span
                                                        className={`font-medium ${order.status === 'Delivered'
                                                            ? 'text-green-700'
                                                            : 'text-gray-600'
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                    :
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                        <h2 className="text-xl font-bold mb-4">No Orders Yet</h2>
                        <p className="text-gray-600">There are no orders to display at the moment.</p>
                    </div>}
                {/* Recent Orders Section */}

            </div>
        </div>
    );
}
