const express = require('express');
const router = express.Router();
const postService = require('../services/PostService');

// Criar post
router.post('/', async (req, res) => {
  try {
    const post = await postService.criarPost(req.body);
    res.status(201).json({ mensagem: 'Post criado', post });
  } catch (err) {
    res.status(400).json({ mensagem: err.message });
  }
});

// Listar posts
router.get('/', async (req, res) => {
  try {
    const posts = await postService.listarPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao listar posts' });
  }
});

// Listar posts por usuário
router.get('/usuario/:id', async (req, res) => {
  try {
    const posts = await postService.listarPostsPorUsuario(req.params.id);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao listar posts do usuário' });
  }
});

// Atualizar post
router.put('/:id', async (req, res) => {
  try {
    const post = await postService.atualizarPost(req.params.id, req.body);
    res.json({ mensagem: 'Post atualizado', post });
  } catch (err) {
    res.status(400).json({ mensagem: err.message });
  }
});

// Deletar post
router.delete('/:id', async (req, res) => {
  try {
    await postService.deletarPost(req.params.id);
    res.json({ mensagem: 'Post excluído' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao excluir post' });
  }
});

module.exports = router;
