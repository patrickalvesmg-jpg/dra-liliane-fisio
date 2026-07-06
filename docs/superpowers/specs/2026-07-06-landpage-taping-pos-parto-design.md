# Land Page — Taping Pós-Parto (Google Ads)

**Data:** 2026-07-06
**Cliente:** Dra. Liliane Araújo — Fisioterapia Gestação & Pós-Parto · João Pessoa/PB
**Objetivo:** Land page única para tráfego pago (Google Ads) na palavra-chave "taping pós-parto" (e variações), convertendo em conversa no WhatsApp. Meta: Índice de Qualidade alto (8–10) para chegar ao topo da busca com CPC baixo.

---

## Decisões travadas

| Ponto | Decisão |
|---|---|
| Ação única | WhatsApp direto (`wa.me` com mensagem pré-escrita do tema) |
| Visual | Reaproveitar identidade atual — roxo #B090A5 + creme, Montserrat/Cormorant Garamond |
| Eixo central | Recuperação pós-parto ampla com taping (inchaço + sustentação + cicatriz + conforto) |
| Gancho de topo | "Fisioterapeuta, não esteticista" |
| Slug/URL | `/taping-pos-parto` (casa com o termo de maior volume validado na ferramenta do Google) |
| Arquivo | `taping-pos-parto.html` na raiz do projeto |

## Palavra-chave e variações (SEO on-page + Índice de Qualidade)

- **Principal:** taping pós-parto joão pessoa (no `<title>`, H1 e ≥2 subtítulos)
- **Variações no corpo (grafias que as pessoas usam):** tape pós-parto · kinesio taping · bandagem pós-parto · taping compressivo
- "João Pessoa" mencionado 3–4x naturalmente
- Message match: H1 da página ≈ palavra-chave do anúncio ≈ busca da pessoa

---

## Arquitetura da página (squeeze page — sem menu, sem links de fuga)

1. **Hero** — H1 "Taping pós-parto em João Pessoa"; subtítulo com gancho "aplicado por fisioterapeuta, não esteticista"; foto da Dra. (Foto 2.png); botão WhatsApp acima da dobra; selo CREFITO/local.
2. **O que o taping resolve** — 4 microcards: reduz inchaço (edema) · sustentação abdominal · alívio de tensão na cicatriz da cesárea · conforto para amamentar/levantar/segurar o bebê. Copy adaptada do portfolio (linha ~2387, já clínica). Menciona que cinta não é recomendada — taping compressivo é a alternativa clínica.
3. **Antes/depois** — carrossel com fotos reais de taping: Foto 8/9/10 (Antes+Depois). Prova visual — o que mais converte no tema.
4. **Por que fisioterapeuta faz diferença** — argumento de autoridade: avalia antes de aplicar, prescreve, identifica intercorrências, assume responsabilidade clínica, CREFITO. Diferencia de quem "só aplica a fita".
5. **Atendo em casa** — conveniência: vou até você (domiciliar/maternidade), não precisa sair com recém-nascido.
6. **Depoimentos** — 3 prints reais existentes (Print Depoimento 1/2/3.jpg).
7. **CTA final** — recado acolhedor + botão WhatsApp.
8. **WhatsApp flutuante** — fixo (mesmo padrão do site atual).

## O que NÃO entra (YAGNI / foco de conversão)

- Sem planos/preços (objetivo é a conversa; preço a Dra. passa no WhatsApp)
- Sem menu de navegação
- Sem links para outras páginas do site (evita fuga do tráfego pago)

---

## Aspectos técnicos

- Página estática única `taping-pos-parto.html` na raiz.
- **GTM** instalado (mesmo container GTM-W8N43S2W) para medir conversões.
- Todos os CTAs → `https://wa.me/5583999254499?text=` com texto "Olá Dra. Liliane! Quero saber sobre o taping pós-parto".
- **SEO/OG:** `<title>`, meta description, canonical próprio (`https://lilianearaujofisio.com.br/taping-pos-parto`), Open Graph (usa og-preview.png ou imagem de taping), Schema.org MedicalBusiness/MedicalProcedure.
- **Reaproveita assets já no projeto:** Logo.png, Foto 2.png, Foto 8/9/10 Antes/Depois.jpg, Print Depoimento 1/2/3.jpg, ícones WhatsApp SVG.
- Mobile-first (tráfego pago é majoritariamente mobile), reveal on scroll, `prefers-reduced-motion` respeitado.
- Redirect opcional: criar `taping-pos-parto` sem extensão via GitHub Pages já resolve com o CNAME.

## Critérios de sucesso

- H1/title/URL contêm a palavra-chave → Índice de Qualidade alto.
- Uma única ação clara (WhatsApp) acima da dobra e repetida ao longo da página.
- Prova visual (antes/depois) + prova social (depoimentos) + autoridade (fisioterapeuta) na mesma página.
- Carrega rápido no mobile, sem dependências externas além de fontes e GTM.
