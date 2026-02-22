"use client";

export default function Contato() {
  return (
    <main style={{ padding: "140px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "60px", color: "#b91c1c" }}>
        FALE CONOSCO
      </h1>

      <p style={{ color: "#ccc" }}>
        Quer falar com a gente?
        Envie sua dúvida, sugestão, elogio ou venha fazer parte do nosso time!
      </p>

      <form
        style={{
          marginTop: "40px",
          maxWidth: "600px",
          marginInline: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <input placeholder="Seu nome" style={inputStyle} />
        <input placeholder="Seu e-mail" style={inputStyle} />
        <textarea placeholder="Sua mensagem..." style={textareaStyle} />
        <button style={btnStyle}>ENVIAR</button>
      </form>
    </main>
  );
}

const inputStyle = {
  padding: "15px",
  background: "#111",
  border: "1px solid #333",
  color: "#fff",
  borderRadius: "5px",
};

const textareaStyle = {
  padding: "15px",
  height: "150px",
  background: "#111",
  border: "1px solid #333",
  color: "#fff",
  borderRadius: "5px",
};

const btnStyle = {
  padding: "15px",
  background: "#b91c1c",
  border: "none",
  color: "#fff",
  fontWeight: "bold",
  borderRadius: "5px",
  cursor: "pointer",
};