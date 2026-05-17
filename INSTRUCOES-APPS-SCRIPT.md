# Instalação do Apps Script — Controle de Atendimentos

## O que isso faz
Permite que o dashboard salve as marcações de atendimento e convites pré-parto
diretamente na planilha Google Sheets, sem precisar de login.

## Passo a passo

1. Abra a planilha da Dra. Liliane:
   https://docs.google.com/spreadsheets/d/1DPxDKTXGy4hBnsggdWfPfIkAiznT-GEEn01oFKB3GR4

2. No menu superior, clique em **Extensões → Apps Script**

3. Apague todo o código que aparecer na tela

4. Copie todo o conteúdo do arquivo `apps-script-controle.gs` e cole lá

5. Clique em **Salvar** (ícone de disquete)

6. Clique em **Implantar → Nova implantação**

7. Em "Tipo", selecione **App da Web**

8. Preencha:
   - Descrição: `Controle de Atendimentos Dashboard`
   - Executar como: **Eu (seu email)**
   - Quem tem acesso: **Qualquer pessoa**

9. Clique em **Implantar**

10. Copie a URL que aparecer (começa com `https://script.google.com/macros/s/...`)

11. Abra o arquivo `dashboard.html` e substitua a linha:
    ```
    const APPS_SCRIPT_URL = '';
    ```
    pela URL copiada:
    ```
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/SUA_URL_AQUI/exec';
    ```

12. Salve o `dashboard.html` e faça push para o GitHub

## Após atualizar o código do Apps Script

Sempre que alterar o código do Apps Script, você precisa criar uma **nova implantação**
(não editar a existente) para que as mudanças entrem em vigor.
