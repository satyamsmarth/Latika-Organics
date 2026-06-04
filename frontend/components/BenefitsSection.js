"use client";

export default function BenefitsSection(){

 return(

  <div style={{
   padding:"60px",
   background:"#f9f9f9",
   textAlign:"center"
  }}>

   <h2>Why Choose Our Oils</h2>

   <div style={{
    display:"flex",
    justifyContent:"center",
    gap:"40px",
    marginTop:"30px"
   }}>

    <div>
     <h3>100% Organic</h3>
     <p>No chemicals or preservatives</p>
    </div>

    <div>
     <h3>Cold Pressed</h3>
     <p>Maximum nutrition retained</p>
    </div>

    <div>
     <h3>Farm Fresh</h3>
     <p>Sourced directly from farmers</p>
    </div>

   </div>

  </div>

 );

}