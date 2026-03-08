"use client";

import { useEffect } from "react";

export default function SecurityConsole() {
  useEffect(() => {
    // Limpa o console ao carregar para o aviso ser o primeiro
    console.clear();

    // Estilo do aviso (Estilo Facebook/Discord)
    const titleStyle = "color: #b91c1c; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 0px black;";
    const warningStyle = "color: white; font-size: 18px; font-weight: bold; background: #b91c1c; padding: 5px 10px; border-radius: 5px;";
    const textStyle = "color: #888; font-size: 14px; font-weight: 500;";

    console.log("%cPARE!", titleStyle);
    console.log("%cEsta é uma ferramenta de desenvolvedor.", warningStyle);
    console.log(
      "%cSe alguém disse para você copiar e colar algo aqui para 'ganhar descontos' ou 'hackear' o site, é um GOLPE e dará a eles acesso à sua conta do The Flame Grill.",
      textStyle
    );
    console.log("%cSaia daqui agora para sua própria segurança.", textStyle);
  }, []);

  return null; // Componente invisível
}