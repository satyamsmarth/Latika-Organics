export const searchProducts = async (query) => {

 const res = await fetch(`https://latika-organics-backend.onrender.com/api/products`);

 const products = await res.json();

 if(!query) return products;

 return products.filter(product =>
  product.name.toLowerCase().includes(query.toLowerCase())
 );

};