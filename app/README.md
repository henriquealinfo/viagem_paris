# Paris — App de Viagem

App mobile para acompanhar o roteiro de 5 dias em Paris. Feito para ser **fácil de usar no celular**, com letras grandes e botões amplos.

## O que tem no app

- **Início** — visão geral e acesso rápido a cada dia
- **Roteiro** — 5 dias com horário, foto, local, preço (€ e R$) e link de reserva
- **Reservas** — links oficiais (Louvre, Torre Eiffel, Disney, Navigo…)
- **Dicas** — Louvre grátis, câmbio, Navigo e dicas práticas
- **Datas** — toque em cada dia e preencha a data real (fica salva no celular)

## Versão online (recomendado)

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
├── js/data.js      # Roteiro, fotos e preços
├── js/app.js       # Navegação
├── manifest.json   # Instalar como app
├── sw.js           # Funciona offline (roteiro salvo)
└── icons/          # Ícone na tela inicial
```

## Personalizar

- **Câmbio:** edite `cambio: 6.2` em `js/data.js`
- **Datas:** preenchidas no próprio app (salvas automaticamente)
- **Fotos:** URLs em `js/data.js` (Wikimedia Commons)

## Requisitos

- Navegador moderno (Chrome, Safari, Edge)
- Python 3 (só para servir localmente; opcional se publicar online)
