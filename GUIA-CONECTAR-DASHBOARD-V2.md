# Conectar o dashboard v2 à planilha 2026-2028

O que já está pronto e o que depende de você. O dashboard antigo (`dashboard.html`)
e o script antigo (`apps-script-controle.gs`) **não foram tocados** — continuam
funcionando com a planilha atual enquanto você testa o novo.

## Arquivos novos

| Arquivo | O que é |
|---|---|
| `dashboard-v2.html` | Cópia do dashboard, remapeada para as 17 colunas |
| `apps-script-controle-v2.gs` | Script de escrita, atualizado para 17 colunas |

---

## O que MUDOU na leitura

A aba Vendas passou de 15 para **17 colunas** — `Ano do Atendimento` (D) e
`Ano da Venda` (Q) são novas, e empurraram tudo que vinha depois.

O dashboard antigo lia as colunas por número solto (`r[12]`, `r[13]`…), o que
quebrava silenciosamente. O v2 usa um mapa nomeado no topo do `<script>`:

```js
const COL = { nome:0, dataParto:1, mesPrevisto:2, anoAtendimento:3, mesRealizado:4,
              origem:5, pacote1:6, pacote2:7, qtdCalcinha:8, valPacotes:9,
              valCalcinha:10, custo:11, valTotal:12, status:13, dataVenda:14,
              mesVenda:15, anoVenda:16 };
```

Se algum dia a planilha mudar de ordem de novo, corrige-se **só esse bloco**.

### Regra de ano (igual à da planilha)

- **Total Vendido / Vendas Fechadas** → `Ano da Venda` (coluna Q)
- **Fat. Realizado, Fat. Agendado, Lucro, Custo, calendário** → `Ano do Atendimento` (coluna D)

Por isso, em 2026: `16.077 + 35.250 = 51.327`, mas Total Vendido = `55.727`.
A diferença de **R$ 4.400** é o que foi vendido em 2026 para atender em 2027.
Isso é intencional, não é erro de conta.

---

## PASSOS 1 a 3 — CONCLUÍDOS ✅

A planilha já está no Drive, pública para leitura, e o `dashboard-v2.html` já
aponta para ela:

```js
const SHEET_ID   = '1U36W0abt4e_Fvi6qH2vMPOeB7p-JIY80o-j5NdJ1Pp8';
const GID_VENDAS = '1246185189';
const GID_INVEST = '470768834';
const GID_LEADS  = '517397463';
```

Leitura testada ao vivo — ver "Já testado" no fim deste guia.

## PASSO 4 — CONCLUÍDO ✅

Apps Script v2 implantado e conectado:

```js
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTJbIY7NA8-jmsI-jrHxI_B1g4Xvai3c50O3qaLRH61ECqimYmIA0Bzfsm2WOjzrH2/exec';
```

### Referência de instalação (caso precise reimplantar)

1. Na planilha nova: **Extensões → Apps Script**
2. Apague o conteúdo e cole o de `apps-script-controle-v2.gs`
3. **Implantar → Nova implantação → App da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
4. Copie a URL gerada (`https://script.google.com/macros/s/.../exec`) e me mande.

> ⚠️ Use o **v2**. O script antigo grava o status na coluna 13, que agora é
> `VALOR TOTAL` — ele sobrescreveria os valores das vendas.

## PASSO 5 — CONCLUÍDO ✅ (leitura e escrita testadas)

## PASSO 6 — Publicar ⬅️ PENDENTE

Falta só o teste visual no navegador e a publicação:

1. Abrir `dashboard-v2.html` no navegador e conferir se as telas carregam
   (KPIs, gráficos, calendário, jornada).
2. Renomear `dashboard.html` → `dashboard-v1-backup.html`
3. Renomear `dashboard-v2.html` → `dashboard.html`
4. `git commit` + `git push` para publicar no GitHub Pages.

---

## Já testado — com a planilha REAL no ar

Baixei o JSON que a planilha publicada devolve e rodei o parser gviz + os
cálculos extraídos do próprio `dashboard-v2.html`:

- 93 linhas recebidas na aba Vendas, **17 colunas** (mapeamento confere)
- 36 linhas em Investimentos
- Poliana lida corretamente: `anoAtend=2027`, `anoVenda=2026`

| Ano | Fat. Realizado | Fat. Agendado | Total Vendido |
|---|---|---|---|
| 2026 | R$ 16.077,00 | R$ 35.250,00 | R$ 55.727,00 |
| 2027 | R$ 0,00 | R$ 4.400,00 | R$ 0,00 |
| 2028 | R$ 0,00 | R$ 0,00 | R$ 0,00 |

Invest. Tráfego 2026: R$ 6.040,00 ✓. As 83 vendas ativas aparecem nos dois eixos
sem duplicar e nenhuma venda de 2027 vaza para o dashboard de 2026.

### Escrita — testada contra a planilha real

Todas as ações foram executadas de verdade e depois revertidas:

| Ação | Resultado |
|---|---|
| `inserirVenda` | 17 colunas no lugar certo; `D=2027` (atendimento) e `Q=2026` (venda) derivados automaticamente das datas |
| `editarVenda` | grava as 17 colunas sem deslocar nada |
| `atualizarStatus` | escreve na coluna **N**; `valTotal` e `dataVenda` permanecem intactos |
| `marcar` / `desmarcar` | aba Controle com a nova coluna `Ano` preenchida |
| `doGet` | devolve as 107 marcações |

Estado final conferido: **93 registros**, nenhuma linha de teste residual,
107 marcações no Controle — exatamente como antes dos testes.

> ⚠️ Ao testar POST por linha de comando, use `fetch` do Node (segue o redirect
> do Google corretamente). O `curl` retorna HTTP 411/405 **mas grava mesmo assim** —
> isso gerou 3 linhas duplicadas aqui, que precisaram ser limpas.
