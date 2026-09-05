import { useState } from "react";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsByFilters,
  setFilter,
} from "../../redux/slices/productSlice";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // add debounce on search
  // useEffect(() => {
  //   // if not typing anything then close the search bar
  //   if (!searchTerm) return;

  //   // if typing then set timer
  //   const debounceTimer = setTimeout(() => {
  //     // make api call here
  //     console.log("Debounced Search Term:", searchTerm);
  //   }, 500);

  //   return () => clearTimeout(debounceTimer);
  // }, [searchTerm]);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsOpen(false);
    dispatch(setFilter({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    navigate(`/collections/all?search=${searchTerm}`);
    setSearchTerm("");
  };

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? "absolute top-0 left-0 w-full bg-white h-16 z-50" : "w-auto"}`}
    >
      {isOpen ? (
        <>
          <form
            onSubmit={handleSearch}
            className="relative flex items-center justify-center  w-full"
          >
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                autoFocus
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 px-2 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
              />
              {/* search button  */}
              <button
                type="submit"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <HiMagnifyingGlass
                  size={19}
                  className="text-gray-400 shrink-0"
                />
              </button>
              {/* close button   */}
            </div>
            <button
              type="button"
              onClick={handleSearchToggle}
              className="absolute cursor-pointer top-1/2 right-4 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              aria-label="Close search"
            >
              <HiXMark size={20} />
            </button>
          </form>
          {/* <form
          // onSubmit={handleSearchSubmit}
          className="w-full flex items-center gap-2 border-b border-gray-300 py-1 animate-fade-in"
        >
          <HiMagnifyingGlass size={19} className="text-gray-400 shrink-0" />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items, brands, styles..."
            className="w-full bg-transparent outline-none py-1 text-sm text-gray-800 placeholder-gray-400"
            autoFocus
          />

          <button
            type="button"
            onClick={handleSearchToggle}
            className="p-1 text-gray-400 hover:text-rabbit-red transition-colors shrink-0 cursor-pointer"
            aria-label="Close search"
          >
            <HiXMark size={20} />
          </button>
        </form> */}
        </>
      ) : (
        <button
          onClick={handleSearchToggle}
          className="p-1 hover:text-rabbit-red transition-colors cursor-pointer "
          aria-label="Menu"
        >
          <HiMagnifyingGlass size={19} strokeWidth={0.5} />
        </button>
      )}
    </div>
  );
}
