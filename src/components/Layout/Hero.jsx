import { Link } from "react-router-dom";
import heroImg from "../../assets/rabbit-hero.webp";
export default function Hero() {
  return (
    <>
      <section className="relative">
        <img
          src={heroImg}
          alt="hero"
          className="w-full h-100 md:h-125 lg:h-180 object-cover object-center"
        />
        <div className="absolute inset-0  bg-opacity-5  flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h1 className="text-4xl md:text-9xl  font-bold tracking-tighter uppercase mb-4">
              Vication <br /> Ready
            </h1>
            <p className="text-sm tracking-tightermd:text-lg mb-6">
              Explore our vication ready outfits with fast shipping
            </p>
            <Link
               to="#"
              className="bg-white text-gray-950  px-6 py-2 rounded-sm text-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
