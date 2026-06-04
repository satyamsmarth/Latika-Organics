"use client";

export default function CartSummary({cartItems}){

 const total = cartItems.reduce(
  (sum,item)=>sum + item.price * item.quantity,
  0
 );

 return(

  <div>

   <h2>Order Summary</h2>

   {cartItems.map(item=>(
    <div key={item._id}>

     <p>{item.name}</p>

     <p>{item.quantity} × ₹{item.price}</p>

    </div>
   ))}

   <h3>Total ₹{total}</h3>

  </div>

 );

}