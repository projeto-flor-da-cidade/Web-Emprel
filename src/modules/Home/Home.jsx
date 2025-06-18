// src/modules/Home/Home.jsx
import React, { useState, useEffect, useCallback } from 'react';

// Componentes Reutilizáveis
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CourseModal from '../../components/CourseModal';
import MapComponent from '../../components/MapComponent';

// Dados
import { serviceCards } from '../../constants/servicesData';
import { seauCourses, externalCourses } from '../../constants/courseData';

// Libs de Terceiros
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Assets
import videoSeau from '../../assets/videos/Video_seau.mp4';
import adrianaImg from '../../assets/images/adrianafigueira.jpg';

// Ícones
import { FaChevronDown } from 'react-icons/fa';

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
      <Header 
        isMenuOpen={isAccessibilityMenuOpen}
        onMenuToggle={() => setAccessibilityMenuOpen(prev => !prev)}
        accessibilityHandlers={{ fontHandlers, darkModeHandler, ttsHandler }}
      />
      
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

      <Footer />

      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}