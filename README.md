# Viagem à Paris

Planejamento completo de viagem de 5 dias a Paris: planilha de custos + app mobile para acompanhar o roteiro no celular.

| Versão | Pasta | Uso |
|--------|-------|-----|
| **Planilha** | `Custo_Viagem_Paris.xlsx` | Custos, roteiro, links e Louvre grátis (Excel) |
| **App mobile** | `app/` | PWA instalável no celular (fotos, preços, reservas) |

**App online:** [henriquealinfo.github.io/viagem_paris](https://henriquealinfo.github.io/viagem_paris/)

---

## App mobile (PWA)

Roteiro dia a dia com:
- Fotos dos lugares
- Horários, transporte e preços (€ e R$)
- Links oficiais de reserva
- Datas editáveis (salvas no celular)
- Interface grande e simples

### Instalar no celular

1. Abra o link online acima no navegador
2. **Android:** Chrome → ⋮ → **Instalar app**
3. **iPhone:** Safari → Compartilhar → **Adicionar à Tela de Início**

### Testar localmente

```bash
cd app
python -m http.server 8080
```

Ou dê dois cliques em `app/iniciar.bat`.

---

## Planilha Excel

Gerada pelo script Python:

```bash
pip install openpyxl
python criar_planilha_paris.py
```

Abas: Custos · Roteiro 5 Dias · Links e Reservas · Louvre Grátis · Resumo e Dicas

---

## Publicar no GitHub Pages

1. Envie o código para um repositório **público** no GitHub
2. **Settings → Pages → Source:** GitHub Actions
3. Aguarde o workflow **Deploy PWA no GitHub Pages**
4. Acesse `https://SEU_USUARIO.github.io/viagem_paris/`

```bash
git add .
git commit -m "Atualizar app"
git push
```

---

## Estrutura

```
Viagem/
├── criar_planilha_paris.py
├── Custo_Viagem_Paris.xlsx
├── app/
│   ├── index.html
│   ├── manifest.json
│   ├── sw.js
│   ├── css/style.css
│   ├── js/data.js          # Roteiro, fotos, preços
│   ├── js/app.js
│   └── icons/
└── .github/workflows/
    └── deploy-pages.yml
```
