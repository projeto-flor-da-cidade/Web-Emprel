import React, { useState, useEffect, useCallback } from 'react';

// Ícones
import { 
  FaChevronDown, 
  FaSearchPlus, 
  FaSearchMinus, 
  FaAdjust, 
  FaTimes, 
  FaVolumeUp, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

// Componentes de Terceiros
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Assets (Imagens e Vídeos)
import logoSeau from '../../assets/images/logo_seau.png';
import logoInfo from '../../assets/images/logo_info.png';
import cardImage1 from '../../assets/images/horta.jpg';
import cardImage2 from '../../assets/images/alface.jpg';
import cardImage3 from '../../assets/images/aula.jpg';
import videoSeau from '../../assets/videos/Video_seau.mp4';
import adrianaImg from '../../assets/images/adrianafigueira.jpg';
import logoWpp from '../../assets/images/logo-wpp.png';
import logoInstagram from '../../assets/images/Logo_Instagram.png';

// Correção do ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// DADOS PARA OS CARDS DE SERVIÇOS
const serviceCards = [
  {
    img: cardImage1,
    alt: 'Pessoa trabalhando na horta',
    title: 'Apoio Para Hortas',
    text: 'Solicite apoio técnico para iniciar ou manter sua horta comunitária.',
    href: '#detalhe1'
  },
  {
    img: cardImage2,
    alt: 'Mãos segurando planta',
    title: 'Cursos e Oficinas',
    text: 'Conheça nossos cursos e oficinas sobre agroecologia e cultivo urbano.',
    href: '#Cursos'
  },
  {
    img: cardImage3,
    alt: 'Aula de agroecologia',
    title: 'Novidades',
    text: 'Atualize-se com nossas novidades e práticas em agroecologia.',
    href: '#detalhe3'
  }
];

// DADOS DETALHADOS PARA OS CURSOS
const courseData = [
  { id: 1, tipo: 'Curso', nome: 'Agroecologia para Iniciantes', local: 'Parque da Jaqueira', instituicao: 'SEAU', publicoAlvo: 'Todos os públicos', inscricaoInicio: '01/08/2024', inscricaoFim: '15/08/2024', cursoInicio: '20/08/2024', cursoFim: '20/09/2024', turno: 'Manhã', maxPessoas: 30, cargaHoraria: 40, img: cardImage1, alt: 'Pessoa trabalhando na horta' },
  { id: 2, tipo: 'Oficina', nome: 'Compostagem Doméstica', local: 'Online (Zoom)', instituicao: 'SEAU', publicoAlvo: 'Moradores de apartamento', inscricaoInicio: '10/08/2024', inscricaoFim: '25/08/2024', cursoInicio: '01/09/2024', cursoFim: '01/09/2024', turno: 'Tarde', maxPessoas: 50, cargaHoraria: 4, img: cardImage2, alt: 'Mão com terra' },
  { id: 3, tipo: 'Curso', nome: 'Cultivo de PANCs', local: 'Horta de Casa Amarela', instituicao: 'SEAU', publicoAlvo: 'Hortelões e entusiastas', inscricaoInicio: '15/08/2024', inscricaoFim: '30/08/2024', cursoInicio: '05/09/2024', cursoFim: '26/09/2024', turno: 'Manhã', maxPessoas: 25, cargaHoraria: 32, img: cardImage3, alt: 'Aula de agroecologia' },
  { id: 4, tipo: 'Oficina', nome: 'Jardinagem Vertical', local: 'Sede da Prefeitura', instituicao: 'Jardim Urbano Co.', publicoAlvo: 'Interessados em pequenos espaços', inscricaoInicio: '20/08/2024', inscricaoFim: '05/09/2024', cursoInicio: '10/09/2024', cursoFim: '10/09/2024', turno: 'Tarde', maxPessoas: 40, cargaHoraria: 3, img: cardImage1, alt: 'Horta comunitária' },
  { id: 5, tipo: 'Curso', nome: 'Manejo de Pragas Orgânico', local: 'UFPE - Campus Recife', instituicao: 'Universidade Federal de Pernambuco', publicoAlvo: 'Estudantes e agricultores', inscricaoInicio: '01/09/2024', inscricaoFim: '15/09/2024', cursoInicio: '22/09/2024', cursoFim: '13/10/2024', turno: 'Integral', maxPessoas: 20, cargaHoraria: 60, img: cardImage2, alt: 'Mãos segurando planta' },
];

const seauCourses = courseData.filter(c => c.instituicao === 'SEAU');
const externalCourses = courseData.filter(c => c.instituicao !== 'SEAU');

// Componente do Modal de Cursos
const CourseModal = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-[1001] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="course-modal-content w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors">
          <FaTimes size={24} />
        </button>
        
        <span className="inline-block bg-[#F4D35E] text-[#1D3557] font-bold text-sm px-3 py-1 rounded-full mb-4">
          {course.tipo}
        </span>
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-4">{course.nome}</h2>
        
        <div className="space-y-4 text-gray-700">
          <div className="flex items-center gap-3 text-lg">
            <FaMapMarkerAlt className="text-[#F4D35E] flex-shrink-0" /> 
            <span>{course.local}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border-t border-gray-200 pt-4 mt-4">
            <p><strong>Instituição:</strong> {course.instituicao}</p>
            <p><strong>Público-alvo:</strong> {course.publicoAlvo}</p>
            <p><strong>Inscrições:</strong> {course.inscricaoInicio} a {course.inscricaoFim}</p>
            <p><strong>Período do curso:</strong> {course.cursoInicio} a {course.cursoFim}</p>
            <p><strong>Turno:</strong> {course.turno}</p>
            <p><strong>Vagas:</strong> Até {course.maxPessoas} pessoas</p>
            <p className="md:col-span-2"><strong>Carga Horária:</strong> {course.cargaHoraria} horas</p>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="mt-8 w-full md:w-auto float-right rounded-lg bg-[#1D3557] text-white px-6 py-2 font-bold transition hover:bg-opacity-90"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

// Componente do Mapa
const MapComponent = () => {
  const position = [-8.05428, -34.8813];
  return (
    <div className="relative z-0 w-full h-[400px] rounded-2xl shadow-lg overflow-hidden mb-8">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}><Popup>Prefeitura do Recife. <br /> Sede da SEAU.</Popup></Marker>
      </MapContainer>
    </div>
  );
};

