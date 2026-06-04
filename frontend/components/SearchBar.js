"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar(){

 const [query,setQuery] = useState("");
 const [products,setProducts] = useState([]);
 const [results,setResults] = useState([]);

 const router = useRouter();


 /* LOAD PRODUCTS ONCE */

 useEffect(()=>{

  fetch("https://latika-organics-backend.onrender.com/api/products")
  .then(res=>res.json())
  .then(data=>setProducts(data));

 },[]);


 /* FILTER PRODUCTS */

 useEffect(()=>{

  if(query===""){
   setResults([]);
   return;
  }

  const filtered = products.filter(p =>
   p.name.toLowerCase().includes(query.toLowerCase())
  );

  setResults(filtered.slice(0,5));

 },[query,products]);


 return(

 <div className="relative w-full max-w-md">

 <input
  type="text"
  placeholder="Search oils..."
  value={query}
  onChange={(e)=>setQuery(e.target.value)}
  className="border px-4 py-2 w-full rounded"
/>


 {results.length>0 && (

 <div className="absolute bg-white border w-full mt-1 shadow-lg z-50">

 {results.map(p=>(
 <div
 key={p._id}
 onClick={()=>router.push(`/product/${p._id}`)}
 className="p-3 hover:bg-gray-100 cursor-pointer"
 >
 {p.name}
 </div>
 ))}

 </div>

 )}

 </div>

 );

}