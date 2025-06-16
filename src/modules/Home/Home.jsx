import React from 'react';
import logoSeau from '../../assets/images/logo_seau.png';
import logoInfo from '../../assets/images/logo_info.png';
import cardImage1 from '../../assets/images/horta.jpg';
import cardImage2 from '../../assets/images/alface.jpg';
import cardImage3 from '../../assets/images/aula.jpg';
import videoSeau from '../../assets/videos/Video_seau.mp4';
import adrianaImg from '../../assets/images/adrianafigueira.jpg';
import logoWpp from '../../assets/images/logo-wpp.png';
import logoInstagram from '../../assets/images/Logo_Instagram.png';

const cards = [
  {
    img: cardImage1,
    alt: 'Pessoa trabalhando na horta',
    text: 'Solicite Apoio Para sua Horta!',
    href: '#detalhe1'
  },
  {
    img: cardImage2,
    alt: 'Mãos segurando planta',
    text: 'Conheça os cursos ofertados pela SEAU.',
    href: '#detalhe2'
  },
  {
    img: cardImage3,
    alt: 'Aula de agroecologia',
    text: 'Atualize-se com nossas novidades em agroecologia!',
    href: '#detalhe3'
  }
];

export default function Home() {
  return (
    <div className="font-sans bg-[#F9FAFB] text-[#191cac]">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between bg-[#1D3557] text-white p-4 md:px-8">
        <img src={logoSeau} alt="Logo Flor da Cidade" className="h-16 mb-4 md:mb-0" />
        <h1 className="flex-1 text-center text-2xl md:text-3xl font-bold">Flor da Cidade</h1>
        <div className="flex items-center gap-4">
          <a href="#detalhe4" className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-[#F4D35E] text-[#1D3557] hover:bg-[#e5c94f] transition">
            <img src={logoInfo} alt="Informações" className="h-5" />
          </a>
          <button className="px-4 py-2 rounded-lg font-bold text-[#1D3557] bg-[#F4D35E] hover:bg-[#e5c94f] transition">
            Acessibilidade
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 space-y-12">
        {/* Cards Section */}
        <section className="w-full bg-green-50 py-6 md:py-8 rounded-3xl shadow-inner mt-6">
          <h2 className="text-4xl font-extrabold text-center text-[#1D3557] mb-6 md:mb-10">O que fazemos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {cards.map((card, i) => (
              <div key={i} className="group bg-white rounded-2xl overflow-hidden shadow-xl transform transition hover:scale-105 flex flex-col">
                <img src={card.img} alt={card.alt} className="w-full h-48 object-cover" />
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-lg font-semibold text-[#1D3557] text-center mb-4">{card.text}</p>
                  <a href={card.href} className="self-center font-bold bg-[#F4D35E] text-[#1D3557] py-2 px-6 rounded-full transition-colors duration-300 group-hover:bg-[#FFE46B]">
                    Saiba mais
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detail Sections */}
        <section id="detalhe1" className="bg-green-50 py-6 md:py-8 rounded-3xl shadow-inner px-4 md:px-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-[#1D3557] mb-4">Solicite aqui a implantação ou o apoio para a sua horta</h2>
          <p className="font-semibold mb-4">Requisitos para solicitar a horta:</p>
          <ol className="list-decimal list-inside space-y-2 mb-6">
            <li>Ser instituição pública</li>
            <li>Ter no mínimo 3 participantes em caso de comunidade</li>
          </ol>
          <a href="#" className="font-bold bg-[#F4D35E] text-[#1D3557] py-2 px-6 rounded-full transition-colors duration-300 hover:bg-[#FFE46B]">
            Solicitar Acompanhamento!
          </a>
        </section>

        <section id="detalhe2" className="bg-green-50 py-6 md:py-8 rounded-3xl shadow-inner px-4 md:px-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-[#1D3557] mb-4">Cultiva Recife</h2>
          <p className="mb-4 text-center">Nossos cursos se dividem em dois grupos:</p>
          <ol className="list-decimal list-inside space-y-4 mb-6">
            <li>
              <span className="font-semibold">Cursos próprios da SEAU:</span>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Agroecologia na cidade</li>
                <li>Como transformar meu quintal num quintal produtivo</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold">Cursos institucionais:</span>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Ervas medicinais e PANCs</li>
              </ul>
            </li>
          </ol>
          <a href="#" className="font-bold bg-[#F4D35E] text-[#1D3557] py-2 px-6 rounded-full transition-colors duration-300 hover:bg-[#FFE46B]">
            Acessar Cursos
          </a>
        </section>

        <section id="detalhe3" className="bg-green-50 py-6 md:py-8 rounded-3xl shadow-inner px-4 md:px-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-[#1D3557] mb-4">Informativos SEAU</h2>
          <p className="mb-4">Dia Mundial da Abelha:</p>
          <video controls playsInline className="w-full max-w-xs rounded-xl">
            <source src={videoSeau} type="video/mp4" />
            Seu navegador não suporta o vídeo.
          </video>
        </section>

        <section id="detalhe4" className="bg-green-50 py-6 md:py-8 rounded-3xl shadow-inner px-4 md:px-8">
          <h2 className="text-2xl font-bold text-[#1D3557] mb-4">Adriana Figueira</h2>
          <img src={adrianaImg} alt="Retrato de Adriana Figueira" className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full mx-auto md:mx-0 mb-4" />
          <p className="text-justify mb-4">
            Graduada em Arquitetura e Urbanismo pela Universidade Federal de Pernambuco (1983), com especialização em Conservação Integrada Urbana e Territorial e mestrado em Desenvolvimento Urbano pela UFPE (2000).
          </p>
          <p className="text-justify mb-4">
            Atua na Urb Recife desde 1986 em projetos de urbanização e preservação histórica. Hoje é Secretária Executiva de Agricultura Urbana do Recife.
          </p>
          <h3 className="text-xl font-bold text-[#1D3557] border-t pt-4 mt-4">Sobre a SEAU</h3>
          <p className="text-justify mb-4">
            Criada na gestão de João Campos, fomenta práticas sustentáveis de agricultura urbana, fortalecendo segurança alimentar e economia solidária.
          </p>
          <div className="border-t pt-4 mt-4 space-y-2">
            <p><span className="font-semibold">Endereço:</span> Prefeitura do Recife - Av. Cais do Apolo, 925, 5º andar, Recife/PE, CEP: 50030-903</p>
            <p><span className="font-semibold">Telefone:</span> (81) 3355-8606</p>
            <p><span className="font-semibold">E-mail:</span> agriculturaurbana@recife.pe.gov.br</p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-green-50 py-6 md:py-8 rounded-3xl shadow-inner px-4 md:px-8">
          <h2 className="text-3xl font-bold text-[#1D3557] text-center mb-6">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-[#1D3557] cursor-pointer">Quem somos nós?</summary>
              <p className="mt-2 text-justify">
                <span className="font-bold">Adriana Figueira</span> é graduada em Arquitetura e Urbanismo pela Universidade Federal de Pernambuco (1983), com especialização em Conservação Integrada Urbana e Territorial e mestrado em Desenvolvimento Urbano (2000). Funcionária da Urb Recife desde 1986, trabalhou na urbanização de áreas de interesse social, preservação de sítios históricos e planejamento urbano. Hoje, lidera a Secretaria Executiva de Agricultura Urbana, promovendo ações agroecológicas e desenvolvimento sustentável para a cidade.
              </p>
            </details>
            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-[#1D3557] cursor-pointer">Como solicitar apoio para minha horta?</summary>
              <p className="mt-2">
                Para solicitar apoio, basta acessar a seção "O que fazemos" e clicar em "Solicitar Acompanhamento!" na área de implantação de hortas. Preencha os requisitos e aguarde nosso retorno em até 5 dias úteis.
              </p>
            </details>
            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-[#1D3557] cursor-pointer">Quais cursos estão disponíveis?</summary>
              <p className="mt-2">
                Oferecemos cursos próprios da SEAU, como "Agroecologia na cidade" e "Como transformar meu quintal num quintal produtivo", além de cursos institucionais em parceria com outras organizações, incluindo "Ervas medicinais e PANCs".
              </p>
            </details>
            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-[#1D3557] cursor-pointer">Como funcionam os informativos?</summary>
              <p className="mt-2">
                Nossos informativos trazem datas comemorativas e novidades em agroecologia. Acesse a seção "Informativos SEAU" para assistir vídeos e conferir conteúdos exclusivos sobre eventos como o Dia Mundial da Abelha.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center bg-[#1D3557] text-white p-4 md:px-8 space-y-4 md:space-y-0">
        <img src={logoSeau} alt="Logo Flor da Cidade" className="h-12" />
        <div className="flex gap-4">
          <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transform transition">
            <img src={logoWpp} alt="WhatsApp" className="h-8" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transform transition">
            <img src={logoInstagram} alt="Instagram" className="h-8" />
          </a>
        </div>
      </footer>
    </div>
  );
}
