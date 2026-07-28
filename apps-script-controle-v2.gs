// ═══════════════════════════════════════════════════════════════════════════
// APPS SCRIPT v2 — planilha "Controle de Vendas 2026-2028"
// Cole no Apps Script DA PLANILHA NOVA (Extensões → Apps Script).
//
// ABA "Vendas" — 17 colunas (as duas de ANO são novas):
//   A nome            J valPacotes
//   B dataParto       K valCalcinha
//   C mesPrevisto     L custo (Uber/Mat)
//   D ANO ATENDIM.    M valTotal
//   E mesRealizado    N status        <- era coluna M na planilha antiga
//   F origem          O dataVenda
//   G pacote1         P mesVenda
//   H pacote2         Q ANO DA VENDA
//   I qtdCalcinha
//
// ABA "Controle" — 5 colunas: Cliente | Tipo | Data | Ano | Observação
// ═══════════════════════════════════════════════════════════════════════════

const ABA_CONTROLE = 'Controle';
const ABA_VENDAS   = 'Vendas';

// Índices de coluna (1-based, como o getRange espera)
const C_ANO_ATEND = 4;   // D
const C_STATUS    = 14;  // N
const C_ANO_VENDA = 17;  // Q
const N_COLS      = 17;

const MESES_GS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

// Extrai o ano de uma data em dd/mm/aaaa, aaaa-mm-dd ou de um objeto Date.
function anoDe(valor) {
  if (!valor) return '';
  if (valor instanceof Date) return valor.getFullYear();
  const s = String(valor).trim();
  const br = s.split('/');                       // dd/mm/aaaa
  if (br.length === 3) { const y = parseInt(br[2], 10); if (y > 2020) return y; }
  const iso = s.split('-');                      // aaaa-mm-dd
  if (iso.length === 3) { const y = parseInt(iso[0], 10); if (y > 2020) return y; }
  return '';
}

function doGet(e) {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  let aba   = ss.getSheetByName(ABA_CONTROLE);
  if (!aba) aba = criarAbaControle(ss);

  const dados = aba.getDataRange().getValues();
  const resultado = [];
  for (let i = 1; i < dados.length; i++) {
    const row = dados[i];
    if (!row[0]) continue;
    resultado.push({
      cliente:    String(row[0] || ''),
      tipo:       String(row[1] || ''),
      data:       String(row[2] || ''),
      observacao: String(row[4] || ''),   // Controle v2: D=Ano, E=Observação
    });
  }
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, marcacoes: resultado }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload._delete) payload.action = 'desmarcar';
    if (!payload.action) payload.action = 'marcar';

    switch (payload.action) {
      case 'marcar':          return acaoMarcar(payload);
      case 'desmarcar':       return acaoDesmarcar(payload);
      case 'atualizarStatus': return acaoAtualizarStatus(payload);
      case 'inserirVenda':    return acaoInserirVenda(payload);
      case 'editarVenda':     return acaoEditarVenda(payload);
      default:
        return resposta({ ok: false, erro: 'action desconhecida: ' + payload.action });
    }
  } catch(err) {
    return resposta({ ok: false, erro: err.message });
  }
}

// ── AÇÕES CONTROLE ──────────────────────────────────────────────────────────

function acaoMarcar(p) {
  const { cliente, tipo, data, observacao } = p;
  if (!cliente || !tipo) return resposta({ ok: false, erro: 'cliente e tipo obrigatórios' });

  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  let aba   = ss.getSheetByName(ABA_CONTROLE);
  if (!aba) aba = criarAbaControle(ss);

  const dados = aba.getDataRange().getValues();
  let linhaExistente = -1;
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] === cliente && dados[i][1] === tipo) { linhaExistente = i + 1; break; }
  }

  // Controle v2: Cliente | Tipo | Data | Ano | Observação
  const dataFinal = data || new Date().toISOString().slice(0,10);
  const linha = [
    sanitizar(cliente),
    sanitizar(tipo),
    dataFinal,
    anoDe(dataFinal),
    sanitizar(observacao),
  ];
  if (linhaExistente > 0) {
    aba.getRange(linhaExistente, 1, 1, 5).setValues([linha]);
  } else {
    aba.appendRow(linha);
  }
  return resposta({ ok: true });
}

function acaoDesmarcar(p) {
  const { cliente, tipo } = p;
  if (!cliente || !tipo) return resposta({ ok: false, erro: 'cliente e tipo obrigatórios' });

  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  let aba   = ss.getSheetByName(ABA_CONTROLE);
  if (!aba) return resposta({ ok: true });

  const dados = aba.getDataRange().getValues();
  for (let i = dados.length - 1; i >= 1; i--) {
    if (dados[i][0] === cliente && dados[i][1] === tipo) {
      aba.deleteRow(i + 1);
    }
  }
  return resposta({ ok: true });
}

// ── AÇÕES VENDAS ─────────────────────────────────────────────────────────────

