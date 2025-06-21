const fs = require('fs');
const path = require('path');

const caminhoLog = path.join(__dirname, 'erros.log');

function logErro(erro) {
  const timestamp = new Date().toISOString();
  const mensagem = `[${timestamp}] ${erro.stack || erro}\n`;

  fs.appendFile(caminhoLog, mensagem, (err) => {
    if (err) {
      console.error('Erro ao salvar log:', err);
    }
  });
}

module.exports = logErro;
