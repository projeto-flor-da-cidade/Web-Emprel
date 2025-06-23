import React, { useState, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import { FaChevronDown } from 'react-icons/fa';

import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import CourseModal from '../../components/CourseModal.jsx';
import MapComponent from '../../components/MapComponent.jsx';

// Importe api e BACKEND_URL se for usar para construir a URL da imagem.
// Se api.defaults.baseURL já está configurado corretamente, pode não precisar de BACKEND_URL aqui.
import api from '../../services/api.js'; 
import { serviceCards } from '../../constants/servicesData.js';
import { medicinalPlantsData, recipesData, rpaData } from '../../constants/pancsData.js';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import videoSeau from '../../assets/videos/Video_seau.mp4';
import adrianaImg from '../../assets/images/adrianafigueira.jpg';
// fallbackImage é o placeholder LOCAL do frontend, usado se o do servidor falhar.
import fallbackImage from '../../assets/images/FolhinSemImagem.png'; // Garanta que este caminho está correto

// --- Constantes para a lógica do placeholder ---
const PLACEHOLDER_FILENAME_FROM_BACKEND = "folhin.png";
const COURSE_BANNER_UPLOAD_PATH_SEGMENT = "banners";
// URL base do backend para imagens. Se api.defaults.baseURL já inclui /api, remova.
// Caso contrário, se api.defaults.baseURL é só http://localhost:8080, mantenha.
// O ideal é ter uma constante BACKEND_ASSET_URL ou similar.
const BACKEND_IMAGE_BASE_URL = api.defaults.baseURL.replace('/api', ''); // Ajuste se necessário

const SERVER_COURSE_PLACEHOLDER_URL = `${BACKEND_IMAGE_BASE_URL}/uploads/${COURSE_BANNER_UPLOAD_PATH_SEGMENT}/${PLACEHOLDER_FILENAME_FROM_BACKEND}`;
// --- Fim das constantes ---


export default function Home() {
  const [seauCourses, setSeauCourses] = useState([]);
  const [externalCourses, setExternalCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isAccessibilityMenuOpen, setAccessibilityMenuOpen] = useState(false);
  const [baseFontSize, setBaseFontSize] = useState(12.5); // Ajustado para o valor numérico
  const [isDarkMode, setDarkMode] = useState(false);
  const [isTtsEnabled, setTtsEnabled] = useState(false);
  const [activePlantTab, setActivePlantTab] = useState('manjericao'); // Chave inicial
  const [areRecipesOpen, setAreRecipesOpen] = useState(false);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/cursos'); // Endpoint para buscar todos os cursos
        const allCourses = response.data;
        // Filtra apenas cursos ativos
        const activeCourses = allCourses.filter(course => course.ativo);
        
        setSeauCourses(activeCourses.filter(c => c.instituicao === 'SEAU'));
        setExternalCourses(activeCourses.filter(c => c.instituicao !== 'SEAU'));
        setError(null);
      } catch (err) {
        console.error("Erro detalhado ao buscar cursos:", err);
        if (err.response) {
          setError(`Erro do servidor: ${err.response.status}. Tente novamente mais tarde.`);
        } else if (err.request) {
          setError('Não foi possível conectar ao servidor. Verifique se a API está online.');
        } else {
          setError('Ocorreu um erro inesperado. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  }, [baseFontSize]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleTtsMouseOver = useCallback((event) => {
    if (!isTtsEnabled) return;
    const target = event.target;
    // Ampliando a lista de tags e verificando se há texto
    const readableTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'LI', 'BUTTON', 'SUMMARY', 'SPAN', 'DIV'];
    let textToSpeak = target.innerText || target.alt || target.title;

    // Tenta pegar de elementos filhos se o target direto não tiver texto útil
    if (!textToSpeak && target.children.length > 0) {
        for (let child of target.children) {
            if (child.innerText) {
                textToSpeak = child.innerText;
                break;
            }
        }
    }
    
    if (readableTags.includes(target.tagName) && textToSpeak && textToSpeak.trim().length > 0) {
      window.speechSynthesis.cancel(); // Cancela falas anteriores
      const utterance = new SpeechSynthesisUtterance(textToSpeak.trim());
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  }, [isTtsEnabled]);

  useEffect(() => {
    document.addEventListener('mouseover', handleTtsMouseOver);
    return () => {
      document.removeEventListener('mouseover', handleTtsMouseOver);
      window.speechSynthesis.cancel(); // Limpa qualquer fala pendente ao desmontar
    };
  }, [handleTtsMouseOver]); // handleTtsMouseOver agora está no array de dependências


  const sliderSettings = {
    dots: true,
    infinite: false, // Se houver poucos itens, não faz loop infinito
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };
  
  const fontHandlers = {
    increase: () => setBaseFontSize(size => Math.min(size + 2, 24)),
    decrease: () => setBaseFontSize(size => Math.max(size - 2, 12)), // Mínimo 12
  };

  const darkModeHandler = {
    toggle: () => setDarkMode(prev => !prev),
    isDarkMode, // Passando o estado atual
  };

  const ttsHandler = {
    toggle: () => setTtsEnabled(prev => !prev),
    isTtsEnabled, // Passando o estado atual
  };

  // Função para construir a URL da imagem do curso
  const getCourseImageUrl = (fotoBannerName) => {
    if (fotoBannerName) {
      // Se for "folhin.png" ou outro nome, ele será usado aqui.
      return `${BACKEND_IMAGE_BASE_URL}/uploads/${COURSE_BANNER_UPLOAD_PATH_SEGMENT}/${fotoBannerName}`;
    }
    // Se fotoBannerName for null ou undefined, retorna a URL do placeholder do servidor diretamente.
    // Isso garante que mesmo que o backend não envie "folhin.png", tentamos o placeholder.
    return SERVER_COURSE_PLACEHOLDER_URL; 
  };

  const renderCourseSlider = (courses, title) => (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-[#1D3557] mb-6 text-center">{title}</h2>
      {courses.length > 0 ? (
        <Slider {...sliderSettings}>
          {courses.map((course) => (
            <div key={course.idCurso || course.nome} className="px-3"> {/* Adicionado fallback para key */}
              <div className="group flex h-96 flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300">
                <img 
                  src={getCourseImageUrl(course.fotoBanner)} 
                  alt={`Banner do curso ${course.nome}`} 
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    // Se a imagem atual (src) que falhou NÃO FOR JÁ o placeholder do servidor,
                    // então tenta carregar o placeholder do servidor.
                    if (e.target.src !== SERVER_COURSE_PLACEHOLDER_URL) {
                      console.warn(`Falha ao carregar imagem do curso: ${e.target.src}. Tentando placeholder do servidor.`);
                      e.target.src = SERVER_COURSE_PLACEHOLDER_URL;
                    } else {
                      // Se até o placeholder do servidor falhar, tenta o fallbackImage local do frontend.
                      console.error(`Falha crítica ao carregar placeholder do servidor: ${SERVER_COURSE_PLACEHOLDER_URL}. Tentando fallback local.`);
                      if (e.target.src !== fallbackImage) { // Evita loop se o fallback local também falhar
                        e.target.src = fallbackImage;
                      } else {
                        console.error("Falha ao carregar até mesmo o fallback local.");
                        // Opcional: esconder a tag img
                        // e.target.style.display = 'none';
                      }
                    }
                  }}
                />
                <div className="flex flex-1 flex-col bg-[#e7eff6] justify-between p-4">
                  <h3 className="text-lg font-bold text-[#1D3557]">{course.nome}</h3>
                  <p className="text-sm text-gray-600 flex-1">{course.instituicao}</p>
                  <button onClick={() => setSelectedCourse(course)} className="mt-2 self-center rounded-full bg-[#F4D35E] px-4 py-1.5 font-bold text-sm text-[#1D3557] transition-colors duration-300 group-hover:bg-[#FFE46B]">Ver Detalhes</button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-gray-600">Nenhum curso disponível no momento.</p>
      )}
    </div>
  );

  return (
    <div className="font-sans bg-[#F9FAFB] text-[#1D3557]">
      <Header 
        isMenuOpen={isAccessibilityMenuOpen}
        onMenuToggle={() => setAccessibilityMenuOpen(prev => !prev)}
        accessibilityHandlers={{ fontHandlers, darkModeHandler, ttsHandler }}
      />
      
      <main className="mx-auto max-w-7xl px-4 space-y-12 md:space-y-16 my-8">
        
        <div className="text-center py-3">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1D3557]">Bem-vindo ao Portal Flor da Cidade</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Sua plataforma completa para a agricultura urbana no Recife. Explore nossos serviços, cursos e novidades para cultivar um futuro mais verde e sustentável.</p>
        </div>

        <div className="bg-white py-12 md:py-16 rounded-3xl shadow-lg px-4 md:px-8">
          <h2 className="text-4xl font-extrabold text-center text-[#1D3557] mb-10">Nossos Serviços</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
        
        <div id="detalhe1" className="bg-white py-12 md:py-16 rounded-3xl shadow-lg px-4 md:px-8">
          <h2 className="text-4xl font-extrabold text-justify text-[#1D3557] mb-5">Nossos Acolhimentos</h2>
          <MapComponent />
          <div className="max-w-4xl mx-auto text-center mt-12">
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
        </div>

        <div id="Cursos" className="bg-white py-12 md:py-16 rounded-3xl shadow-lg px-4 md:px-8">
          {loading && <p className="text-center text-lg">Carregando cursos...</p>}
          {error && <p className="text-center text-red-600 font-bold">{error}</p>}
          {!loading && !error && (
            <div className='space-y-12'>
              {renderCourseSlider(seauCourses, "Nossos Cursos SEAU")}
              {renderCourseSlider(externalCourses, "Cursos de Parceiros")}
            </div>
          )}
        </div>

        <div id="informativos" className="bg-white py-12 md:py-16 rounded-3xl shadow-lg px-4 md:px-8">
          <h2 className="text-4xl font-extrabold text-center text-[#1D3557] mb-10">Informativos SEAU</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
            <div className="w-full md:w-1/3"><video controls playsInline className="w-full rounded-xl shadow-lg"><source src={videoSeau} type="video/mp4" />Seu navegador não suporta o vídeo.</video></div>
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-2 text-center">Dia Mundial da Abelha</h3>
              <p className="text-gray-600 text-justify">
                Já parou para refletir sobre a importância daquele pequeno zumbido que ecoa pela natureza? No Dia da Abelha, convidamos você a mergulhar no fascinante mundo desses seres incríveis. Muito além da produção de mel, as abelhas desempenham um papel essencial para a vida na Terra.
                <br /><br />
                Responsáveis pela polinização, elas garantem a reprodução das plantas e a diversidade dos alimentos que chegam à nossa mesa. Em sistemas agroecológicos, sua presença é um sinal claro de equilíbrio e saúde ambiental.
                <br /><br />
                Mas seu valor vai além do ecológico — tem raízes profundas na ancestralidade. Povos originários e comunidades tradicionais sempre reconheceram as abelhas como símbolos de abundância, cooperação e sabedoria natural, muito antes da ciência confirmar sua importância.
                <br /><br />
                Compreender o papel das abelhas é fundamental para repensarmos nossos hábitos e assumirmos o compromisso com a preservação da vida. Cuidar delas é cuidar de nós mesmos e do futuro do planeta.
                <br /><br />
                ▶️ Assista ao vídeo ao lado e venha com a gente nessa jornada de conscientização!
              </p>
            </div>
            <div className="w-full md:w-1/3 flex justify-center "><a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="inline-block rounded-full bg-[#F4D35E] px-8 py-3 font-bold text-[#1D3557] text-lg transition-transform duration-300 hover:scale-105 hover:bg-[#FFE46B]">Ver no YouTube</a></div>
          </div>
        </div>

        <div id="pancs" className="bg-white py-12 md:py-16 rounded-3xl shadow-lg px-4 md:px-8">
          <h2 className="text-4xl font-extrabold text-center text-[#1D3557] mb-12">PANCs e suas Receitas</h2>
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center">
              <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-4">
                As Plantas Alimentícias Não Convencionais (PANCs) são espécies com potencial alimentício, mas pouco consumidas. Junto a elas, as plantas medicinais, usadas por nossos ancestrais, continuam a ser um recurso valioso para a saúde e bem-estar.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-center text-[#1D3557] mb-8">Conheça algumas Plantas Medicinais</h3>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {Object.keys(medicinalPlantsData).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActivePlantTab(key)}
                    className={`px-4 py-2 text-sm md:text-base font-semibold rounded-t-lg transition-colors duration-300 ${activePlantTab === key ? 'bg-[#F4D35E] text-[#1D3557]' : 'bg-white/50 hover:bg-white/80'}`}
                  >
                    {medicinalPlantsData[key].title}
                  </button>
                ))}
              </div>
              <div className="bg-white p-6 rounded-b-lg rounded-tr-lg shadow-lg">
                <h4 className="text-xl font-bold text-[#1D3557] mb-2">{medicinalPlantsData[activePlantTab].title}</h4>
                <p className="text-gray-700 text-justify">{medicinalPlantsData[activePlantTab].content}</p>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-center text-[#1D3557] mb-8">Receitas com PANCs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipesData.map((recipe, index) => (
                  <details key={index} open={areRecipesOpen} className="bg-white p-6 rounded-lg shadow-lg flex flex-col h-full">
                    <summary 
                      className="font-semibold text-lg text-[#1D3557] list-none flex justify-between items-center cursor-pointer"
                      onClick={(e) => { e.preventDefault(); setAreRecipesOpen(prev => !prev); }} // Controla abertura/fechamento
                    >
                      {recipe.title}
                      <FaChevronDown className={`transform transition-transform duration-300 ${areRecipesOpen ? 'rotate-180' : ''}`} />
                    </summary>
                    <div className="mt-4 text-gray-600 space-y-3 text-sm">
                      {recipe.sections.map((section, sIndex) => (
                        <div key={sIndex}>
                          {section.heading && <p className="font-bold">{section.heading}</p>}
                          {section.items && <ul className="list-disc pl-5 space-y-1">{section.items.map((item, iIndex) => <li key={iIndex}>{item}</li>)}</ul>}
                          {section.text && <p className="text-justify whitespace-pre-line">{section.text}</p>}
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div>
                <h3 className="text-3xl font-bold text-center text-[#1D3557] mb-8">PANCs por Região do Recife</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rpaData.map((rpa, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                            <h4 className="font-semibold text-lg text-[#1D3557] mb-2">{rpa.title}</h4>
                            <p className="text-gray-600 text-sm">{rpa.content}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        <div id="detalhe4" className="bg-white py-12 md:py-16 rounded-3xl shadow-lg px-4 md:px-8">
          <div className="md:flex md:items-start md:gap-12">
            <div className="text-center md:text-left flex-shrink-0"><img src={adrianaImg} alt="Retrato de Adriana Figueira" className="w-48 h-48 object-cover rounded-full mx-auto mb-6 shadow-lg" /><h2 className="text-3xl font-bold text-[#1D3557]">Adriana Figueira</h2><p className="text-lg text-[#F4D35E] font-semibold">Secretária Executiva</p></div>
            <div className="mt-6 md:mt-0"><p className="text-justify mb-4 text-gray-700">Graduada em Arquitetura e Urbanismo pela UFPE (1983), com mestrado em Desenvolvimento Urbano (2000), atua na Urb Recife desde 1986. Hoje, como Secretária Executiva de Agricultura Urbana, lidera a missão de fomentar práticas sustentáveis.</p><div className="border-t pt-6 mt-6"><h3 className="text-2xl font-bold text-[#1D3557] mb-4">Contato SEAU</h3><div className="space-y-2 text-gray-700"><p><span className="font-semibold text-[#1D3557]">Endereço:</span> Prefeitura do Recife - Av. Cais do Apolo, 925, 5º andar, Recife/PE</p><p><span className="font-semibold text-[#1D3557]">Telefone:</span> (81) 3355-8606</p><p><span className="font-semibold text-[#1D3557]">E-mail:</span> agriculturaurbana@recife.pe.gov.br</p></div></div></div>
          </div>
        </div>

        <div id="faq" className="bg-white py-12 md:py-16 rounded-3xl shadow-lg px-4 md:px-8">
          <h2 className="text-4xl font-extrabold text-[#1D3557] text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* FAQ Items */}
            <details className="group bg-white p-6 rounded-lg shadow-lg">
              <summary className="font-semibold text-lg text-[#1D3557] cursor-pointer list-none flex justify-between items-center">
                Qual é a nossa missão?
                <FaChevronDown className="transform transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-all duration-500 ease-in-out">
                <div className="overflow-hidden">
                  <p className="pt-4 text-gray-600 text-justify">Promover a agricultura urbana e desenvolvimento sustentável para a cidade, a partir da articulação, capacitação, fomento e execução de ações agroecológicas, que promovam uma mudança de paradigmas e a melhoria da qualidade de vida das pessoas com o envolvimento da população e o aproveitamento de áreas propícias ao cultivo.</p>
                </div>
              </div>
            </details>
            {/* Outros FAQs ... */}
            <details className="group bg-white p-6 rounded-lg shadow-lg">
              <summary className="font-semibold text-lg text-[#1D3557] cursor-pointer list-none flex justify-between items-center">
                O que é nosso Plano de Agroecologia Urbana?
                <FaChevronDown className="transform transition-transform duration-300 group-open:rotate-180" />
              </summary>
              {/* ... conteúdo ... */}
            </details>            
            <details className="group bg-white p-6 rounded-lg shadow-lg">
              <summary className="font-semibold text-lg text-[#1D3557] cursor-pointer list-none flex justify-between items-center">
                Como solicitar apoio para minha horta?
                <FaChevronDown className="transform transition-transform duration-300 group-open:rotate-180" />
              </summary>
              {/* ... conteúdo ... */}
            </details>
            <details className="group bg-white p-6 rounded-lg shadow-lg">
              <summary className="font-semibold text-lg text-[#1D3557] cursor-pointer list-none flex justify-between items-center">
                Quais cursos estão disponíveis?
                <FaChevronDown className="transform transition-transform duration-300 group-open:rotate-180" />
              </summary>
               {/* ... conteúdo ... */}
            </details>
          </div>
        </div>
      </main>

      <Footer />
      {/* Modal do Curso */}
      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}