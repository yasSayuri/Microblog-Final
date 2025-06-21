const Usuario = require('../models/Usuario');
const logErro = require('../log'); // importe a função de log que você criou
const Comentario = require('../models/Comentario');
class UsuarioService {
  async criarUsuario(dados) {
    try {
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
    } catch (err) {
      logErro(err);
      throw err;
    }
  }

  async autenticar(email, senha) {
    try {
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        throw new Error('Email ou senha inválidos');
      }
      const senhaValida = await usuario.validarSenha(senha);
      if (!senhaValida) {
        throw new Error('Email ou senha inválidos');
      }
      return usuario;
    } catch (err) {
      logErro(err);
      throw err;
    }
  }

  async atualizarUsuario(id, dados) {
    try {
      const usuario = await Usuario.findById(id);
      if (!usuario) throw new Error('Usuário não encontrado');

      if (dados.nome) usuario.nome = dados.nome;
      if (dados.email) usuario.email = dados.email;
      if (dados.senha) await usuario.setSenha(dados.senha);

      await usuario.save();
      return usuario;
    } catch (err) {
      logErro(err);
      throw err;
    }
  }

  async listarUsuarios() {
    try {
      return await Usuario.find();
    } catch (err) {
      logErro(err);
      throw err;
    }
  }

  async deletarUsuario(id) {
    try {
      return await Usuario.findByIdAndDelete(id);
      await Comentario.deleteMany({ autorId: id });
    } catch (err) {
      logErro(err);
      throw err;
    }
  }
}

module.exports = new UsuarioService();
