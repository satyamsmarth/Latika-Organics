"use client";

import { useEffect, useState } from "react";

export default function CategorySection({ onSelect }) {

  const [categories, setCategories] = useState([]);

  useEffect(() => {

    fetch("https://latika-organics-backend.onrender.com/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));

  }, []);


  return (

    <div className="my-12">

      {/* SECTION TITLE */}

      <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
        Shop By Category
      </h2>


      {/* CATEGORY GRID */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {categories.map((c) => (

          <button
            key={c._id}
            onClick={() => onSelect(c.name)}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-lg transition duration-300 hover:bg-green-600 hover:text-white font-medium"
          >
            {c.name}
          </button>

        ))}

      </div>

    </div>

  );

}