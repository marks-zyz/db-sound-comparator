# 🔊 Comparador de Ruído (dB) – A/B

Uma ferramenta interativa para comparar dois níveis de ruído em decibéis (dB) usando síntese de áudio em tempo real.

## 🎯 O que é?

Este projeto permite que você:
- Define dois valores de dB (A e B)
- Reproduz ruído branco com os níveis configurados
- Alterna entre A e B enquanto o áudio está tocando
- **Ouve** a diferença relativa entre os dois níveis

É perfeito para entender como as mudanças de dB soam de verdade!

## 🌐 Visualizar Online

🔗 **[Abra a aplicação aqui →](https://marks-zyz.github.io/db-sound-comparator/)**

Nenhuma instalação necessária — funciona direto no navegador! 🚀

## 📊 Como Funciona

1. **Insira dois valores de dB** (ex: A=53 dB, B=60 dB)
2. **Clique em Play** para gerar ruído branco
3. **Alterne os botões A/B** enquanto o áudio toca
4. **Escute a diferença** — o mais alto é automaticamente normalizado como referência

### Fórmulas

- **Conversão dB → Ganho**: $ \text{ganho} = 10^{\text{dB}/20} $
- **Delta**: $ \Delta \text{dB} = |dB_A - dB_B| $
- **Razão de amplitude**: $ \text{ratio} = 10^{\Delta \text{dB}/20} $

## 🛠️ Tech Stack

- **React 18** — UI interativa
- **Vite** — Build rápido
- **Web Audio API** — Síntese e reprodução de áudio
- **Tailwind CSS** — Estilização
- **gh-pages** — Deploy automático no GitHub Pages

## 🚀 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm

### Instalação

```bash
git clone https://github.com/marks-zyz/db-sound-comparator.git
cd db-sound-comparator
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173`

### Build para produção

```bash
npm run build
```

Saída em `dist/`.

### Deploy para GitHub Pages

```bash
npm run deploy
```

(Isso faz build, cria o branch `gh-pages` e publica automaticamente.)

## 📝 Licença

MIT — Sinta-se livre para usar, modificar e compartilhar!

---

**Dica**: 3 dB ≈ 2× o volume (perceptível), 10 dB ≈ 10× o volume (muito perceptível).