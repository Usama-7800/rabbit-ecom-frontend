import { Link } from "react-router-dom";

export default function ProductGrid({ products, loading, error }) {
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link to={`/product/${product._id}`} key={index} className="block">
          <div className="p-4 bg-white rounded-lg">
            <div className="w-full h-96 mb-4 ">
              <img
                src={product.images[0].urls}
                alt={product.images[0].altText || product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-sm mb-2 ">{product?.name}</h3>
            <p className="text-gray-500 font-medium text-sm tracking-tighter">
              ${product?.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
