// Cole este código no Apps Script da planilha da Dra. Liliane
// Planilha: https://docs.google.com/spreadsheets/d/1DPxDKTXGy4hBnsggdWfPfIkAiznT-GEEn01oFKB3GR4

const ABA_CONTROLE = 'Controle';

function doGet(e) {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  let aba    = ss.getSheetByName(ABA_CONTROLE);
  if (!aba)  aba = criarAbaControle(ss);

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
    const { cliente, tipo, data, observacao, _delete } = payload;

    if (!cliente || !tipo) {
      return resposta({ ok: false, erro: 'cliente e tipo são obrigatórios' });
    }

    const ss  = SpreadsheetApp.getActiveSpreadsheet();
    let aba   = ss.getSheetByName(ABA_CONTROLE);
    if (!aba) aba = criarAbaControle(ss);

    const dados = aba.getDataRange().getValues();

    if (_delete) {
      for (let i = dados.length - 1; i >= 1; i--) {
        if (dados[i][0] === cliente && dados[i][1] === tipo) {
          aba.deleteRow(i + 1);
        }
      }
      return resposta({ ok: true });
    }

    let linhaExistente = -1;
    for (let i = 1; i < dados.length; i++) {
      if (dados[i][0] === cliente && dados[i][1] === tipo) {
        linhaExistente = i + 1;
        break;
      }
    }

    const linha = [cliente, tipo, data || new Date().toISOString().slice(0,10), observacao || ''];
    if (linhaExistente > 0) {
      aba.getRange(linhaExistente, 1, 1, 4).setValues([linha]);
    } else {
      aba.appendRow(linha);
    }

    return resposta({ ok: true });
  } catch(err) {
    return resposta({ ok: false, erro: err.message });
  }
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
