import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";

export default function MyorderPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);
  // () => navigate(`/order/${order._id}`)
  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };
  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  //   if (!cart?.products?.length) {
  //     return <p>Your Cart is Empty</p>;
  //   }
  return (
    <div className="max-w-7xl mx-auto p-4 sm:px-6 ">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
      <div className="relative shadow-md rounded-lg overflow-hidden ">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="py-2 px-4 sm:py-3">IMAGE</th>
              <th className="py-2 px-4 sm:py-3">ORDER ID</th>
              <th className="py-2 px-4 sm:py-3">CREATED</th>
              <th className="py-2 px-4 sm:py-3">SHIPPING ADDRESS</th>
              <th className="py-2 px-4 sm:py-3">ITEMS</th>
              <th className="py-2 px-4 sm:py-3">PRICE</th>
              <th className="py-2 px-4 sm:py-3">STATUS</th>
            </tr>
          </thead>
          <tbody className="">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="bg-white border-b hover:bg-rabbit-red/20 cursor-pointer "
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {/* {order.ShippingAddress
                      ? `${order.ShippingAddress.city}, ${order.ShippingAddress.country}`
                      : "N/A"} */}
                    {order?.shippingAddress.address} ,{" "}
                    {order?.shippingAddress.city} 
                    {/* {order?.shippingAddress.country} */}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.orderItems.length}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span
                      className={`${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-7 00"} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                    >
                      ${order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                  You have no orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
