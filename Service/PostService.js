const Post = require('../models/Post');

class PostService {
  async criarPost(dados) {
    const { conteudo, autorId } = dados;
    if (!conteudo || !autorId) {
      throw new Error('Preencha todos os campos');
    }
    const post = new Post({ conteudo, autorId });
    await post.save();
    return post;
  }

  async listarPosts() {
    return await Post.find().populate('autorId', 'nome email');
  }

  async listarPostsPorUsuario(id) {
    return await Post.find({ autorId: id }).populate('autorId', 'nome email');
  }

  async atualizarPost(id, dados) {
    const post = await Post.findById(id);
    if (!post) throw new Error('Post não encontrado');
    if (dados.conteudo) post.conteudo = dados.conteudo;
    await post.save();
    return post;
  }

  async deletarPost(id) {
    return await Post.findByIdAndDelete(id);
  }
}

module.exports = new PostService();
