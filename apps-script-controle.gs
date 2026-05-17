// Cole este código no Apps Script da planilha da Dra. Liliane
// Planilha: https://docs.google.com/spreadsheets/d/1DPxDKTXGy4hBnsggdWfPfIkAiznT-GEEn01oFKB3GR4

const ABA_CONTROLE = 'Controle';
const ABA_VENDAS   = 'Vendas';

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
      observacao: String(row[3] || ''),
    });
  }
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, marcacoes: resultado }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    // Suporte legado: _delete: true → action: 'desmarcar'
    if (payload._delete) payload.action = 'desmarcar';
    // Suporte legado: sem action → action: 'marcar'
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

  const linha = [sanitizar(cliente), sanitizar(tipo), data || new Date().toISOString().slice(0,10), sanitizar(observacao)];
  if (linhaExistente > 0) {
    aba.getRange(linhaExistente, 1, 1, 4).setValues([linha]);
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
    if (String(dados[i][0]).trim() === nome.trim() &&
        String(dados[i][1]).trim() === dataParto.trim()) {
      aba.getRange(i + 1, 13).setValue(novoStatus); // coluna M = index 12 → coluna 13
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

  // Ordem das colunas: A B C D E F G H I J K L M N O P
  // N (dataContato) fica vazio
  const linha = [
    sanitizar(d.nome),         // A
    sanitizar(d.dataParto),    // B
    sanitizar(d.mesPrevisto),  // C
    sanitizar(d.mesRealizado), // D
    sanitizar(d.origem),       // E
    sanitizar(d.pacote1),      // F
    sanitizar(d.pacote2),      // G
    sanitizar(d.extra),        // H
    d.valPacotes  || '',       // I — numérico, não sanitizar
    d.valExtra    || '',       // J — numérico
    d.custo       || '',       // K — numérico
    d.valTotal    || '',       // L — numérico
    sanitizar(d.status) || 'Agendado', // M
    '',                        // N (dataContato — deixa vazio)
    sanitizar(d.dataVenda),    // O
    sanitizar(d.mesVenda),     // P
  ];
  // Encontra a última linha com dados reais na coluna A para não pular linhas vazias
  const ultLinha = aba.getRange('A:A').getValues().reduce((acc, r, i) => r[0] ? i + 1 : acc, 1);
  aba.getRange(ultLinha + 1, 1, 1, linha.length).setValues([linha]);
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
    if (String(dados[i][0]).trim() === nomeOriginal.trim() &&
        String(dados[i][1]).trim() === dataPartoOriginal.trim()) {
      // Atualiza todas as colunas exceto N (dataContato = coluna 14, índice 13)
      const dataContato = dados[i][13]; // preserva col N (dataContato) sem alterar
      const novaLinha = [
        sanitizar(d.nome),
        sanitizar(d.dataParto),
        sanitizar(d.mesPrevisto),
        sanitizar(d.mesRealizado),
        sanitizar(d.origem),
        sanitizar(d.pacote1),
        sanitizar(d.pacote2),
        sanitizar(d.extra),
        d.valPacotes   || '',
        d.valExtra     || '',
        d.custo        || '',
        d.valTotal     || '',
        sanitizar(d.status),
        dataContato,           // col N — preserva original
        sanitizar(d.dataVenda),
        sanitizar(d.mesVenda),
      ];
      aba.getRange(i + 1, 1, 1, 16).setValues([novaLinha]);
      return resposta({ ok: true });
    }
  }
  return resposta({ ok: false, erro: 'Cliente não encontrada: ' + nomeOriginal + ' / ' + dataPartoOriginal });
}

// ── UTILITÁRIOS ──────────────────────────────────────────────────────────────

function sanitizar(v) {
  const s = String(v === null || v === undefined ? '' : v);
  // Previne injeção de fórmula: prefixo com apóstrofo se começa com = + - @
  if (s && /^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

function criarAbaControle(ss) {
  const aba = ss.insertSheet(ABA_CONTROLE);
  aba.getRange(1,1,1,4).setValues([['Cliente','Tipo','Data','Observacao']]);
  aba.setFrozenRows(1);
  return aba;
}

function resposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
