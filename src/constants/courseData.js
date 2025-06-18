// src/constants/courseData.js

import cardImage1 from '../assets/images/horta.jpg';
import cardImage2 from '../assets/images/alface.jpg';
import cardImage3 from '../assets/images/aula.jpg';

const courseData = [
  { id: 1, tipo: 'Curso', nome: 'Agroecologia para Iniciantes', local: 'Parque da Jaqueira', instituicao: 'SEAU', publicoAlvo: 'Todos os públicos', inscricaoInicio: '01/08/2024', inscricaoFim: '15/08/2024', cursoInicio: '20/08/2024', cursoFim: '20/09/2024', turno: 'Manhã', maxPessoas: 30, cargaHoraria: 40, img: cardImage1, alt: 'Pessoa trabalhando na horta' },
  { id: 2, tipo: 'Oficina', nome: 'Compostagem Doméstica', local: 'Online (Zoom)', instituicao: 'SEAU', publicoAlvo: 'Moradores de apartamento', inscricaoInicio: '10/08/2024', inscricaoFim: '25/08/2024', cursoInicio: '01/09/2024', cursoFim: '01/09/2024', turno: 'Tarde', maxPessoas: 50, cargaHoraria: 4, img: cardImage2, alt: 'Mão com terra' },
  { id: 3, tipo: 'Curso', nome: 'Cultivo de PANCs', local: 'Horta de Casa Amarela', instituicao: 'SEAU', publicoAlvo: 'Hortelões e entusiastas', inscricaoInicio: '15/08/2024', inscricaoFim: '30/08/2024', cursoInicio: '05/09/2024', cursoFim: '26/09/2024', turno: 'Manhã', maxPessoas: 25, cargaHoraria: 32, img: cardImage3, alt: 'Aula de agroecologia' },
  { id: 4, tipo: 'Oficina', nome: 'Jardinagem Vertical', local: 'Sede da Prefeitura', instituicao: 'Jardim Urbano Co.', publicoAlvo: 'Interessados em pequenos espaços', inscricaoInicio: '20/08/2024', inscricaoFim: '05/09/2024', cursoInicio: '10/09/2024', cursoFim: '10/09/2024', turno: 'Tarde', maxPessoas: 40, cargaHoraria: 3, img: cardImage1, alt: 'Horta comunitária' },
  { id: 5, tipo: 'Curso', nome: 'Manejo de Pragas Orgânico', local: 'UFPE - Campus Recife', instituicao: 'Universidade Federal de Pernambuco', publicoAlvo: 'Estudantes e agricultores', inscricaoInicio: '01/09/2024', inscricaoFim: '15/09/2024', cursoInicio: '22/09/2024', cursoFim: '13/10/2024', turno: 'Integral', maxPessoas: 20, cargaHoraria: 60, img: cardImage2, alt: 'Mãos segurando planta' },
];

export const seauCourses = courseData.filter(c => c.instituicao === 'SEAU');
export const externalCourses = courseData.filter(c => c.instituicao !== 'SEAU');