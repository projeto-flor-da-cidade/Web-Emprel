import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./modules/Home/Home";
import Chatbot from "./components/Chatbot"; // Importe o componente do chatbot

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Outras páginas podem ser adicionadas aqui no futuro */}
      </Routes>
      
      {/* O Chatbot é renderizado aqui, fora do sistema de rotas, 
          para que ele persista em todas as páginas da sua aplicação. */}
      <Chatbot />
    </div>
  );
}