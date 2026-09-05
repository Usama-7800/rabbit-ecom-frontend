import { useEffect, useState } from "react";
import {  useSearchParams } from "react-router-dom";

export default function FilterSideBar() {
  const [searchParam, setSearchParam] = useSearchParams();
  const [filter, setFilter] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });
  const [priceRange, setPriceRange] = useState([0, 100]);
  const categories = ["Top Wear", "Bottom Wear", "Footwear", "Accessories"];
  const colors = [
    "Red",
    "Blue",
    "Green",
    "Black",
    "White",
    "Yellow",
    "Orange",
    "Purple",
    "Pink",
    "Brown",
    "Gray",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Polyester", "Wool", "Silk", "Leather", "Denim"];
  const brands = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"];
  const genders = ["Male", "Female"];
  useEffect(() => {
    const params = Object.fromEntries([...searchParam]);
    // console.log("params", params);
    // console.log("searchParam", searchParam);
    // Avoid synchronous setState inside effect to prevent cascading renders.
    // Schedule state updates asynchronously.
    const update = () => {
      setFilter({
        category: params.category || "",
        gender: params.gender || "",
        color: params.color || "",
        size: params.size ? params.size.split(",") : [],
        material: params.material ? params.material.split(",") : [],
        brand: params.brand ? params.brand.split(",") : [],
        minPrice: params.minPrice || 0,
        maxPrice: params.maxPrice || 100,
      });
      setPriceRange([0, params.maxPrice || 100]);
    };
    const t = setTimeout(update, 0);
    return () => clearTimeout(t);
  }, [searchParam]);

  const handleFilterChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    const type = target.type;
    const checked = target.checked;

    let newFilter = { ...filter };

    if (type === "checkbox") {
      // Checkboxes (Size, Material, Brand)
      if (checked) {
        newFilter[name] = [...(newFilter[name] || []), value];
      } else {
        newFilter[name] = newFilter[name].filter((item) => item !== value);
      }
    } else if (type === "radio") {
      // Radio (Category, Gender)
      newFilter[name] = value;
    } else if (target.tagName === "BUTTON") {
      newFilter[name] = filter[name] === value ? "" : value;
    }

    setFilter(newFilter);
    updateURLParams(newFilter)
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","))
      } else if (newFilters[key]) {
        params.append(key, newFilters[key])
      }
    });
    setSearchParam(params);
    // navigation(`?${params.toString()}`)
  }
  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice])
    const newFilter = { ...filter, minPrice: 0, maxPrice: newPrice }
    setFilter(filter);
    updateURLParams(newFilter)
  }
  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-400 mb-4">Filter</h3>
      {/* categories filter  */}
      <div className="mb-6 ">
        <label className="block mb-2 font-medium text-gray-600">Category</label>
        {categories.map((category) => (
          <div className="flex items-center mb-1" key={category}>
            <input
              type="radio"
              name="category"
              value={category}
              onChange={handleFilterChange}
              checked={filter.category === category}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border border-gray-300"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div>
      {/* Gender filter  */}
      <div className="mb-6 ">
        <label className="block mb-2 font-medium text-gray-600">Gender</label>
        {genders.map((gender) => (
          <div className="flex items-center mb-1" key={gender}>
            <input
              type="radio"
              name="gender"
              value={gender}
              onChange={handleFilterChange}
              checked={filter.gender === gender}

              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border border-gray-300"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
      </div>
      {/* color filter  */}
      <div className="mb-6 ">
        <label className="block mb-2 font-medium text-gray-600">Color</label>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => {
            return (
              <button
                type="button"
                key={color}
                name="color"
                value={color}
                onClick={handleFilterChange}
                className={`w-8 h-8 rounded-full cursor-pointer transition hover:scale-125 ${filter.color === color
                  ? "ring-3 ring-gray-800 ring-offset-3 shadow-md"
                  : "border border-gray-300"
                  }`}
                style={{ backgroundColor: color.toLowerCase() }}
              ></button>
            );
          })}
        </div>
      </div>
      {/* size filter  */}
      <div className="mb-6 ">
        <label className="block mb-2 font-medium text-gray-600">Size</label>
        {sizes.map((size) => (
          <div className="flex items-center mb-1" key={size}>
            <input
              type="checkbox"
              name="size"
              value={size}
              onChange={handleFilterChange}
              checked={filter.size.includes(size)}

              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border border-gray-300"
            />
            <span className="text-gray-700">{size}</span>
          </div>
        ))}
      </div>
      {/* materials filter  */}
      <div className="mb-6 ">
        <label className="block mb-2 font-medium text-gray-600">Materials</label>
        {materials.map((material) => (
          <div className="flex items-center mb-1" key={material}>
            <input
              type="checkbox"
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={filter.material.includes(material)}

              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border border-gray-300"
            />
            <span className="text-gray-700">{material}</span>
          </div>
        ))}
      </div>
      {/* brands filter  */}
      <div className="mb-6 ">
        <label className="block mb-2 font-medium text-gray-600">Brands</label>
        {brands.map((brand) => (
          <div className="flex items-center mb-1" key={brand}>
            <input
              type="checkbox"
              name="brand"
              value={brand}
              onChange={handleFilterChange}
              checked={filter.brand.includes(brand)}

              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border border-gray-300"
            />
            <span className="text-gray-700">{brand}</span>
          </div>
        ))}
      </div>
      {/* price range flter  */}
      <div className="mb-8 mr-2">
        <label className="block mb-6 font-medium text-gray-600 text-sm">
          Price Range
        </label>

        {/* Relative Container: Taake badge iske andar move kar sake */}
        <div className="relative w-full">

          {/* Badge (Tooltip) */}
          <div
            className="absolute -top-6 bg-rabbit-red text-white text-xs font-bold px-2 py-1 rounded shadow-md transform -translate-x-1/2 transition-all duration-100 ease-out"
            style={{ left: `${priceRange[1]}%` }} // Yeh line badge ko dot ke upar set karti hai
          >
            ${priceRange[1]}
            {/* Badge ke neeche ek chota sa teer (arrow) */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-rabbit-red"></div>
          </div>

          {/* Slider Input */}
          <input
            type="range"
            value={priceRange[1]}
            onChange={handlePriceChange}
            name="maxPrice"
            min={0}
            max={100}
            // accent-blue-600 dot ka color blue kar dega
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-rabbit-red outline-none"
          />
        </div>

        <div className="flex justify-between text-gray-400 text-xs mt-2">
          <span>$0</span>
          <span>$100</span>
        </div>
      </div>


    </div>
  );
}
