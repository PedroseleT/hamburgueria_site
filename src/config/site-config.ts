export const siteConfig = {
  clientName: "T.T. BURGER",
  contact: { 
    whatsappNumber: "5519999999999", 
    whatsappMessage: "QUERO O MELHOR BURGER!" 
  },
  theme: { 
    primaryColor: "bg-[#e21a22]", 
    primaryHover: "hover:bg-red-700",
  },
  hero: { 
    headline: "ORIGINALMENTE BRASILEIRO", 
    subheadline: "O blend do chef no melhor hambúrguer da sua vida.", 
    buttonText: "FAZER PEDIDO", 
    // Certifique-se de salvar a foto em public/burger-destaque.jpg
    backgroundImage: "/burger-destaque.jpg" 
  },
  menu: [
    { id: "1", name: "T.T. BURGER", description: "180g de carne, queijo minas padrão, tomate, alface e picles de chuchu.", price: 42.00 },
    { id: "2", name: "T.T. PÃO CARNE QUEIJO", description: "Simples, direto e matador. Para quem ama o clássico.", price: 36.00 }
  ]
};