import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts } from "../../redux/slices/adminProductSlice";
import { useEffect } from "react";
import { deleteProduct } from "../../redux/slices/adminProductSlice";

export default function ProductManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts,
  );
  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);
  // const handleEdit = (sku) => {
  //     // Action handler placeholder
  //     console.log(`Edit product with SKU: ${sku}`);
  // };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="bg-white min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Product Management ({products.length})
          </h1>

          <button
            onClick={() => navigate("/admin/products/create")}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Create Product
          </button>
        </div>
        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200/80">
                <th className="px-6 py-4.5">ID</th>
                <th className="px-6 py-4.5">Name</th>
                <th className="px-6 py-4.5">Price</th>
                <th className="px-6 py-4.5">Sku</th>
                <th className="px-6 py-4.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.sku}
                    className="hover:bg-gray-50/40 transition-colors"
                  >
                    {/* Product Name */}
                    <td className="px-6 py-4.5 font-semibold text-gray-900 text-[15px]">
                      {product._id}
                    </td>
                    <td className="px-6 py-4.5 font-semibold text-gray-900 text-[15px]">
                      {product.name}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4.5 text-gray-500 text-[15px]">
                      {product.price}
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-4.5 text-gray-400 font-mono text-[13px] tracking-wider">
                      {product.sku}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-center space-x-2">
                        {/* <button
                                                    onClick={() => handleEdit(product.sku)}
                                                    className="bg-[#eab308] hover:bg-[#ca8a04] text-white text-[13px] font-medium px-4 py-1.5 rounded transition-colors duration-150"
                                                >
                                                    Edit
                                                </button> */}
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="bg-[#eab308] hover:bg-[#ca8a04] text-white text-[13px] font-medium px-4 py-1.5 rounded transition-colors duration-150"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-[#ef4444] hover:bg-[#dc2626] text-white text-[13px] font-medium px-4 py-1.5 rounded transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4.5 text-center text-gray-500"
                  >
                    <h2>Products not found</h2>
                    <p>Please add some products to get started.</p>
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
