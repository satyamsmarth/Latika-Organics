"use client";

import { useEffect, useState } from "react";

export default function CategoryFilter({setCategory}){

 const [categories,setCategories]=useState([]);

 useEffect(()=>{

  fetch("https://latika-organics-backend.onrender.com/api/categories")
  .then(res=>res.json())
  .then(data=>setCategories(data));

 },[]);

 return(

  <div className="flex gap-4 mb-6">

   <button onClick={()=>setCategory("")}>
    All
   </button>

   {categories.map(cat=>(
    <button
     key={cat._id}
     onClick={()=>setCategory(cat.name)}
     className="border px-3 py-1"
    >
     {cat.name}
    </button>
   ))}

  </div>

 );
}