function acaoAtualizarStatus(p) {
  const { nome, dataParto, novoStatus } = p;
  if (!nome || !dataParto || !novoStatus) {
    return resposta({ ok: false, erro: 'nome, dataParto e novoStatus obrigatórios' });
  }

  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(ABA_VENDAS);
  if (!aba) return resposta({ ok: false, erro: 'Aba Vendas não encontrada' });

  const dados = aba.getDataRange().getValues();
  for (let i = 1; i < dados.length; i++) {
    if (normalizar(dados[i][0]) === normalizar(nome) &&
        normalizar(dados[i][1]) === normalizar(dataParto)) {
      aba.getRange(i + 1, C_STATUS).setValue(novoStatus); // coluna N (17 colunas)
      return resposta({ ok: true });
    }
  }
  return resposta({ ok: false, erro: 'Cliente não encontrada: ' + nome + ' / ' + dataParto });
}

function acaoInserirVenda(p) {
  const d = p.dados;
  if (!d || !d.nome) return resposta({ ok: false, erro: 'dados.nome obrigatório' });

  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(ABA_VENDAS);
  if (!aba) return resposta({ ok: false, erro: 'Aba Vendas não encontrada' });

  const linha = montarLinhaVenda(d);
  // Encontra a última linha com dados reais na coluna A para não pular linhas vazias
  const ultLinha = aba.getRange('A:A').getValues().reduce((acc, r, i) => r[0] ? i + 1 : acc, 1);
  aba.getRange(ultLinha + 1, 1, 1, N_COLS).setValues([linha]);
  return resposta({ ok: true });
}

function acaoEditarVenda(p) {
  const { nomeOriginal, dataPartoOriginal, dados: d } = p;
  if (!nomeOriginal || !dataPartoOriginal || !d) {
    return resposta({ ok: false, erro: 'nomeOriginal, dataPartoOriginal e dados obrigatórios' });
  }

  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(ABA_VENDAS);
  if (!aba) return resposta({ ok: false, erro: 'Aba Vendas não encontrada' });

  const dados = aba.getDataRange().getValues();
  for (let i = 1; i < dados.length; i++) {
    if (normalizar(dados[i][0]) === normalizar(nomeOriginal) &&
        normalizar(dados[i][1]) === normalizar(dataPartoOriginal)) {
      const novaLinha = montarLinhaVenda(d);
      aba.getRange(i + 1, 1, 1, N_COLS).setValues([novaLinha]);
      return resposta({ ok: true });
    }
  }
  return resposta({ ok: false, erro: 'Cliente não encontrada: ' + normalizar(nomeOriginal) + ' / ' + normalizar(dataPartoOriginal) });
}

// ── MONTAGEM DA LINHA DE VENDA (17 colunas) ─────────────────────────────────
// Fonte única da ordem das colunas: usada tanto ao inserir quanto ao editar.
// Os dois campos de ANO são derivados das datas automaticamente — assim a venda
// nunca fica fora dos dashboards por esquecimento de preencher o ano.
function montarLinhaVenda(d) {
  const anoAtend = d.anoAtendimento || anoDe(d.dataParto) || '';
  const anoVenda = d.anoVenda       || anoDe(d.dataVenda) || '';
  return [
    sanitizar(d.nome),                  // A  nome
    sanitizar(d.dataParto),             // B  dataParto
    sanitizar(d.mesPrevisto),           // C  mesPrevisto
    anoAtend,                           // D  ANO DO ATENDIMENTO
    sanitizar(d.mesRealizado),          // E  mesRealizado
    sanitizar(d.origem),                // F  origem
    sanitizar(d.pacote1),               // G  pacote1
    sanitizar(d.pacote2),               // H  pacote2
    d.extra       || '',                // I  qtdCalcinha (numérico)
    d.valPacotes  || '',                // J  valPacotes
    d.valExtra    || '',                // K  valCalcinha
    d.custo       || '',                // L  custo Uber/Mat
    d.valTotal    || '',                // M  valTotal
    sanitizar(d.status) || 'Agendado',  // N  status
    sanitizar(d.dataVenda),             // O  dataVenda
    sanitizar(d.mesVenda),              // P  mesVenda
    anoVenda,                           // Q  ANO DA VENDA
  ];
}

// ── UTILITÁRIOS ──────────────────────────────────────────────────────────────

function sanitizar(v) {
  const s = String(v === null || v === undefined ? '' : v);
  // Previne injeção de fórmula: prefixo com apóstrofo se começa com = + - @
  if (s && /^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

function normalizar(v) {
  if (v && typeof v === 'object' && typeof v.getDate === 'function') {
    const d = String(v.getDate()).padStart(2,'0');
    const m = String(v.getMonth()+1).padStart(2,'0');
    const y = v.getFullYear();
    return `${d}/${m}/${y}`;
  }
  const s = String(v === null || v === undefined ? '' : v).trim();
  return s.startsWith("'") ? s.slice(1) : s;
}

function criarAbaControle(ss) {
  const aba = ss.insertSheet(ABA_CONTROLE);
  aba.getRange(1,1,1,5).setValues([['Cliente','Tipo','Data','Ano','Observacao']]);
  aba.setFrozenRows(1);
  return aba;
}

function resposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

