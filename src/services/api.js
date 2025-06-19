// src/services/api.js

import axios from 'axios';

const api = axios.create({
  // ALTERE A PORTA AQUI DE 8080 PARA 8082
  baseURL: 'http://localhost:8082/api',
  timeout: 5000,
});

export default api;