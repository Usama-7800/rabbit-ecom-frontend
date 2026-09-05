import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.order);
  console.log("orderDetails", orderDetails);
  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50/50 min-h-screen font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4 tracking-tight">Order Details</h1>

      {!orderDetails ? (
        <p>No Order Details Found {id}</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          {/* Header Section: ID, Date, and Badges */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-lg font-bold">
                Order ID:{" "}
                <span className="font-semibold">{orderDetails?._id}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {" "}
                {new Date(orderDetails.createdAt).toLocaleDateString()}
                {new Date(orderDetails.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={` ${orderDetails?.isPaid ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"} text-xs font-semibold px-2.5 py-0.5 rounded`}
              >
                {orderDetails?.isPaid ? "Paid" : "Not Paid"}
              </span>
              <span
                className={` ${orderDetails?.isDelivered ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"} text-xs font-semibold px-2.5 py-0.5 rounded`}
              >
                {orderDetails?.isDelivered ? "Delivered" : "Not Delivered"}
              </span>
            </div>
          </div>

          {/* Info Grid: Payment and Shipping */}
          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div>
              <h3 className="font-bold mb-2">Payment Info</h3>
              <p className="text-gray-600">
                Payment Method:{" "}
                <span className="text-gray-900">
                  {orderDetails?.paymentMethod}
                </span>
              </p>
              <p className="text-gray-600">
                Status:{" "}
                <span className="text-gray-900">
                  {orderDetails?.isPaid ? "Paid" : "Not Paid"}
                </span>
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Shipping Info</h3>
              <p className="text-gray-600">
                Shipping Method:{" "}
                <span className="text-gray-900">
                  {orderDetails?.shippingMethod}
                </span>
              </p>
              <p className="text-gray-600">
                Address:{" "}
                <span className="text-gray-900">
                  {orderDetails?.shippingAddress.address} ,{" "}
                  {orderDetails?.shippingAddress.city} {" "}
                </span>
                <span className="text-gray-900">
                  {orderDetails?.shippingAddress.country}
                </span>
              </p>
            </div>
          </div>

          {/* Products Table */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-sm">Products</h3>
            <div className="w-full overflow-hidden border border-gray-100 rounded-md">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 font-semibold text-gray-600">
                    <th className="py-2.5 px-4 text-center">ID</th>
                    <th className="py-2.5 px-4 w-16"></th>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4 text-center">Quantity</th>
                    <th className="py-2.5 px-4 text-center">Price</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails?.orderItems.map((item) => (
                    <tr
                      key={item.productId}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center text-gray-600">
                        {item.productId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200">
                          {/* Replace src with actual images as needed */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {item.name}
                        </Link>
                      </td>

                      <td className="py-3 px-4 text-center text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        {item.price * item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        $
                        {(item.price * item.quantity) % 1 === 0
                          ? item.price * item.quantity
                          : (item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Link */}
          <div className="pt-2">
            <Link
              to="/my-orders"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Back to My Orders
            </Link>
          </div>
        </div>
      )}
      {/* Main Container Card */}
    </div>
  );
}
