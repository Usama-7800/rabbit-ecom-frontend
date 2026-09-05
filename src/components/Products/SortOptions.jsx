import { useSearchParams } from "react-router-dom";

export default function SortOptions() {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [sortOption, setSortOption] = useState("newest");

  // Yeh woh options hain jo dropdown mein nazar aayenge
  const options = [
    { value: "newest", label: "Newest Arrivals" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "popularity", label: "Popularity" },
  ];

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy)
    setSearchParams(searchParams)

    console.log("Selected Sort:", searchParams);
  };

  return (
    <div className="mb-4 flex justify-end">
      <div className="flex items-center gap-3    ">
        <label htmlFor="sort" className="text-sm font-medium text-gray-600 whitespace-nowrap">
          Sort By:
        </label>

        <div className="relative">
          <select
            id="sort"
            value={searchParams.get("get") || ""}
            onChange={handleSortChange}
            className="appearance-none block w-48 pl-3 pr-10 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom Dropdown Arrow (Tailwind Icon) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}