"use client";

import { useState } from "react";

export default function CheckoutForm(){

 const [address,setAddress] = useState("");
 const [city,setCity] = useState("");
 const [pincode,setPincode] = useState("");

 const submit = async () => {

  const data = {
   address,
   city,
   pincode
  };

  console.log(data);

 };

 return(

  <div>

   <h2>Shipping Details</h2>

   <input
    placeholder="Address"
    onChange={(e)=>setAddress(e.target.value)}
   />

   <input
    placeholder="City"
    onChange={(e)=>setCity(e.target.value)}
   />

   <input
    placeholder="Pincode"
    onChange={(e)=>setPincode(e.target.value)}
   />

   <button onClick={submit}>
    Continue to Payment
   </button>

  </div>

 );

}