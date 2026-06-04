"use client";

import { useEffect, useState } from "react";

export default function ProductFilters({
  setCategory,
  setSort,
  setPriceRange
}) {

  const [categories, setCategories] = useState([]);


  /* LOAD CATEGORIES */

  useEffect(() => {

    fetch("https://latika-organics-backend.onrender.com/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));

  }, []);


  return (

    <div className="bg-white shadow-sm border rounded-xl p-6 mb-8 flex flex-wrap items-center gap-6">


      {/* CATEGORY FILTER */}

      <div className="flex flex-col">

        <label className="text-sm text-gray-500 mb-1">
          Category
        </label>

        <select
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >

          <option value="All">
            All Categories
          </option>

          {categories.map((cat) => (

            <option
              key={cat._id}
              value={cat.name}
            >
              {cat.name}
            </option>

          ))}

        </select>

      </div>



      {/* PRICE FILTER */}

      <div className="flex flex-col">

        <label className="text-sm text-gray-500 mb-1">
          Price Range
        </label>

        <select
          onChange={(e) => setPriceRange(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">All Prices</option>
          <option value="500">Below ₹500</option>
          <option value="1000">Below ₹1000</option>
          <option value="2000">Below ₹2000</option>
        </select>

      </div>



      {/* SORT */}

      <div className="flex flex-col">

        <label className="text-sm text-gray-500 mb-1">
          Sort By
        </label>

        <select
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="newest">Newest</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>

      </div>


    </div>

  );

}