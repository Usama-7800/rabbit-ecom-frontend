import { FaChevronDown } from "react-icons/fa6";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../redux/slices/adminOrderSlice";
import { FaSpinner } from "react-icons/fa";

export default function OrderManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, navigate, user]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  const handleMarkAsDelivered = (orderId, newStatus) => {
    handleStatusChange(orderId, newStatus);
  };

  if (loading)
    return (
      <div>
        <FaSpinner className="mx-auto animate-spin text-xl" />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="min-h-screen font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">Order Management</h1>

        {/* Table Container */}
        <div className="bg-white rounded-lg border border-gray-50 shadow-xl overflow-x-scroll">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order?._id}
                    className="hover:bg-gray-50/40 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="px-6 py-5 font-bold text-[14px] text-gray-900 font-mono">
                      {order?._id}
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-5 text-[14px] text-gray-500">
                      {order?.user?.name}
                    </td>

                    {/* Total Price */}
                    <td className="px-6 py-5 text-[14px] text-gray-600 font-medium">
                      ${order?.totalPrice?.toFixed(2)}
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-5">
                      <div className="relative inline-block text-left">
                        <select
                          value={order?.status}
                          onChange={(e) =>
                            handleStatusChange(order?._id, e.target.value)
                          }
                          className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        {/* Custom dropdown caret indicator */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                          <FaChevronDown className="h-3 w-3" />
                        </div>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="px-6 py-5">
                      <button
                        onClick={() =>
                          handleMarkAsDelivered(order?._id, "Delivered")
                        }
                        disabled={order?.status === "Delivered"}
                        className={`text-white text-xs font-semibold px-4 py-2 rounded-sm transition-colors duration-150 ${
                          order?.status === "Delivered"
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-[#22c55e] hover:bg-[#16a34a]"
                        }`}
                      >
                        Mark as Delivered
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-lg font-medium text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
