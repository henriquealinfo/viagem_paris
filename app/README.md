# Roma + Paris — App de Viagem

App mobile para acompanhar o roteiro de **10 a 17 de outubro de 2026**: Roma, voo para Paris, Disneyland Park e Versalhes. Feito para ser **fácil de usar no celular**, com letras grandes e botões amplos.

## O que tem no app

- **Início** — voos, clima das duas cidades e acesso rápido a cada dia
- **Roteiro** — 8 dias (embarque + 11 a 17/out) com horário, foto, local, preço (€ e R$) e link oficial
- **Reservas** — Vaticano, Coliseu, Torre Eiffel, Disney, Versalhes e os demais ingressos
- **Frases** — italiano e francês, com áudio
- **Dicas** — logística do guia, orçamento de referência e ETIAS
- **Datas** — já preenchidas; toque para ajustar (fica salvo no celular)

## Versão online

**https://henriquealinfo.github.io/viagem_paris/**

Abra no celular e adicione à tela inicial — funciona de qualquer lugar, sem Wi-Fi do PC.

---

## Como abrir localmente (teste)

### Opção 1 — Mesma rede Wi-Fi

1. No computador, abra o terminal nesta pasta `app`:
   ```powershell
   cd "C:\Users\Henrique\Documents\Python\Viagem\app"
   python -m http.server 8080
   ```
2. Descubra o IP do PC (no PowerShell): `ipconfig` → anote o IPv4 (ex.: `192.168.1.10`)
3. No celular (mesmo Wi-Fi), abra o navegador e acesse:
   ```
   http://192.168.1.10:8080
   ```
4. **iPhone:** Safari → Compartilhar → "Adicionar à Tela de Início"
5. **Android:** Chrome → menu ⋮ → "Instalar app" ou "Adicionar à tela inicial"

### Opção 2 — Script rápido (Windows)

Dê dois cliques em `iniciar.bat` — ele mostra o endereço para abrir no celular.

## Estrutura

```
app/
├── index.html      # Página principal
├── css/style.css   # Visual mobile
├── js/data.js      # Roteiro Roma + Paris
├── js/app.js       # Navegação
├── manifest.json   # Instalar como app
├── sw.js           # Funciona offline
└── icons/          # Ícone na tela inicial
```

## Personalizar

- **Câmbio:** o guia usa €1 ≈ R$ 5,90 (`cambio` em `js/data.js`)
- **Hotel de Paris:** preencha no card de emergência da tela inicial
- **Voo Roma → Paris e CDG → GRU:** confirme horário e grave na aba Reservas
