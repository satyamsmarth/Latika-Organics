"use client";

export default function Testimonials(){

 const reviews = [
  {name:"Riya",text:"The best organic oil I have used."},
  {name:"Amit",text:"Very pure and natural taste."},
  {name:"Sneha",text:"Great quality and packaging."}
 ];

 return(

  <div style={{padding:"60px"}}>

   <h2 style={{textAlign:"center"}}>Customer Reviews</h2>

   <div style={{
    display:"flex",
    gap:"20px",
    marginTop:"30px",
    justifyContent:"center"
   }}>

   {reviews.map((r,i)=>(

    <div key={i} style={{
     border:"1px solid #ddd",
     padding:"20px",
     width:"250px"
    }}>

     <p>"{r.text}"</p>

     <strong>{r.name}</strong>

    </div>

   ))}

   </div>

  </div>

 );

}