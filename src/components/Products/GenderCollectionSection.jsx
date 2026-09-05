import { Link } from "react-router-dom";
import MensCollectionImage from "../../assets/mens-collection.webp";
import WomensCollectionImage from "../../assets/womens-collection.webp";
export default function GenderCollectionSection() {
  return (
    <section className="py-16 px-4 lg:px-0 ">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* womens collection  */}
        <div className="relative flex-1">
          <img
            src={WomensCollectionImage}
            alt="Womens Collection"
            className="w-full h-175 object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Womens Collection</h1>
            <Link to="/collections/all?gender=women" className="text-gray-900 underline">
              Shop Now
            </Link>
          </div>
        </div>
        {/* mens collection  */}
        <div className="relative flex-1">
          <img
            src={MensCollectionImage}
            alt="Mens Collection"
            className="w-full h-175 object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Mens Collection</h1>
            <Link to="/collections/all?gender=women" className="text-gray-900 underline">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
