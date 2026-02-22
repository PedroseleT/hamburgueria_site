export default function Menu({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="group bg-[#0a0a0a] border border-neutral-900 p-6 flex flex-col justify-between hover:border-red-600 transition-colors duration-300"
        >
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-red-500 transition-colors">
                {item.name}
              </h3>
              <span className="text-xl font-bold text-red-600 italic">
                R$ {item.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-[80%] uppercase font-medium">
              {item.description}
            </p>
          </div>
          
          <div className="mt-6 flex items-center gap-2">
            <div className="h-[2px] w-8 bg-red-600"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              Original T.T.
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}