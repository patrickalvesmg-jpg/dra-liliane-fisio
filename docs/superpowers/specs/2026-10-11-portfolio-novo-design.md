# Portfólio novo — Dra. Liliane (design)

Data: 11/10/2026 · Aprovado por Patrick em conversa (seções 1-3); ele pediu para pular a revisão do documento e construir direto.

## Objetivo
Refazer `portfolio.html` com visual mais vivo e profissional (animações guiadas pela rolagem), **sem mudar nenhuma palavra** do conteúdo aprovado pela Dra. A página é enviada **dentro da conversa do WhatsApp** — leitora já interessada, no celular, muitas vezes no navegador embutido do WhatsApp.

## Decisões
- **Destino:** `portfolio-novo.html` (noindex, fora do sitemap) → depois da aprovação da Dra. vira `portfolio.html`; o atual fica como `portfolio-antigo.html`.
- **Conteúdo:** mesmo texto, pode reorganizar. Novos só os controles: abas "Pós-parto / Pré-parto" e "Ver tudo que está incluso / Mostrar menos".
- **Material:** só fotos existentes. Fotos de taping de sustentação pré-parto (Foto 4-7, Bio site 1/3/4) **não entram** — técnica saiu do portfólio em set/2026.
- **Direção visual:** B "cinematográfico" (ameixa escuro + brilho lilás), em **atos**: escuro emociona (abertura, sobre, resultados, como funciona, contato), claro decide (por que fisio, depoimentos, planos). Passagens em gradiente.
- **Tecnologia:** GSAP 3.13 + ScrollTrigger via CDN (jsDelivr), guiado pelo método do scroll-craft (cada seção com um movimento diferente, verificação por prints). Página continua arquivo único estático (GitHub Pages).
- **Aviso "Reserva sem pagamento prévio"** sai da faixa fixa e vai para dentro dos planos. **Sem botão flutuante de WhatsApp** (a leitora já está na conversa).
- **Mantidos:** 8 links de WhatsApp idênticos, popup do presente (mesmos textos, visual novo), GTM-W4J7FPWK, barra de progresso com nome da seção.

## Movimento por seção
| Seção | Movimento |
|---|---|
| Abertura | brilho pulsando + anel girando; foto com entrada suave |
| Frase de abertura | tela fica parada enquanto a frase acende trecho por trecho (scrub) |
| Sobre | foto revela de baixo pra cima em moldura de arco; parágrafos em sequência |
| Por que fisio | cartões em cascata, ícones se desenham, números com parallax |
| Taping | galeria horizontal presa, anda de lado com a rolagem |
| Laserterapia ★ | cortina: "antes" vira "depois" no ritmo da rolagem (pares Foto 11 e 12) |
| Drenagem | par se aproxima dos dois lados (Foto 13 tem ângulos diferentes — sem cortina) |
| Como funciona | linha vertical se desenha; etapa acende quando a linha chega |
| Depoimentos | prints deslizam sozinhos devagar; arrastar/setas |
| Planos | movimento mínimo de propósito; abas + listas recolhíveis |
| Contato | escuro com brilho, foto, botão WhatsApp com brilho discreto |

Sem JS / CDN fora / "movimento reduzido": tudo visível, sem pins, carrosséis com rolagem nativa.

## Fotos
WebP otimizadas em `img/novo/` (originais intactos): 11,9 MB → 1,33 MB.

## Verificação
Diff de texto visível antigo × novo (palavra por palavra, ignorando maiúsculas); 8 links WhatsApp idênticos; prints celular/desktop/movimento reduzido em várias alturas; console sem erros; vocabulário clínico ("contensivo").