// Componente do Menu de Acessibilidade
const AccessibilityMenu = ({ onClose, fontHandlers, darkModeHandler, ttsHandler }) => {
  return (
    <div className="absolute top-full right-4 mt-2 w-72 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 text-[#1D3557] z-[1000]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Acessibilidade</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FaTimes size={20} /></button>
      </div>
      <ul className="space-y-2">
        <li><button onClick={fontHandlers.increase} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"><FaSearchPlus /> Aumentar Fonte</button></li>
        <li><button onClick={fontHandlers.decrease} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"><FaSearchMinus /> Diminuir Fonte</button></li>
        <li><button onClick={darkModeHandler.toggle} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"><FaAdjust /> {darkModeHandler.isDarkMode ? 'Desativar' : 'Ativar'} Modo Noturno</button></li>
        <li><button onClick={ttsHandler.toggle} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"><FaVolumeUp /> {ttsHandler.isTtsEnabled ? 'Desativar' : 'Ativar'} Leitura por Voz</button></li>
      </ul>
      <button onClick={onClose} className="mt-4 w-full rounded-lg bg-[#F4D35E] px-4 py-2 font-bold text-[#1D3557] transition hover:bg-[#e5c94f]">Fechar</button>
    </div>
  );
};

// Componente Principal da Página
export default function Home() {
  const [isAccessibilityMenuOpen, setAccessibilityMenuOpen] = useState(false);
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [isDarkMode, setDarkMode] = useState(false);
  const [isTtsEnabled, setTtsEnabled] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Efeito para o tamanho da fonte
  useEffect(() => {
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  }, [baseFontSize]);

  // Efeito para o Modo Noturno
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  // Lógica para Leitura por Voz (TTS)
  const handleTtsMouseOver = useCallback((event) => {
    if (!isTtsEnabled) return;

    const target = event.target;
    const readableTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'LI', 'BUTTON', 'SUMMARY'];

    if (readableTags.includes(target.tagName) && target.innerText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(target.innerText);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  }, [isTtsEnabled]);

  useEffect(() => {
    document.addEventListener('mouseover', handleTtsMouseOver);
    return () => {
      document.removeEventListener('mouseover', handleTtsMouseOver);
      window.speechSynthesis.cancel();
    };
  }, [handleTtsMouseOver]);

  const sliderSettings = {
    dots: true, infinite: true, speed: 500, slidesToShow: 3, slidesToScroll: 1, autoplay: true, autoplaySpeed: 3000,
    responsive: [ { breakpoint: 1024, settings: { slidesToShow: 2 } }, { breakpoint: 768, settings: { slidesToShow: 1 } } ],
  };
  
  const fontHandlers = {
    increase: () => setBaseFontSize(size => Math.min(size + 2, 24)),
    decrease: () => setBaseFontSize(size => Math.max(size - 2, 12)),
  };

  const darkModeHandler = {
    toggle: () => setDarkMode(prev => !prev),
    isDarkMode,
  };

  const ttsHandler = {
    toggle: () => setTtsEnabled(prev => !prev),
    isTtsEnabled,
  };

  return (
    <div className="font-sans bg-[#F9FAFB] text-[#1D3557]">
      <header className="bg-[#1D3557] text-white shadow-md sticky top-0 z-[999]">
        <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between p-4 md:px-8">
          <div className="flex-shrink-0"><img src={logoSeau} alt="Logo Flor da Cidade" className="h-16" /></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"><h1 className="text-2xl md:text-3xl font-bold">Flor da Cidade</h1></div>
          <div className="flex items-center gap-4">
            <a href="#detalhe4" className="flex items-center gap-2 rounded-lg bg-[#F4D35E] px-4 py-2 font-bold text-[#1D3557] transition hover:bg-[#e5c94f]"><img src={logoInfo} alt="Informações" className="h-5" /> <span className="hidden sm:inline">Sobre</span></a>
            <button onClick={() => setAccessibilityMenuOpen(prev => !prev)} className="hidden rounded-lg bg-[#F4D35E] px-4 py-2 font-bold text-[#1D3557] transition hover:bg-[#e5c94f] md:block">Acessibilidade</button>
          </div>
          {isAccessibilityMenuOpen && <AccessibilityMenu onClose={() => setAccessibilityMenuOpen(false)} fontHandlers={fontHandlers} darkModeHandler={darkModeHandler} ttsHandler={ttsHandler} />}
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-4 space-y-12 md:space-y-16 my-8">
        <section className="text-center py-3">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1D3557]">Bem-vindo ao Portal Flor da Cidade</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Sua plataforma completa para a agricultura urbana no Recife. Explore nossos serviços, cursos e novidades para cultivar um futuro mais verde e sustentável.</p>
        </section>

        <section className="w-full bg-[#adcbe3] py-12 md:py-10 rounded-3xl shadow-inner">
          <h2 className="text-4xl font-extrabold text-center text-[#1D3557] mb-10">Nossos Serviços</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
            {serviceCards.map((card, i) => (
              <div key={i} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <img src={card.img} alt={card.alt} className="h-48 w-full object-cover" />
                <div className="flex flex-1 flex-col bg-[#e7eff6] justify-between p-5">
                  <div>
                    <h3 className="text-xl font-bold text-[#1D3557] mb-2">{card.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{card.text}</p>
                  </div>
                  <a href={card.href} className="self-start rounded-full bg-[#F4D35E] px-5 py-2 font-bold text-sm text-[#1D3557] transition-colors duration-300 group-hover:bg-[#FFE46B]">Saiba mais</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="detalhe1" className="bg-[#adcbe3] py-12 md:py-16 rounded-3xl shadow-inner px-4 md:px-8">
          <MapComponent />
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1D3557] mb-6">Solicite Apoio Para Sua Horta</h2>
            <p className="font-semibold mb-4 text-lg">Requisitos para solicitar a implantação ou apoio:</p>
            <ol className="list-decimal list-outside inline-block text-left ml-5 space-y-2 mb-8 text-gray-700">
              <li>Ser uma instituição pública ou organização comunitária.</li>
              <li>Ter no mínimo 3 participantes engajados no projeto.</li>
              <li>Dispor de um espaço com acesso à água e sol.</li>
            </ol>
            <div>
              <a href="#" className="inline-block rounded-full bg-[#F4D35E] px-8 py-3 font-bold text-[#1D3557] text-lg transition-transform duration-300 hover:scale-105 hover:bg-[#FFE46B]">Solicitar Acompanhamento!</a>
            </div>
          </div>
        </section>

        <section id="Cursos" className="space-y-12">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-[#1D3557] mb-6 text-center">Nossos Cursos SEAU</h2>
            <Slider {...sliderSettings}>
              {seauCourses.map((course) => (
                <div key={course.id} className="px-3">
                  <div className="group flex h-96 flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300">
                    <img src={course.img} alt={course.alt} className="h-40 w-full object-cover" />
                    <div className="flex flex-1 flex-col bg-[#e7eff6] justify-between p-4">
                      <h3 className="text-lg font-bold text-[#1D3557]">{course.nome}</h3>
                      <p className="text-sm text-gray-600 flex-1">{course.instituicao}</p>
                      <button onClick={() => setSelectedCourse(course)} className="mt-2 self-center rounded-full bg-[#F4D35E] px-4 py-1.5 font-bold text-sm text-[#1D3557] transition-colors duration-300 group-hover:bg-[#FFE46B]">Ver Detalhes</button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          <div className="w-full">
            <h2 className="text-3xl font-bold text-[#1D3557] mb-6 text-center">Nossos Cursos Externos</h2>
            <Slider {...sliderSettings}>
              {externalCourses.map((course) => (
                <div key={course.id} className="px-3">
                  <div className="group flex h-96 flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300">
                    <img src={course.img} alt={course.alt} className="h-40 w-full object-cover" />
                    <div className="flex flex-1 flex-col bg-[#e7eff6] justify-between p-4">
                      <h3 className="text-lg font-bold text-[#1D3557]">{course.nome}</h3>
                      <p className="text-sm text-gray-600 flex-1">{course.instituicao}</p>
                      <button onClick={() => setSelectedCourse(course)} className="mt-2 self-center rounded-full bg-[#F4D35E] px-4 py-1.5 font-bold text-sm text-[#1D3557] transition-colors duration-300 group-hover:bg-[#FFE46B]">Ver Detalhes</button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <section id="detalhe3" className="bg-[#adcbe3] py-12 md:py-16 rounded-3xl shadow-inner px-4 md:px-8">
          <h2 className="text-3xl font-bold text-[#1D3557] mb-10 text-center">Informativos SEAU</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
            <div className="w-full md:w-1/3"><video controls playsInline className="w-full rounded-xl shadow-lg"><source src={videoSeau} type="video/mp4" />Seu navegador não suporta o vídeo.</video></div>
            <div className="w-full md:w-1/3 text-center md:text-left"><h3 className="text-2xl font-semibold mb-2">Dia Mundial da Abelha</h3><p className="text-gray-600">As abelhas são essenciais para a polinização de diversas culturas, garantindo a produção de alimentos e a biodiversidade. Proteger as abelhas é proteger nosso futuro.</p></div>
            <div className="w-full md:w-1/3 flex justify-center md:justify-end"><a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="inline-block rounded-full bg-[#F4D35E] px-8 py-3 font-bold text-[#1D3557] text-lg transition-transform duration-300 hover:scale-105 hover:bg-[#FFE46B]">Ver no YouTube</a></div>
          </div>
        </section>

        <section id="detalhe4" className="bg-green-50 py-12 md:py-16 rounded-3xl shadow-inner px-4 md:px-8">
          <div className="md:flex md:items-start md:gap-12">
            <div className="text-center md:text-left flex-shrink-0"><img src={adrianaImg} alt="Retrato de Adriana Figueira" className="w-48 h-48 object-cover rounded-full mx-auto mb-6 shadow-lg" /><h2 className="text-3xl font-bold text-[#1D3557]">Adriana Figueira</h2><p className="text-lg text-[#F4D35E] font-semibold">Secretária Executiva</p></div>
            <div className="mt-6 md:mt-0"><p className="text-justify mb-4 text-gray-700">Graduada em Arquitetura e Urbanismo pela UFPE (1983), com mestrado em Desenvolvimento Urbano (2000), atua na Urb Recife desde 1986. Hoje, como Secretária Executiva de Agricultura Urbana, lidera a missão de fomentar práticas sustentáveis.</p><div className="border-t pt-6 mt-6"><h3 className="text-2xl font-bold text-[#1D3557] mb-4">Contato SEAU</h3><div className="space-y-2 text-gray-700"><p><span className="font-semibold text-[#1D3557]">Endereço:</span> Prefeitura do Recife - Av. Cais do Apolo, 925, 5º andar, Recife/PE</p><p><span className="font-semibold text-[#1D3557]">Telefone:</span> (81) 3355-8606</p><p><span className="font-semibold text-[#1D3557]">E-mail:</span> agriculturaurbana@recife.pe.gov.br</p></div></div></div>
          </div>
        </section>

        <section id="faq" className="py-12 md:py-16">
          <h2 className="text-4xl font-extrabold text-[#1D3557] text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            <details className="group bg-white p-6 rounded-lg shadow-lg"><summary className="font-semibold text-lg text-[#1D3557] cursor-pointer list-none flex justify-between items-center">Quem somos nós?<FaChevronDown className="transform transition-transform duration-300 group-open:rotate-180" /></summary><p className="mt-4 text-gray-600 text-justify">A Secretaria Executiva de Agricultura Urbana (SEAU) promove ações agroecológicas e desenvolvimento sustentável para o Recife.</p></details>
            <details className="group bg-white p-6 rounded-lg shadow-lg"><summary className="font-semibold text-lg text-[#1D3557] cursor-pointer list-none flex justify-between items-center">Como solicitar apoio para minha horta?<FaChevronDown className="transform transition-transform duration-300 group-open:rotate-180" /></summary><p className="mt-4 text-gray-600">Acesse a seção "Solicite Apoio", verifique os requisitos e clique no botão para preencher o formulário.</p></details>
            <details className="group bg-white p-6 rounded-lg shadow-lg"><summary className="font-semibold text-lg text-[#1D3557] cursor-pointer list-none flex justify-between items-center">Quais cursos estão disponíveis?<FaChevronDown className="transform transition-transform duration-300 group-open:rotate-180" /></summary><p className="mt-4 text-gray-600">Oferecemos cursos sobre Agroecologia, Quintais Produtivos, Ervas Medicinais, PANCs, e mais.</p></details>
          </div>
        </section>
      </main>

      <footer className="bg-[#1D3557] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between p-6 md:flex-row md:px-8 space-y-4 md:space-y-0">
          <img src={logoSeau} alt="Logo Flor da Cidade" className="h-12" />
          <p className="text-sm text-gray-300">© {new Date().getFullYear()} Flor da Cidade. Todos os direitos reservados.</p>
          <div className="flex gap-4"><a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="transition transform hover:scale-110"><img src={logoWpp} alt="WhatsApp" className="h-8" /></a><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition transform hover:scale-110"><img src={logoInstagram} alt="Instagram" className="h-8" /></a></div>
        </div>
      </footer>

      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}