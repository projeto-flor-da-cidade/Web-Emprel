import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api'; // Usando nosso cliente de API centralizado
import { BsChatDots, BsX, BsSend } from 'react-icons/bs';

// Definição de cores local, para manter consistência com Home.jsx
const colors = {
  primaryDark: '#1d1fa8',
  secondaryYellow: '#d1c517',
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Olá! Sou o Arthur Lucas. Como posso ajudar com suas dúvidas sobre plantas medicinais e PANC's do Recife?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleToggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await api.post('/chat', { query: inputValue });
            const botMessage = { sender: 'bot', text: response.data.answer };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Erro ao se comunicar com a API do chatbot", error);
            const errorMessage = { sender: 'bot', text: 'Desculpe, estou com problemas para me conectar. Tente novamente mais tarde.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Janela do Chat - Responsiva */}
            <div className={`fixed bottom-24 right-4 sm:right-5 w-[90vw] sm:w-96 max-w-lg h-[70vh] sm:h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 transition-all duration-300 ease-in-out ${isOpen ? 'flex opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'}`}>
                {/* Header */}
                <div className="text-white p-4 rounded-t-lg flex justify-between items-center" style={{ backgroundColor: colors.primaryDark }}>
                    <h3 className="font-bold text-lg">Fale com Arthur Lucas</h3>
                    <button onClick={handleToggleChat} className="text-xl hover:opacity-75"><BsX /></button>
                </div>

                {/* Corpo das Mensagens */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                            <div className={`max-w-xs px-4 py-2 rounded-2xl`} style={{
                                backgroundColor: msg.sender === 'user' ? colors.secondaryYellow : '#E5E7EB',
                                color: msg.sender === 'user' ? colors.primaryDark : '#1F2937',
                            }}>
                                <p className="text-sm break-words">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-3">
                            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl animate-pulse">Digitando...</div>
                        </div>
                    )}
                    <div ref={messageEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                        <input
                            type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Digite sua pergunta..."
                            className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2"
                            style={{ '--tw-ring-color': colors.primaryDark }} // Custom ring color
                            disabled={isLoading}
                        />
                        <button type="submit" className="text-white px-4 py-3 rounded-r-md hover:bg-opacity-90 disabled:bg-gray-400" style={{ backgroundColor: isLoading ? '#9CA3AF' : colors.primaryDark }} disabled={isLoading}>
                            <BsSend />
                        </button>
                    </form>
                </div>
            </div>

            {/* Botão Flutuante */}
            <button
                onClick={handleToggleChat}
                className="fixed bottom-5 right-5 text-white rounded-full p-4 shadow-2xl z-40 text-3xl hover:opacity-90 transition-transform hover:scale-110"
                style={{ backgroundColor: colors.primaryDark }}
                aria-label="Abrir chat"
            >
                {isOpen ? <BsX /> : <BsChatDots />}
            </button>
        </>
    );
};

export default Chatbot;