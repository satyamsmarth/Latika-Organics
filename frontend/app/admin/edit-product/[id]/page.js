"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct(){

 const { id } = useParams();
 const router = useRouter();

 const [name,setName] = useState("");
 const [price,setPrice] = useState("");
 const [description,setDescription] = useState("");
 const [stock,setStock] = useState("");

 // 🔥 IMAGES
 const [existingImages,setExistingImages] = useState([]);
 const [removedImages,setRemovedImages] = useState([]);

 const [newImages,setNewImages] = useState([]);
 const [newPreviews,setNewPreviews] = useState([]);

 useEffect(()=>{

  fetch(`https://latika-organics-backend.onrender.com/api/products/${id}`)
   .then(res=>res.json())
   .then(data=>{

    setName(data.name);
    setPrice(data.price);
    setDescription(data.description);
    setStock(data.stock);

    setExistingImages(data.images || []);

   });

 },[id]);

 /* ================= ADD NEW IMAGES ================= */

 const handleNewImages = (files) => {

  const arr = Array.from(files);

  setNewImages(prev => [...prev, ...arr]);

  const previews = arr.map(f => URL.createObjectURL(f));
  setNewPreviews(prev => [...prev, ...previews]);

 };

 /* ================= REMOVE EXISTING ================= */

 const removeExistingImage = (img) => {

  setRemovedImages([...removedImages, img]);
  setExistingImages(existingImages.filter(i => i !== img));

 };

 /* ================= REMOVE NEW ================= */

 const removeNewImage = (index) => {

  const imgs = [...newImages];
  const prev = [...newPreviews];

  imgs.splice(index,1);
  prev.splice(index,1);

  setNewImages(imgs);
  setNewPreviews(prev);

 };

 /* ================= UPDATE ================= */

 const updateProduct = async(e)=>{

  e.preventDefault();

  const formData = new FormData();

  formData.append("name",name);
  formData.append("price",price);
  formData.append("description",description);
  formData.append("stock",stock);

  formData.append("existingImages", JSON.stringify(existingImages));
  formData.append("removedImages", JSON.stringify(removedImages));

  newImages.forEach(img=>{
   formData.append("images", img);
  });

  await fetch(`https://latika-organics-backend.onrender.com/api/products/${id}`,{
   method:"PUT",
   body:formData
  });

  alert("Product Updated");
  router.push("/admin/products");

 };

 /* ================= UI ================= */

 return(

  <div className="min-h-screen bg-gray-50 p-8">

   <div className="max-w-5xl mx-auto space-y-8">

    <h1 className="text-3xl font-semibold text-gray-800">
     Edit Product
    </h1>

    <form onSubmit={updateProduct} className="space-y-8">

     {/* 🔥 IMAGE GALLERY */}
     <div className="bg-white p-6 rounded-2xl shadow border">

      <p className="font-medium mb-4">Product Images</p>

      {/* EXISTING */}
      <div className="grid grid-cols-4 gap-4 mb-4">

       {existingImages.map((img,i)=>(
        <div key={i} className="relative group">

         <img
          src={img}
          className="w-full h-24 object-cover rounded-lg"
         />

         <button
          type="button"
          onClick={()=>removeExistingImage(img)}
          className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 rounded opacity-0 group-hover:opacity-100"
         >
          ✕
         </button>

        </div>
       ))}

      </div>

      {/* NEW */}
      <div className="grid grid-cols-4 gap-4 mb-4">

       {newPreviews.map((img,i)=>(
        <div key={i} className="relative group">

         <img
          src={img}
          className="w-full h-24 object-cover rounded-lg"
         />

         <button
          type="button"
          onClick={()=>removeNewImage(i)}
          className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded opacity-0 group-hover:opacity-100"
         >
          ✕
         </button>

        </div>
       ))}

      </div>

      {/* UPLOAD */}
      <label className="flex items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50">

       <span className="text-gray-500 text-sm">
        Click or drag to upload images
       </span>

       <input
        type="file"
        multiple
        className="hidden"
        onChange={(e)=>handleNewImages(e.target.files)}
       />

      </label>

     </div>

     {/* INFO */}
     <div className="bg-white p-6 rounded-2xl shadow border space-y-4">

      <input
       value={name}
       onChange={(e)=>setName(e.target.value)}
       placeholder="Product Name"
       className="w-full border p-3 rounded-lg"
      />

      <div className="grid grid-cols-2 gap-4">

       <input
        type="number"
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
        placeholder="Price"
        className="border p-3 rounded-lg"
       />

       <input
        type="number"
        value={stock}
        onChange={(e)=>setStock(e.target.value)}
        placeholder="Stock"
        className="border p-3 rounded-lg"
       />

      </div>

      <textarea
       value={description}
       onChange={(e)=>setDescription(e.target.value)}
       placeholder="Description"
       className="border p-3 rounded-lg"
      />

     </div>

     {/* SUBMIT */}
     <button
      className="w-full bg-green-600 text-white py-3 rounded-xl text-lg 
      hover:bg-green-700 transition shadow-md"
     >
      Update Product
     </button>

    </form>

   </div>

  </div>

 );

}