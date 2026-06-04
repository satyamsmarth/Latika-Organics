"use client";

import { useState, useEffect } from "react";

export default function ProductGallery({ images }) {

 const [activeImage, setActiveImage] = useState(null);

 useEffect(() => {
  if (images && images.length > 0) {
   setActiveImage(images[0]);
  }
 }, [images]);

 if (!images || images.length === 0) {
  return (
   <div className="w-[400px] h-[400px] flex items-center justify-center border">
    No Image Available
   </div>
  );
 }

 return (

  <div className="flex gap-6">

   {/* THUMBNAILS */}

   <div className="flex flex-col gap-3">

    {images.map((img, index) => (

     <img
      key={index}
      src={img}
      className="w-20 h-20 object-cover border cursor-pointer hover:border-black"
      onClick={() => setActiveImage(img)}
     />

    ))}

   </div>

   {/* MAIN IMAGE */}

   <div>

    {activeImage && (

     <img
      src={activeImage}
      className="w-[400px] h-[400px] object-cover rounded-lg"
     />

    )}

   </div>

  </div>

 );

}