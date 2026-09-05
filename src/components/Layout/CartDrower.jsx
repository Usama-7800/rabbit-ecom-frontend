// Frontend/src/components/Layout/CartDrower.jsx
import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CartDrower({ drawerOpen, toggleCartDrawer }) {
  const navigation = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  // const cart = [
  //   {
      // productId: 1,
  //     name: "T-shirt",
  //     size: "M",
  //     color: "Red",
  //     quantity: 1,
  //     price: 15,
  //     image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
  //   },
  //   {
  //     productId: 2,
  //     name: "Hoodie",
  //     size: "L",
  //     color: "Black",
  //     quantity: 2,
  //     price: 45,
  //     image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
  //   },
  //   {
  //     productId: 3,
  //     name: "Running Shoes",
  //     size: "10",
  //     color: "White/Blue",
  //     quantity: 1,
  //     price: 85,
  //     image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  //   },
  //   {
  //     productId: 4,
  //     name: "Baseball Cap",
  //     size: "One Size",
  //     color: "Navy",
  //     quantity: 1,
  //     price: 20,
  //     image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
  //   },
  //   {
  //     productId: 5,
  //     name: "Sneakers",
  //     size: "9",
  //     color: "Gray",
  //     quantity: 1,
  //     price: 120,
  //     image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500",
  //   },
  // ];
  // console.log("cart:", cart);
  // console.log("cart.products:", cart?.products);
  console.log("CartDrower", cart);

  const userId = user?._id || null;

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigation("/login?redirect=/checkout");
      return;
    }
    navigation("/checkout")
  }
  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-2/4 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* close button  */}
      <div className="flex justify-end p-4 border- border-gray-200 shadow-md">
        <button
          onClick={toggleCartDrawer}
          className="  flex items- justify-between w-full items-center "
        >
          <h2 className="text-xl font-semibold">Cart</h2>
          <IoMdClose size={24} className="text-gray-900 cursor-pointer" />
        </button>
      </div>
      {/* cart content scrollable area  */}
      <div className="flex-1 overflow-y-auto p-4">
        {cart && cart?.products?.length > 0 ? (
          <CartContent cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p>Your cart is empty.</p>
        )}
        {/* component for cart content   */}
      </div>
      {/* checkout button that fixed below */}
      <div className="p-4 bg-white sticky bottom-0">
        {cart && cart?.products?.length > 0 && (
          <>
            <button onClick={handleCheckout} className="bg-black w-full text-white py-3 rounded-lg font font-semibold hover:bg-gray-800 transition">
              Checkout
            </button>
            <p className="text-sm text-gray-500 tracking-tighter mt-2 text-center">
              Shipping, taxes, and discount codes calculated at checkout.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
