const Comentario = require('../models/Comentario');

class ComentarioService {
  async criarComentario(dados) {
    const { conteudo, autorId, postId } = dados;
    if (!conteudo || !autorId || !postId) {
      throw new Error('Preencha todos os campos');
    }
    const comentario = new Comentario({ conteudo, autorId, postId });
    await comentario.save();
    return comentario;
  }

  async listarComentariosPorPost(postId) {
    return Comentario.find({ postId }).populate('autorId', 'nome email');
  }

  async deletarComentario(id) {
    return Comentario.findByIdAndDelete(id);
  }

  async deletarComentariosPorUsuario(usuarioId) {
    return Comentario.deleteMany({ autorId: usuarioId });
  }

  async deletarComentariosPorPost(postId) {
    return Comentario.deleteMany({ postId });
  }
}

module.exports = new ComentarioService();
