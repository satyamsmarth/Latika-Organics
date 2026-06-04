"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import Link from "next/link";

export default function ProductGrid(){

 const [products,setProducts] = useState([]);
 const dispatch = useDispatch();

 useEffect(()=>{

  fetch("https://latika-organics-backend.onrender.com/api/products")
   .then(res=>res.json())
   .then(data=>{
    if(Array.isArray(data)){
     setProducts(data);
    }
   });

 },[]);

 const addItem = (product)=>{

  dispatch(addToCart({
   id: product._id,
   name: product.name,
   price: product.price
  }));

 };

 return(

  <section className="py-16">

   <h2 className="text-2xl font-semibold text-center mb-10">
    Best Selling Oils
   </h2>

   <div className="grid md:grid-cols-3 gap-8">

    {products.map(product=>(

     <div
      key={product._id}
      className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
     >

      {/* PRODUCT IMAGE */}

      <div className="overflow-hidden">

       {product.images && product.images.length > 0 ? (

        <img
         src={product.images[0]}
         className="w-full h-56 object-cover hover:scale-110 transition duration-300"
        />

       ) : (

        <div className="w-full h-56 flex items-center justify-center bg-gray-100">
         No Image
        </div>

       )}

      </div>

      {/* PRODUCT DETAILS */}

      <div className="p-4">

       <h3 className="font-semibold text-lg mb-1">
        {product.name}
       </h3>

       <p className="text-green-600 font-bold mb-3">
        ₹{product.price}
       </p>

       <div className="flex gap-3">

        <Link href={`/product/${product._id}`}>

         <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          View
         </button>

        </Link>

        <button
         onClick={()=>addItem(product)}
         className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
         Add to Cart
        </button>

       </div>

      </div>

     </div>

    ))}

   </div>

  </section>

 );

}