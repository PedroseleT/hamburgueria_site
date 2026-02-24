import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Utensils } from "lucide-react";

// 1. Tipagem baseada no seu modelo "Menu"
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  available: boolean;
}

export default async function AdminDashboard() {
  // 2. Usando "menu" em vez de "product" (conforme seu schema.prisma)
  let produtos: MenuItem[] = [];
  
  try {
    const data = await prisma.menu.findMany({
      orderBy: { createdAt: 'desc' }
    });
    produtos = data as MenuItem[];
  } catch (error) {
    console.error("Erro ao buscar cardápio:", error);
  }

  return (
    <div style={adminContainerStyle}>
      <div style={contentWrapperStyle}>
        <header style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Painel Administrativo</h1>
            <p style={subtitleStyle}>Gerencie os itens do seu cardápio</p>
          </div>
          <Link href="/admin/novo" style={addBtnStyle}>
            <Plus size={20} /> Novo Item
          </Link>
        </header>

        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: "#1a1a1a" }}>
                <th style={thStyle}>Item</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Preço</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length > 0 ? (
                produtos.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #222" }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{item.description}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ 
                        fontSize: '11px', 
                        padding: '2px 8px', 
                        borderRadius: '10px',
                        backgroundColor: item.available ? '#064e3b' : '#450a0a',
                        color: item.available ? '#4ade80' : '#f87171'
                      }}>
                        {item.available ? 'Disponível' : 'Esgotado'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#4ade80', fontWeight: 'bold' }}>
                        R$ {item.price.toFixed(2)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <Edit size={18} color="#60a5fa" cursor="pointer" />
                        <Trash2 size={18} color="#f87171" cursor="pointer" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                    Nenhum item cadastrado no cardápio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Estilos mantidos para consistência
const adminContainerStyle: React.CSSProperties = { minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#fff", padding: "120px 20px" };
const contentWrapperStyle: React.CSSProperties = { maxWidth: "1000px", margin: "0 auto" };
const headerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const titleStyle: React.CSSProperties = { fontSize: "24px", fontWeight: "bold", textTransform: "uppercase" };
const subtitleStyle: React.CSSProperties = { color: "#888", fontSize: "14px" };
const addBtnStyle: React.CSSProperties = { backgroundColor: "#b91c1c", color: "#fff", padding: "10px 20px", borderRadius: "5px", textDecoration: "none", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" };
const tableContainerStyle: React.CSSProperties = { backgroundColor: "#111", borderRadius: "8px", border: "1px solid #222", overflow: "hidden" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse" };
const thStyle: React.CSSProperties = { textAlign: "left", padding: "15px", color: "#888", fontSize: "12px", textTransform: "uppercase" };
const tdStyle: React.CSSProperties = { padding: "15px" };