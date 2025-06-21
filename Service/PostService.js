const Post = require('../models/Post');
const logErro = require('../log');

class PostService {
  async criarPost(dados) {
    try {
      const { conteudo, autorId } = dados;
      if (!conteudo || !autorId) {
        throw new Error('Preencha todos os campos');
      }
      const post = new Post({ conteudo, autorId });
      await post.save();
      return post;
    } catch (err) {
      logErro(err);
      throw err; 
    }
  }

  async listarPosts() {
    try {
      return await Post.find().populate('autorId', 'nome email');
    } catch (err) {
      logErro(err);
      throw err;
    }
  }

  async listarPostsPorUsuario(id) {
    try {
      return await Post.find({ autorId: id }).populate('autorId', 'nome email');
    } catch (err) {
      logErro(err);
      throw err;
    }
  }

  async atualizarPost(id, dados) {
    try {
      const post = await Post.findById(id);
      if (!post) throw new Error('Post não encontrado');
      if (dados.conteudo) post.conteudo = dados.conteudo;
      await post.save();
      return post;
    } catch (err) {
      logErro(err);
      throw err;
    }
  }

  async deletarPost(id) {
    try {
      return await Post.findByIdAndDelete(id);
    } catch (err) {
      logErro(err);
      throw err;
    }
  }
}

module.exports = new PostService();
