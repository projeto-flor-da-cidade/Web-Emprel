import React from 'react';

// --- IMPORTAÇÃO DOS ATIVOS ---
import logoSeau from '../../assets/images/logo_seau.png';
import logoInfo from '../../assets/images/logo_info.png';
import cardImage1 from '../../assets/images/horta.jpg';
import cardImage2 from '../../assets/images/alface.jpg';
import cardImage3 from '../../assets/images/aula.jpg';
import videoSeau from '../../assets/videos/Video_seau.mp4'; // <- Será usado agora
import adrianaImg from '../../assets/images/adrianafigueira.jpg'; // <- Será usado agora
import logoWpp from '../../assets/images/logo-wpp.png';
import logoInstagram from '../../assets/images/Logo_Instagram.png';
import bgImage from '../../assets/images/ora-pro-nobis-flor-da-Pereskia-aculeata.jpg';

// Mantendo a definição de cores localmente, conforme solicitado.
const colors = {
  primaryDark: '#1d1fa8',
  primaryText: '#191cac',
  secondaryYellow: '#d1c517',
  white: '#ffffff'
};

function Home() {
  return (
    <div
      className="font-sans bg-cover bg-fixed bg-center"
      style={{ 
        backgroundImage: `url(${bgImage})`,
        color: colors.primaryText
      }}
    >
      {/* Header Responsivo */}
      <header 
        className="text-white flex flex-wrap justify-between items-center p-4 md:px-8 gap-4"
        style={{ backgroundColor: colors.primaryDark }}
      >
        <div className="logo">
          <img src={logoSeau} alt="Logo Flor da Cidade" className="h-16" />
        </div>
        <h1 className="flex-1 text-center text-2xl md:text-3xl font-bold order-first md:order-none w-full md:w-auto">
          Flor da Cidade
        </h1>
        <div className="header-buttons flex items-center gap-4">
          <a href="#detalhe4" className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold" style={{ backgroundColor: colors.secondaryYellow, color: colors.primaryDark }}>
            <img src={logoInfo} alt="Informações" className="h-5" />
          </a>
          <button className="px-4 py-2 rounded-lg font-bold" style={{ backgroundColor: colors.secondaryYellow, color: colors.primaryDark }}>
            Acessibilidade
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12 space-y-12">
        
        {/* Seção de Cards Responsiva */}
        <section className="flex flex-wrap justify-center gap-8">
          <div className="w-full sm:w-[300px] rounded-xl p-4 text-center shadow-lg flex flex-col" style={{ backgroundColor: colors.primaryDark, color: colors.white }}>
            <img src={cardImage1} alt="Pessoa trabalhando na horta" className="w-full h-40 object-cover rounded-lg mb-4" />
            <p className="flex-grow">Gosta de produzir e de trabalhar com a terra? Este é o lugar perfeito, peça aqui a implantação ou o apoio para a sua horta, abaixo, saiba quais requisitos para solicitar.</p>
            <a href="#detalhe1" className="inline-block px-4 py-2 rounded-md font-bold mt-4 self-center" style={{ backgroundColor: colors.secondaryYellow, color: colors.primaryDark }}>Saiba mais</a>
          </div>
          <div className="w-full sm:w-[300px] rounded-xl p-4 text-center shadow-lg flex flex-col" style={{ backgroundColor: colors.primaryDark, color: colors.white }}>
            <img src={cardImage2} alt="Mãos segurando terra" className="w-full h-40 object-cover rounded-lg mb-4" />
            <p className="flex-grow">Conheça os cursos ofertados pela Secretaria Executiva de Agricultura Urbana.</p>
            <a href="#detalhe2" className="inline-block px-4 py-2 rounded-md font-bold mt-4 self-center" style={{ backgroundColor: colors.secondaryYellow, color: colors.primaryDark }}>Saiba mais</a>
          </div>
          <div className="w-full sm:w-[300px] rounded-xl p-4 text-center shadow-lg flex flex-col" style={{ backgroundColor: colors.primaryDark, color: colors.white }}>
            <img src={cardImage3} alt="Plantas em canteiro" className="w-full h-40 object-cover rounded-lg mb-4" />
            <p className="flex-grow">Nossa aba informativa contém de tudo para quem ama agroecologia e quer estar sempre ligado nas novidades!</p>
            <a href="#detalhe3" className="inline-block px-4 py-2 rounded-md font-bold mt-4 self-center" style={{ backgroundColor: colors.secondaryYellow, color: colors.primaryDark }}>Saiba mais</a>
          </div>
        </section>

        {/* --- SEÇÕES COMPLETAS ABAIXO --- */}

        <section id="detalhe1" className="bg-white/95 p-6 md:p-8 rounded-xl space-y-4">
          <h2 className="text-2xl font-bold">Solicite aqui a implantação ou o apoio para a sua horta</h2>
          <p className="font-bold">Requisitos para solicitar a horta:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Ser instituição pública</li>
            <li>Ter no mínimo 3 participantes em caso de comunidade</li>
          </ol>
        </section>

        <section id="detalhe2" className="bg-white/95 p-6 md:p-8 rounded-xl space-y-4">
          <h2 className="text-2xl font-bold">Cultiva Recife</h2>
          <p>Nossos cursos se dividem em dois grupos:</p>
          <ol className="list-decimal list-inside space-y-4">
            <li>
              <b className="font-bold">Cursos próprios da SEAU:</b>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Agroecologia na cidade</li>
                <li>Como tranformar meu quintal num quintal produtivo</li>
              </ul>
            </li>
            <li>
              <b className="font-bold">Cursos institucionais:</b>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Ervas medicinais e PANCs</li>
              </ul>
            </li>
          </ol>
        </section>

        <section id="detalhe3" className="bg-white/95 p-6 md:p-8 rounded-xl space-y-4">
          <h2 className="text-2xl font-bold">Informativos SEAU</h2>
          <p>Dia Mundial da Abelha:</p>
          <video controls playsInline className="w-full max-w-md rounded-xl">
            <source src={videoSeau} type="video/mp4" /> {/* <- USO DO videoSeau */}
            Seu navegador não suporta o vídeo.
          </video>
        </section>
        
        <section id="detalhe4" className="bg-white/95 p-6 md:p-8 rounded-xl space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img src={adrianaImg} alt="Retrato de Adriana Figueira" className="w-48 h-48 object-cover rounded-full flex-shrink-0" /> {/* <- USO DO adrianaImg */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">Adriana Figueira</h2>
              <p className='text-justify mt-2'>Graduada em Arquitetura e Urbanismo pela Universidade Federal de Pernambuco (1983), com especialização em Conservação Integrada Urbana e Territorial pela Universidade Federal de Pernambuco e mestrado em Desenvolvimento Urbano pela Universidade Federal de Pernambuco (2000). Funcionária da Empresa de Urbanização do Recife – Urb Recife, desde 1986, trabalhou com a urbanização de áreas especiais de interesse social, com a preservação de sítios históricos e com planejamento e licenciamento urbano. Atualmente, exerce a função de Secretária Executiva de Agricultura Urbana da Prefeitura do Recife, com a missão de promover a agricultura urbana e desenvolvimento sustentável para a cidade, a partir da articulação, capacitação, fomento e execução de ações agroecológicas, que promovam uma mudança de paradigmas e a melhoria da qualidade de vida das pessoas com o envolvimento da população e o aproveitamento de áreas propícias ao cultivo.</p>
            </div>
          </div>
          
          <div className="border-t pt-6 space-y-4">
            <h2 className="text-2xl font-bold">Sobre a Secretaria Executiva de Agricultura Urbana - SEAU</h2>
            <p className='text-justify'>Criada no início da gestão do Prefeito João Campos, a Secretaria Executiva de Agricultura Urbana - SEAU tem como objetivo fomentar as práticas sustentáveis de agricultura no território do município, intensificando a produção agroecológica de alimentos e ervas medicinais, a partir de hortas e pomares em áreas públicas e privadas com potencial agriculturável na cidade, contribuindo para a segurança alimentar, a sustentabilidade ambiental, o fortalecimento das relações sociais e a economia solidária.</p> 
            <p className='text-justify'>O Recife conta com o Plano de Agroecologia Urbana desenvolvido pela Secretaria Executiva de Agricultura Urbana a partir de um processo de escuta e discussão com diversos segmentos da sociedade durante o Seminário de Agroecologia Urbana do Recife, que aconteceu em 23 de março de 2021.</p>     
            <p className='text-justify'>Com o objetivo de nortear a política de agroecologia urbana do município, o Plano estabelece metas como: implantação e apoio a 180 estruturas de produção, como hortas, pomares, roçados e hortas fitoterápicas e escolares até 2024; desenvolvimento de parcerias com, no mínimo, 10 organizações sociais, acadêmicas e comunitárias por ano para projetos agroecológicos; implantação da coleta de orgânicos e compostagem em 20 escolas municipais; e construção da política de agroecologia urbana do Recife.</p>
            <p className='text-justify'>Promover a agricultura urbana e o desenvolvimento sustentável para a cidade requer o envolvimento e efetivo comprometimento de gestores públicos, sociedade civil e demais parceiros, fomentando e executando ações agroecológicas, que promovam mudanças de paradigmas e melhoria da qualidade de vida das pessoas.</p>  
          </div>
          
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-xl font-bold">Endereço</h3>
            <p>Prefeitura do Recife - Avenida Cais do Apolo, 925, Bairro do Recife, <b>5º andar</b>, Recife/PE, CEP: 50030-903</p>       
            
            <h3 className="text-xl font-bold">Contato Institucional</h3>
            <p><b>Telefone:</b> (81) 3355-8606 </p>
            <p><b>E-mail:</b> agriculturaurbana@recife.pe.gov.br</p>        
          </div>
        </section>
      </main>

      {/* Footer Responsivo */}
      <footer 
        className="text-white flex flex-col sm:flex-row justify-between items-center p-4 md:px-8 gap-4"
        style={{ backgroundColor: colors.primaryDark }}
      >
        <div className="footer-logo">
          <img src={logoSeau} alt="Logo Flor da Cidade" className="h-12" />
        </div>
        <div className="footer-links flex gap-4">
          <a href="https://wa.me" target="_blank" rel="noopener noreferrer"><img src={logoWpp} alt="WhatsApp" className="h-8 transition-transform hover:scale-110" /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src={logoInstagram} alt="Instagram" className="h-8 transition-transform hover:scale-110" /></a>
        </div>
      </footer>
    </div>
  );
}

export default Home;