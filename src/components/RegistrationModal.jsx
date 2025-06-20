import React, { useState } from 'react';
import api from '../services/api';

export default function RegistrationModal({ course, onClose }) {
  const [formData, setFormData] = useState({
    // Campos da tabela 'pessoa'
    nomeCompleto: '',
    email: '',
    cpf: '', // O usuário deve fornecer o CPF
    telefone: '',
    dataNascimento: '', // Formato: AAAA-MM-DD
    escolaridade: 'ensino_medio', // Valor padrão
    profissao: '',
    // Este campo será usado para 'ocupacao_atual'
    interesses: '',
    // Campo da tabela 'usuario'
    senha: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Passo 1: Criar a Pessoa
      const pessoaData = {
        nome_completo: formData.nomeCompleto,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''), // Remove caracteres não numéricos do CPF
        telefone: formData.telefone,
        data_nascimento: formData.dataNascimento,
        escolaridade: formData.escolaridade,
        profissao: formData.profissao,
        ocupacao_atual: formData.interesses, // Usando o campo de interesses
      };
      const pessoaResponse = await api.post('/pessoas', pessoaData);
      const novaPessoa = pessoaResponse.data;

      // Passo 2: Criar o Usuário
      const usuarioData = {
        id_pessoa: novaPessoa.id_pessoa,
        senha: formData.senha,
      };
      const usuarioResponse = await api.post('/usuarios', usuarioData);
      const novoUsuario = usuarioResponse.data;

      // Passo 3: Criar a Inscrição no Curso
      const inscricaoData = {
        idUsuario: novoUsuario.id_usuario,
        idCurso: course.id_curso, // Certifique-se que o nome da propriedade está correto
      };
      await api.post('/inscricoes', inscricaoData);

      setSuccess(`Inscrição para o curso "${course.nome}" realizada com sucesso! No prazo de 30 dias enviaremos mais informações.`);
      // Fecha o modal após 5 segundos
      setTimeout(() => {
        onClose();
      }, 5000); 

    } catch (err) {
      console.error("Erro na inscrição:", err);
      const errorMessage = err.response?.data?.message || err.response?.data || "Ocorreu um erro. Verifique os dados e tente novamente.";
      setError(`Falha na inscrição: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#1D3557]">Inscrição: {course.nome}</h2>
          <button onClick={onClose} className="text-2xl font-bold text-gray-500 hover:text-gray-800">×</button>
        </div>
        
        {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{success}</p></div>}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">Preencha os campos abaixo para se inscrever. No prazo de 30 dias, enviaremos mais informações.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="nomeCompleto" placeholder="Nome Completo *" value={formData.nomeCompleto} onChange={handleChange} required className="p-2 border rounded" />
                <input type="email" name="email" placeholder="E-mail *" value={formData.email} onChange={handleChange} required className="p-2 border rounded" />
                <input type="text" name="cpf" placeholder="CPF *" value={formData.cpf} onChange={handleChange} required className="p-2 border rounded" />
                <input type="tel" name="telefone" placeholder="Telefone *" value={formData.telefone} onChange={handleChange} required className="p-2 border rounded" />
                <div>
                    <label htmlFor="dataNascimento" className="text-sm text-gray-600 block">Data de Nascimento *</label>
                    <input type="date" id="dataNascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required className="p-2 border rounded w-full" />
                </div>
                <input type="password" name="senha" placeholder="Crie uma Senha *" value={formData.senha} onChange={handleChange} required className="p-2 border rounded" />
                <select name="escolaridade" value={formData.escolaridade} onChange={handleChange} required className="p-2 border rounded">
                    <option value="sem_escolaridade">Sem Escolaridade</option>
                    <option value="ensino_fundamental">Ensino Fundamental</option>
                    <option value="ensino_medio">Ensino Médio</option>
                    <option value="ensino_tecnico">Ensino Técnico</option>
                    <option value="ensino_superior">Ensino Superior</option>
                    <option value="pos_graduacao">Pós-graduação</option>
                </select>
                <input type="text" name="profissao" placeholder="Profissão *" value={formData.profissao} onChange={handleChange} required className="p-2 border rounded" />
                <textarea name="interesses" placeholder="Descreva seus interesses no curso *" value={formData.interesses} onChange={handleChange} required className="p-2 border rounded md:col-span-2" rows="3"></textarea>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-400">Cancelar</button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-[#F4D35E] text-[#1D3557] rounded-full font-bold hover:bg-[#FFE46B] disabled:bg-gray-400">
                {loading ? 'Enviando...' : 'Confirmar Inscrição'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}