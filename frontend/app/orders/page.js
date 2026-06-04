"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/utils/socket"; // ✅ added
import toast from "react-hot-toast"; // ✅ optional notification

export default function Orders(){

 const router = useRouter();

 const [orders,setOrders] = useState([]);

 useEffect(()=>{

  const token = localStorage.getItem("token");

  if(!token){
   router.push("/login");
   return;
  }

  // 🔥 FETCH INITIAL ORDERS
  const fetchOrders = () => {
    fetch("https://latika-organics-backend.onrender.com/api/orders/my-orders",{
      headers:{
        Authorization:"Bearer "+token
      }
    })
    .then(res=>res.json())
    .then(data=>setOrders(Array.isArray(data)?data:[]));
  };

  fetchOrders();

  // 🔥 SOCKET CONNECTION
  const socket = getSocket();

  socket.on("connect", () => {
    console.log("🟢 Connected (User Orders):", socket.id);
  });

  // 🔥 REAL-TIME ORDER UPDATE
  socket.on("newOrder", (order) => {

    console.log("🔥 New Order Received (User):", order);

    // Optional: notify only if it's user's order
    // (assuming order has userId)
    const userId = localStorage.getItem("userId");

    if (order.userId && order.userId === userId) {

      toast.success("🛒 Your order has been placed!");

      setOrders(prev => {
        const exists = prev.find(o => o._id === order._id);
        if (exists) return prev;
        return [order, ...prev];
      });
    }
  });

  return () => {
    socket.off("newOrder");
  };

 },[]);

 return(

  <div style={{padding:"40px"}}>

   <h1>My Orders</h1>

   {orders.map(order=>(

    <div key={order._id} style={{
     border:"1px solid #ccc",
     padding:"20px",
     marginBottom:"20px"
    }}>

     <h3>Order ID: {order._id}</h3>

     <p>Total: ₹{order.totalPrice || order.total}</p>

     <p>Status: {order.status}</p>

    </div>

   ))}

  </div>

 );

}