"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";

export default function Wishlist(){

 const router = useRouter();

 const [items,setItems] = useState([]);

 useEffect(()=>{

  const token = localStorage.getItem("token");

  if(!token){
   router.push("/login");
   return;
  }

  fetch("https://latika-organics-backend.onrender.com/api/wishlist",{

   headers:{
    Authorization:"Bearer "+token
   }

  })
  .then(res=>res.json())
  .then(data=>{

   if(Array.isArray(data)){
    setItems(data);
   }else{
    setItems([]);
   }

  })
  .catch(()=>setItems([]));

 },[]);

 return(

  <div style={{padding:"40px"}}>

   <h1>My Wishlist</h1>

   {items.length === 0 && (
    <p>No items in wishlist</p>
   )}

   {items.map(product=>(

    <div key={product._id} style={{
     border:"1px solid #ccc",
     padding:"20px",
     marginBottom:"10px"
    }}>

     <h3>{product.name}</h3>

     <p>₹{product.price}</p>

    </div>

   ))}

  </div>

 );

}