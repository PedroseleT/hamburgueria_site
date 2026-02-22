export default function Hero({ data, theme, contact }: any) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Imagem de Fundo Ajustada */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('${data.backgroundImage}')`,
          filter: 'brightness(0.7)' // Deixa a imagem um pouco mais escura para o texto brilhar
        }}
      >
        {/* Gradiente para suavizar as bordas igual ao site original */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
      </div>

      {/* Conteúdo Centralizado */}
      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="text-left">
          <h1 className="text-6xl md:text-[120px] font-[900] text-white leading-[0.8] tracking-tighter uppercase italic drop-shadow-2xl">
            {data.headline.split(' ')[0]} <br />
            <span className="text-white">{data.headline.split(' ')[1]}</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-white font-bold uppercase tracking-[0.2em] max-w-md drop-shadow-md">
            {data.subheadline}
          </p>
        </div>

        {/* Botão de Pedido Estilo Selo */}
        <div className="relative group">
          <a 
            href={`https://wa.me/${contact.whatsappNumber}`}
            className="w-40 h-40 bg-[#d9c5a0] hover:bg-white text-black rounded-full flex items-center justify-center text-center font-black text-2xl leading-tight transition-all uppercase shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95"
          >
            Fazer <br /> Pedido
          </a>
        </div>
      </div>
      
      {/* Assinatura no Rodapé */}
      <div className="absolute bottom-12 right-12 z-10 hidden md:block">
        <p className="text-white font-serif text-4xl italic opacity-90 tracking-tight">
          Thomas Troisgros
        </p>
      </div>
    </section>
  );
}