const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senhaHash: { type: String, required: true }, // senha criptografada
});

// Método para setar senha (hash)
UsuarioSchema.methods.setSenha = async function (senha) {
  const salt = await bcrypt.genSalt(10);
  this.senhaHash = await bcrypt.hash(senha, salt);
};

// Método para validar senha
UsuarioSchema.methods.validarSenha = async function (senha) {
  return await bcrypt.compare(senha, this.senhaHash);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
