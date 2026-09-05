import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

function CartContent({ cart, userId, guestId }) {
  const dispatch = useDispatch();

  const handleQuantityChange = (productId, quantity, size, color, delta) => {
    const newQuantity = quantity + delta;

    if (newQuantity < 1) return;

    dispatch(
      updateCartItemQuantity({
        productId,
        quantity: newQuantity,
        size,
        color,
        guestId,
        userId,
      }),
    );
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(
      removeFromCart({
        productId,
        size,
        color,
        guestId,
        userId,
      }),
    );
  };
  console.log("CartContent", cart);

  return (
    <div className="space-y-4">
      {cart?.products?.map((product) => (
        <div
          key={`${product.productId}-${product.size}-${product.color}`}
          className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0"
        >
          {/* Product Image */}
          <div className="w-20 h-24 flex shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col justify-between h-full min-w-0">
            <div>
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </h3>

                <span className="text-sm font-semibold text-gray-900">
                  ${product.price * product.quantity}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Size:{" "}
                <span className="font-medium text-gray-700">
                  {product.size}
                </span>{" "}
                | Color:{" "}
                <span className="font-medium text-gray-700">
                  {product.color}
                </span>
              </p>
            </div>

            {/* Quantity + Delete */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                {/* Minus */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuantityChange(
                      product.productId,
                      product.quantity,
                      product.size,
                      product.color,
                      -1,
                    )
                  }
                  className="p-1.5 text-gray-600 hover:text-black transition"
                >
                  <FiMinus size={14} />
                </button>

                <span className="px-2 text-xs font-medium text-gray-900 w-6 text-center select-none">
                  {product.quantity}
                </span>

                {/* Plus */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuantityChange(
                      product.productId,
                      product.quantity,
                      product.size,
                      product.color,
                      1,
                    )
                  }
                  className="p-1.5 text-gray-600 hover:text-black transition"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId,
                    product.size,
                    product.color,
                  )
                }
                className="text-gray-400 hover:text-red-500 p-1 transition"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartContent;
