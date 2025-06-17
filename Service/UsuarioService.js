const Usuario = require('../models/Usuario');

class UsuarioService {
  async criarUsuario(dados) {
    const { nome, email, senha } = dados;

    if (!nome || !email || !senha) {
      throw new Error('Preencha todos os campos');
    }

    const existente = await Usuario.findOne({ email });
    if (existente) {
      throw new Error('Email já cadastrado');
    }

    const usuario = new Usuario({ nome, email });
    await usuario.setSenha(senha);
    await usuario.save();
    return usuario;
  }

  async autenticar(email, senha) {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      throw new Error('Email ou senha inválidos');
    }
    const senhaValida = await usuario.validarSenha(senha);
    if (!senhaValida) {
      throw new Error('Email ou senha inválidos');
    }
    return usuario;
  }

  async atualizarUsuario(id, dados) {
    const usuario = await Usuario.findById(id);
    if (!usuario) throw new Error('Usuário não encontrado');

    if (dados.nome) usuario.nome = dados.nome;
    if (dados.email) usuario.email = dados.email;
    if (dados.senha) await usuario.setSenha(dados.senha);

    await usuario.save();
    return usuario;
  }

  async listarUsuarios() {
    return await Usuario.find();
  }

  async deletarUsuario(id) {
    return await Usuario.findByIdAndDelete(id);
  }
}

module.exports = new UsuarioService();
