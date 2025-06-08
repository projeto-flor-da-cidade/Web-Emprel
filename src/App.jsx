// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// 1. Importe o componente Home da sua nova estrutura de pastas
import Home from "./modules/Home/Home"; 
// Se você salvou o Home.jsx em outro lugar, ajuste o caminho acima.

export default function App() {
  return (
    // 2. O componente <Routes> gerencia todas as rotas
    <Routes>
      {/* 3. A rota principal ("/") agora renderiza diretamente a sua nova página Home */}
      <Route path="/" element={<Home />} />

      {/* Por enquanto, não precisamos de outras rotas. 
          Qualquer URL diferente de "/" resultará em uma página em branco,
          o que é perfeito para focar no desenvolvimento da página principal. */}
    </Routes>
  );
}