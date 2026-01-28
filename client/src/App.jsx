import React from 'react'
import Navbar from './components/Navbar'

function ProductCard({ name, price, description }) {
  return (
    <div className="p-6 border border-slate-800 bg-black text-white">
      <h2 className="font-heading text-2xl font-bold mb-2">{name}</h2>

      <p className="font-body text-slate-400 mb-4">{description}</p>

      <div className="flex justify-between items-center">
        <span className="font-code text-green-400 text-lg">${price}</span>
        <button className=" bg-blue-600 px-4 py-2 font-body font-semibold rounded-md">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <div>
      <Navbar />
      <ProductCard name={"Mouse"} price={"29.99"} description={"A high-precision wireless mouse."} />
    </div>
  )
}

export default App