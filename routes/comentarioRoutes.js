const express = require('express');
const router = express.Router();
const comentarioService = require('../services/ComentarioService');

// Criar comentário
router.post('/', async (req, res) => {
  try {
    // Você pode obter o autorId do req.session.usuarioId para autenticação
    const autorId = req.session.usuarioId;
    if (!autorId) return res.status(401).json({ mensagem: 'Usuário não autenticado' });

    const { conteudo, postId } = req.body;
    const comentario = await comentarioService.criarComentario({ conteudo, autorId, postId });
    res.status(201).json({ mensagem: 'Comentário criado', comentario });
  } catch (err) {
    res.status(400).json({ mensagem: err.message });
  }
});

// Listar comentários por post
router.get('/post/:postId', async (req, res) => {
  try {
    const comentarios = await comentarioService.listarComentariosPorPost(req.params.postId);
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao listar comentários' });
  }
});

// Deletar comentário
router.delete('/:id', async (req, res) => {
  try {
    await comentarioService.deletarComentario(req.params.id);
    res.json({ mensagem: 'Comentário excluído' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao excluir comentário' });
  }
});

module.exports = router;
