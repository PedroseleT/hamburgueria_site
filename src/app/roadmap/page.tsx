"use client";

import { useState } from "react";

const sections = {
  arquitetura: {
    label: "🏗️ Arquitetura",
    color: "#f97316",
  },
  banco: {
    label: "🗄️ Banco de Dados",
    color: "#3b82f6",
  },
  mvp: {
    label: "🚀 Prioridades",
    color: "#10b981",
  },
  desafios: {
    label: "⚠️ Desafios",
    color: "#ef4444",
  },
  melhorias: {
    label: "💡 Melhorias",
    color: "#8b5cf6",
  },
  preco: {
    label: "💰 Precificação",
    color: "#f59e0b",
  },
};

const content = {
  arquitetura: (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <p style={{ color: "#94a3b8", marginBottom: 24 }}>
        Stack recomendada para um sistema robusto, escalável e dentro da sua realidade atual como dev.
      </p>

      <div style={{ display: "grid", gap: 16 }}>
        {[
          {
            camada: "Frontend",
            tech: "Next.js 14 + TypeScript + Tailwind",
            motivo: "Você já usa. App Router, Server Components para performance, layout separado por /admin e /app.",
            cor: "#3b82f6",
          },
          {
            camada: "Backend / API",
            tech: "Next.js API Routes + tRPC (opcional)",
            motivo: "API Routes já estão no projeto. tRPC adiciona tipagem end-to-end automática entre frontend e backend.",
            cor: "#8b5cf6",
          },
          {
            camada: "Banco de Dados",
            tech: "PostgreSQL (Neon) + Prisma ORM",
            motivo: "Você já usa Neon + Prisma. Escala bem, gratuito no início, relações complexas com facilidade.",
            cor: "#10b981",
          },
          {
            camada: "Tempo Real",
            tech: "Pusher ou Supabase Realtime",
            motivo: "Para pedidos em tempo real no painel admin. Pusher tem tier gratuito generoso. Alternativa: polling a cada 15s.",
            cor: "#f97316",
          },
          {
            camada: "Autenticação",
            tech: "NextAuth.js v5 ou manter JWT próprio",
            motivo: "NextAuth simplifica muito OAuth, sessões e roles. Recomendo migrar do JWT manual para NextAuth.",
            cor: "#ec4899",
          },
          {
            camada: "Storage de Imagens",
            tech: "Cloudinary ou Vercel Blob",
            motivo: "Para fotos dos produtos do cardápio. Cloudinary tem transformação de imagem gratuita.",
            cor: "#f59e0b",
          },
          {
            camada: "Pagamentos",
            tech: "Mercado Pago (Pix + Cartão)",
            motivo: "Melhor integração para BR. SDK bem documentado, Pix nativo, split de pagamentos, dashboard próprio.",
            cor: "#06b6d4",
          },
          {
            camada: "Hospedagem",
            tech: "Vercel (frontend) + Neon (banco)",
            motivo: "Você já usa. Para produção, considere Vercel Pro (~$20/mês) para remover limites de funções serverless.",
            cor: "#64748b",
          },
        ].map((item) => (
          <div
            key={item.camada}
            style={{
              background: "#0f172a",
              border: `1px solid ${item.cor}33`,
              borderLeft: `3px solid ${item.cor}`,
              borderRadius: 8,
              padding: "14px 18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  background: `${item.cor}22`,
                  color: item.cor,
                  padding: "2px 10px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {item.camada}
              </span>
              <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{item.tech}</span>
            </div>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: 12, lineHeight: 1.6 }}>{item.motivo}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 24,
          background: "#1e293b",
          borderRadius: 8,
          padding: 16,
          border: "1px solid #334155",
        }}
      >
        <p style={{ color: "#f97316", fontWeight: 700, margin: "0 0 8px", fontSize: 12 }}>📐 ESTRUTURA DE PASTAS SUGERIDA</p>
        <pre style={{ color: "#94a3b8", margin: 0, fontSize: 11, lineHeight: 1.8 }}>
{`src/app/
  (cliente)/           ← área pública
    cardapio/
    carrinho/
    pedidos/
    perfil/
  (admin)/             ← painel admin (protegido por middleware)
    dashboard/
    pedidos/
    cardapio/
    estoque/
    clientes/
    funcionarios/
    relatorios/
  api/
    pedidos/
    pagamentos/
    estoque/
    webhooks/          ← Mercado Pago, WhatsApp`}
        </pre>
      </div>
    </div>
  ),

  banco: (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <p style={{ color: "#94a3b8", marginBottom: 24 }}>
        Modelagem Prisma simplificada — entidades principais e relações.
      </p>

      {[
        {
          model: "User",
          cor: "#3b82f6",
          fields: [
            "id, name, email, phone",
            "passwordHash, role (CLIENT | ADMIN | ATTENDANT)",
            "createdAt, updatedAt",
            "→ orders[], addresses[]",
          ],
        },
        {
          model: "Product",
          cor: "#10b981",
          fields: [
            "id, name, description, price",
            "imageUrl, category, isAvailable",
            "preparationTime (minutos)",
            "→ orderItems[], stockItems[]",
          ],
        },
        {
          model: "Order",
          cor: "#f97316",
          fields: [
            "id, status (RECEIVED | PREPARING | OUT_FOR_DELIVERY | DONE | CANCELLED)",
            "totalPrice, discountApplied",
            "paymentMethod (PIX | CARD | CASH)",
            "paymentStatus (PENDING | PAID | FAILED)",
            "deliveryAddress, notes",
            "→ user, items[], coupon?",
          ],
        },
        {
          model: "OrderItem",
          cor: "#8b5cf6",
          fields: [
            "id, quantity, unitPrice",
            "customizations (JSON)",
            "→ order, product",
          ],
        },
        {
          model: "Coupon",
          cor: "#ec4899",
          fields: [
            "id, code, discountType (PERCENT | FIXED)",
            "discountValue, minOrderValue",
            "usageLimit, usedCount",
            "expiresAt, isActive",
          ],
        },
        {
          model: "StockItem",
          cor: "#f59e0b",
          fields: [
            "id, name, unit (KG | UN | L)",
            "currentQty, minQty (alerta)",
            "→ product (insumo do produto)",
            "→ stockMovements[]",
          ],
        },
        {
          model: "StockMovement",
          cor: "#06b6d4",
          fields: [
            "id, type (IN | OUT | ADJUSTMENT)",
            "quantity, reason",
            "createdAt",
            "→ stockItem, user (quem registrou)",
          ],
        },
        {
          model: "ActionLog",
          cor: "#64748b",
          fields: [
            "id, userId, action",
            "entity, entityId",
            "details (JSON), createdAt",
          ],
        },
      ].map((m) => (
        <div
          key={m.model}
          style={{
            background: "#0f172a",
            border: `1px solid ${m.cor}44`,
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              color: m.cor,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ opacity: 0.5 }}>model</span> {m.model}
          </div>
          {m.fields.map((f, i) => (
            <div key={i} style={{ color: f.startsWith("→") ? "#94a3b8" : "#e2e8f0", fontSize: 12, lineHeight: 1.8, paddingLeft: f.startsWith("→") ? 8 : 0 }}>
              {f.startsWith("→") ? <span style={{ color: m.cor }}>→ </span> : "  "}
              {f.replace("→ ", "")}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),

  mvp: (
    <div>
      <p style={{ color: "#94a3b8", marginBottom: 24, fontFamily: "sans-serif", fontSize: 13 }}>
        Ordem de desenvolvimento recomendada — do que gera valor imediato ao que diferencia o produto.
      </p>

      {[
        {
          fase: "MVP",
          prazo: "1–2 meses",
          cor: "#10b981",
          bg: "#10b98115",
          items: [
            "Cardápio digital com categorias e fotos",
            "Carrinho persistente (já existe)",
            "Login/cadastro com roles (CLIENT, ADMIN, ATTENDANT)",
            "Pedido pelo site com status básico",
            "Painel admin: lista de pedidos em tempo real",
            "Alteração de status do pedido (kanban simples)",
            "Pagamento via Pix (Mercado Pago)",
            "Notificação WhatsApp ao fazer pedido",
          ],
        },
        {
          fase: "Intermediário",
          prazo: "2–4 meses",
          cor: "#3b82f6",
          bg: "#3b82f615",
          items: [
            "Pagamento via cartão de crédito/débito",
            "Cupons de desconto",
            "Dashboard financeiro (faturamento, ticket médio)",
            "Histórico de pedidos na área do cliente",
            "Relatório exportável (PDF/Excel)",
            "Controle básico de estoque",
            "Gestão de clientes (histórico, frequência)",
            "Impressão em impressora térmica (ESC/POS)",
          ],
        },
        {
          fase: "Avançado",
          prazo: "4–6 meses",
          cor: "#8b5cf6",
          bg: "#8b5cf615",
          items: [
            "Controle de funcionários + log de ações",
            "Alerta automático de estoque mínimo",
            "Baixa automática de estoque por venda",
            "Acompanhamento de entrega em tempo real",
            "Programa de fidelidade / pontos",
            "Emissão de NFC-e (nota fiscal)",
            "App mobile (PWA ou React Native)",
            "Relatórios avançados com gráficos",
          ],
        },
      ].map((fase) => (
        <div
          key={fase.fase}
          style={{
            background: fase.bg,
            border: `1px solid ${fase.cor}44`,
            borderRadius: 10,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span
              style={{
                background: fase.cor,
                color: "#fff",
                padding: "4px 14px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {fase.fase}
            </span>
            <span style={{ color: fase.cor, fontSize: 12, fontWeight: 600 }}>⏱ {fase.prazo}</span>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {fase.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#e2e8f0" }}>
                <span style={{ color: fase.cor, fontSize: 16, lineHeight: 1.2 }}>◆</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),

  desafios: (
    <div style={{ display: "grid", gap: 14 }}>
      <p style={{ color: "#94a3b8", marginBottom: 8, fontFamily: "sans-serif", fontSize: 13 }}>
        Antecipe esses obstáculos antes de começar cada módulo.
      </p>

      {[
        {
          titulo: "Tempo real nos pedidos",
          nivel: "ALTO",
          cor: "#ef4444",
          desc: "Serverless (Vercel) não mantém conexão aberta. Use Pusher ou Supabase Realtime para WebSockets. Alternativa barata: polling a cada 15s com SWR.",
        },
        {
          titulo: "Impressora térmica (ESC/POS)",
          nivel: "ALTO",
          cor: "#ef4444",
          desc: "Browsers não acessam hardware diretamente. Solução: QZ Tray (app desktop leve) ou impressão via Bluetooth no mobile com PWA.",
        },
        {
          titulo: "Emissão de NFC-e",
          nivel: "ALTO",
          cor: "#ef4444",
          desc: "Exige certificado digital A1, integração com SEFAZ estadual e bibliotecas específicas. Considere usar foco nfe, NF-e.io ou similar para abrair isso.",
        },
        {
          titulo: "Pagamentos e estornos",
          nivel: "MÉDIO",
          cor: "#f97316",
          desc: "Webhooks do Mercado Pago precisam de URL pública. Em dev, use ngrok. Em prod, certifique-se que a rota /api/webhooks está pública e valida a assinatura.",
        },
        {
          titulo: "Controle de estoque preciso",
          nivel: "MÉDIO",
          cor: "#f97316",
          desc: "Baixa automática exige mapeamento ingrediente→produto com quantidades. Erro aqui gera inconsistência grave. Comece com baixa manual e automatize depois.",
        },
        {
          titulo: "Limites do Vercel Serverless",
          nivel: "MÉDIO",
          cor: "#f97316",
          desc: "Funções têm timeout de 10s no free e 60s no Pro. Relatórios pesados podem estourar. Use background jobs (Vercel Cron Jobs ou QStash para tarefas longas).",
        },
        {
          titulo: "Segurança do painel admin",
          nivel: "MÉDIO",
          cor: "#f97316",
          desc: "Todo endpoint /api/admin/* deve verificar role no token JWT. Use middleware global para proteger rotas — não confie só no frontend.",
        },
        {
          titulo: "Conflito de pedidos simultâneos",
          nivel: "BAIXO",
          cor: "#f59e0b",
          desc: "Se dois atendentes alteram o mesmo pedido ao mesmo tempo. Adicione um campo updatedAt e verifique conflito antes de salvar (optimistic locking).",
        },
      ].map((d) => (
        <div
          key={d.titulo}
          style={{
            background: "#0f172a",
            border: `1px solid ${d.cor}33`,
            borderRadius: 8,
            padding: "14px 18px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, fontFamily: "sans-serif" }}>{d.titulo}</span>
            <span
              style={{
                background: `${d.cor}22`,
                color: d.cor,
                padding: "2px 10px",
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                fontFamily: "monospace",
              }}
            >
              {d.nivel}
            </span>
          </div>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: 12, lineHeight: 1.7, fontFamily: "sans-serif" }}>{d.desc}</p>
        </div>
      ))}
    </div>
  ),

  melhorias: (
    <div style={{ display: "grid", gap: 14 }}>
      <p style={{ color: "#94a3b8", marginBottom: 8, fontFamily: "sans-serif", fontSize: 13 }}>
        Funcionalidades que elevam o valor percebido e justificam a mensalidade.
      </p>

      {[
        {
          icon: "📲",
          titulo: "PWA (Progressive Web App)",
          desc: "Com Service Worker e manifest, o cliente instala o 'app' direto do celular sem passar pela App Store. Ícone na tela inicial, funciona offline no cardápio. Impacto enorme na percepção.",
        },
        {
          icon: "🔔",
          titulo: "Notificações push de status",
          desc: "Avisar o cliente quando o pedido saiu para entrega via push notification (Web Push API). Reduz chamadas no WhatsApp e aumenta satisfação.",
        },
        {
          icon: "📊",
          titulo: "Dashboard com insights de negócio",
          desc: "Mostrar 'horário de pico', 'produto mais lucrativo', 'clientes que sumiram há 30 dias'. Dados que o dono usa para tomar decisões reais.",
        },
        {
          icon: "🎁",
          titulo: "Programa de fidelidade",
          desc: "A cada X reais gastos, o cliente ganha pontos que viram desconto. Simples de implementar, difícil de copiar, e o dono ama porque fideliza.",
        },
        {
          icon: "⭐",
          titulo: "Avaliação pós-pedido",
          desc: "Email/WhatsApp automático após entrega pedindo nota de 1-5. Alimenta um dashboard de satisfação. NPS básico que nenhum sistema pequeno tem.",
        },
        {
          icon: "🗺️",
          titulo: "Área de entrega configurável",
          desc: "Admin define raio de entrega por CEP ou bairro, com taxa automática. Evita pedidos impossíveis de entregar e profissionaliza o processo.",
        },
        {
          icon: "📅",
          titulo: "Agendamento de pedidos",
          desc: "Cliente faz pedido para retirada às 12h30. Diferencial enorme para almoço. Pouco usado em sistemas pequenos.",
        },
        {
          icon: "🧾",
          titulo: "Relatório mensal automatizado",
          desc: "Email automático todo dia 1º com resumo do mês anterior: faturamento, crescimento, top produtos. O dono recebe sem precisar entrar no sistema.",
        },
      ].map((m) => (
        <div
          key={m.titulo}
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 8,
            padding: "14px 18px",
            display: "flex",
            gap: 14,
          }}
        >
          <span style={{ fontSize: 24, lineHeight: 1 }}>{m.icon}</span>
          <div>
            <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, marginBottom: 6, fontFamily: "sans-serif" }}>{m.titulo}</div>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: 12, lineHeight: 1.7, fontFamily: "sans-serif" }}>{m.desc}</p>
          </div>
        </div>
      ))}
    </div>
  ),

  preco: (
    <div>
      <p style={{ color: "#94a3b8", marginBottom: 24, fontFamily: "sans-serif", fontSize: 13 }}>
        Referência de precificação para dev em formação vendendo para PME no Brasil.
      </p>

      <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
        {[
          {
            plano: "Desenvolvimento Inicial",
            valor: "R$ 2.500 – R$ 5.000",
            cor: "#10b981",
            desc: "Entrega do MVP completo (cardápio, pedidos, painel básico, Pix). Única vez. Negocie entrada de 50% e restante na entrega.",
            inclusos: ["Cardápio + Carrinho", "Pedidos + Status", "Painel Admin básico", "Pagamento Pix", "30 dias de suporte incluso"],
          },
          {
            plano: "Mensalidade — Básico",
            valor: "R$ 300 – R$ 500 /mês",
            cor: "#3b82f6",
            desc: "Hospedagem, manutenção, atualizações de segurança e suporte via WhatsApp em horário comercial.",
            inclusos: ["Hospedagem na Vercel", "Banco de dados Neon", "Suporte via WhatsApp", "Correção de bugs", "Atualizações de segurança"],
          },
          {
            plano: "Mensalidade — Completo",
            valor: "R$ 600 – R$ 900 /mês",
            cor: "#8b5cf6",
            desc: "Tudo do básico + novas funcionalidades incrementais, relatórios, integrações e melhorias de UX mensais.",
            inclusos: ["Tudo do plano básico", "1 nova funcionalidade/mês", "Relatórios automatizados", "Backup semanal", "SLA de resposta: 4h"],
          },
        ].map((p) => (
          <div
            key={p.plano}
            style={{
              background: "#0f172a",
              border: `1px solid ${p.cor}44`,
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15, fontFamily: "sans-serif" }}>{p.plano}</div>
              <div style={{ color: p.cor, fontWeight: 800, fontSize: 16, fontFamily: "monospace", textAlign: "right" }}>{p.valor}</div>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, fontFamily: "sans-serif", margin: "0 0 12px" }}>{p.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {p.inclusos.map((item, i) => (
                <span
                  key={i}
                  style={{
                    background: `${p.cor}15`,
                    color: p.cor,
                    padding: "3px 10px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "monospace",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#1e293b",
          borderRadius: 10,
          padding: 20,
          border: "1px solid #334155",
        }}
      >
        <p style={{ color: "#f59e0b", fontWeight: 700, margin: "0 0 12px", fontFamily: "sans-serif" }}>💡 Dicas estratégicas de precificação</p>
        {[
          "Sempre inclua contrato com multa rescisória de 3 meses — protege seu trabalho.",
          "Cobre o domínio e hospedagem separado (passe o custo real + margem de 30%).",
          "Ofereça desconto de 10% para contrato anual — garante previsibilidade de receita.",
          "Nunca entregue acesso ao código-fonte no contrato básico — é seu ativo.",
          "Adicione cláusula de reajuste anual pelo IGPM ou IPCA.",
          "Documente tudo que foi combinado por escrito, mesmo no WhatsApp.",
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "#cbd5e1", fontFamily: "sans-serif", lineHeight: 1.5 }}>
            <span style={{ color: "#f59e0b" }}>→</span>
            {tip}
          </div>
        ))}
      </div>
    </div>
  ),
};

type SectionKey = keyof typeof sections;

export default function BurgerRoadmap() {
  const [active, setActive] = useState<SectionKey>("arquitetura");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#e2e8f0",
        fontFamily: "sans-serif",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "inline-block",
              background: "#f9731615",
              border: "1px solid #f9731633",
              color: "#f97316",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              padding: "4px 14px",
              borderRadius: 4,
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            Plano Técnico Completo
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 900,
              margin: "0 0 8px",
              color: "#f8fafc",
              letterSpacing: -0.5,
            }}
          >
            🍔 T.T. Burger — Sistema de Gestão
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>
            Roadmap técnico para transformar o site atual em um sistema completo de gestão para hamburgueria.
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 24,
            background: "#0f172a",
            padding: 6,
            borderRadius: 10,
            border: "1px solid #1e293b",
          }}
        >
          {(Object.keys(sections) as SectionKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                background: active === key ? sections[key].color : "transparent",
                color: active === key ? "#fff" : "#64748b",
                border: "none",
                borderRadius: 6,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: active === key ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {sections[key].label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            background: "#0a0f1e",
            borderRadius: 12,
            padding: 24,
            border: "1px solid #1e293b",
            minHeight: 400,
          }}
        >
          <h2
            style={{
              color: sections[active].color,
              fontSize: 16,
              fontWeight: 800,
              marginTop: 0,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {sections[active].label}
          </h2>
          {content[active]}
        </div>

        <p style={{ color: "#334155", fontSize: 11, textAlign: "center", marginTop: 16 }}>
          Gerado com base no projeto T.T. Burger exportado em 04/03/2026
        </p>
      </div>
    </div>
  );
}