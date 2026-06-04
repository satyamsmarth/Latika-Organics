"use client";

import { useEffect, useState } from "react";

export default function ManageOperators(){

 const [users,setUsers] = useState([]);
 const [loading,setLoading] = useState(true);
 const [search,setSearch] = useState("");

 const [selectedUser,setSelectedUser] = useState(null);
 const [modalType,setModalType] = useState(null);

 const [form,setForm] = useState({
  name:"",
  email:"",
  phone:"",
  password:""
 });

 const currentUserId =
   typeof window !== "undefined"
     ? JSON.parse(localStorage.getItem("user") || "{}")?._id
     : null;

 useEffect(()=>{
  fetchUsers();
 },[]);

 const fetchUsers = async ()=>{
  try{
   const res = await fetch("https://latika-organics-backend.onrender.com/api/users");
   const data = await res.json();
   setUsers(Array.isArray(data) ? data : data.users || []);
  }catch(e){
   console.log(e);
  }finally{
   setLoading(false);
  }
 };

 /* ================= ROLE ================= */
 const updateRole = async (id, role)=>{
  if(id === currentUserId){
   alert("You cannot change your own role");
   return;
  }

  setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));

  await fetch(`https://latika-organics-backend.onrender.com/api/users/${id}/role`,{
   method:"PUT",
   headers:{ "Content-Type":"application/json" },
   body: JSON.stringify({ role })
  });
 };

 /* ================= MODAL ================= */
 const openModal = (type, user)=>{
  setSelectedUser(user);
  setModalType(type);

  setForm({
   name: user?.name || "",
   email: user?.email || "",
   phone: user?.phone || "",
   password: ""
  });
 };

 const closeModal = ()=>{
  setModalType(null);
  setSelectedUser(null);
 };

 /* ================= SAVE ================= */
 const handleSave = async ()=>{

  try{

   if(modalType === "edit"){

    const payload = {
      name: form.name || "",
      email: form.email || "",
      phone: form.phone || ""
    };

    console.log("SENDING:", payload);

    const res = await fetch(`https://latika-organics-backend.onrender.com/api/users/${selectedUser._id}`,{
     method:"PUT",
     headers:{ "Content-Type":"application/json" },
     body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("RESPONSE:", data);

    if(!res.ok){
      alert(data.message || "Update failed");
      return;
    }
   }

   if(modalType === "password"){

    const res = await fetch(`https://latika-organics-backend.onrender.com/api/users/${selectedUser._id}/password`,{
     method:"PUT",
     headers:{ "Content-Type":"application/json" },
     body: JSON.stringify({ password: form.password })
    });

    if(!res.ok){
      alert("Password update failed");
      return;
    }
   }

   if(modalType === "delete"){

    if(selectedUser._id === currentUserId){
      alert("Cannot delete yourself");
      return;
    }

    const res = await fetch(`https://latika-organics-backend.onrender.com/api/users/${selectedUser._id}`,{
     method:"DELETE"
    });

    if(!res.ok){
      alert("Delete failed");
      return;
    }
   }

   fetchUsers();
   closeModal();

  }catch(err){
   console.log("ERROR:", err);
   alert("Something went wrong");
  }
 };

 /* ================= FILTER ================= */
 const filteredUsers = users.filter(u =>
  (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
  (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
  (u.phone || "").includes(search)
 );

 if(loading){
  return <div className="p-10 text-center">Loading...</div>;
 }

 return(

  <div className="min-h-screen bg-gray-50 p-8">

   <div className="max-w-5xl mx-auto space-y-6">

    <h1 className="text-3xl font-semibold">Manage Operators</h1>

    <input
     placeholder="Search users..."
     value={search}
     onChange={(e)=>setSearch(e.target.value)}
     className="w-full border px-4 py-2 rounded-xl"
    />

    {filteredUsers.map(user => {

     const isCurrent = user._id === currentUserId;

     return(

      <div key={user._id} className="bg-white p-5 rounded-xl shadow flex justify-between">

       <div>
        <p className="font-medium">{user.name || "No Name"}</p>
        <p className="text-sm text-gray-500">{user.phone}</p>
       </div>

       <div className="flex flex-col gap-2 items-end">

        {/* ROLE */}
        <div className="flex gap-2">
         <button
          disabled={isCurrent}
          onClick={()=>updateRole(user._id,"user")}
          className={`px-3 py-1 rounded ${user.role==="user" ? "bg-black text-white" : "bg-gray-200"}`}
         >
          User
         </button>

         <button
          disabled={isCurrent}
          onClick={()=>updateRole(user._id,"admin")}
          className={`px-3 py-1 rounded ${user.role==="admin" ? "bg-black text-white" : "bg-gray-200"}`}
         >
          Admin
         </button>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 text-sm">
         <button onClick={()=>openModal("edit",user)} className="text-blue-600">Edit</button>
         <button onClick={()=>openModal("password",user)} className="text-yellow-600">Password</button>
         <button onClick={()=>openModal("delete",user)} className="text-red-600">Delete</button>
        </div>

       </div>

      </div>
     );
    })}

   </div>

   {/* ================= MODAL ================= */}
   {modalType && (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

     <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

      <h2 className="text-xl font-semibold capitalize">
       {modalType === "edit" && "Edit User"}
       {modalType === "password" && "Change Password"}
       {modalType === "delete" && "Delete User"}
      </h2>

      {modalType === "edit" && (
       <>
        <input
         value={form.name || ""}
         onChange={(e)=>setForm(prev=>({...prev,name:e.target.value}))}
         className="border p-2 w-full"
         placeholder="Name"
        />

        <input
         value={form.email || ""}
         onChange={(e)=>setForm(prev=>({...prev,email:e.target.value}))}
         className="border p-2 w-full"
         placeholder="Email"
        />

        <input
         value={form.phone || ""}
         onChange={(e)=>setForm(prev=>({...prev,phone:e.target.value}))}
         className="border p-2 w-full"
         placeholder="Phone"
        />
       </>
      )}

      {modalType === "password" && (
       <input
        type="password"
        value={form.password}
        onChange={(e)=>setForm(prev=>({...prev,password:e.target.value}))}
        className="border p-2 w-full"
        placeholder="New Password"
       />
      )}

      {modalType === "delete" && (
       <p>Are you sure you want to delete this user?</p>
      )}

      <div className="flex justify-end gap-3">
       <button onClick={closeModal} className="px-4 py-2 border rounded">
        Cancel
       </button>

       <button onClick={handleSave} className="px-4 py-2 bg-black text-white rounded">
        Confirm
       </button>
      </div>

     </div>

    </div>

   )}

  </div>

 );
}