import axios from 'axios';

// Instância Axios pré-configurada para o nosso backend
const api = axios.create({
  // A porta correta do seu backend Spring Boot é 8081
  baseURL: 'http://localhost:8081/api',
  // Aumentado para 15 segundos para dar tempo suficiente para a API da OpenAI responder
  timeout: 15000,
});

export default api;