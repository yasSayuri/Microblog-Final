const express = require('express');
const router = express.Router();
const usuarioService = require('../services/UsuarioService');

// Criar usuário
router.post('/', async (req, res) => {
  try {
    const usuario = await usuarioService.criarUsuario(req.body);
    res.status(201).json({ mensagem: 'Usuário criado', usuario });
  } catch (err) {
    res.status(400).json({ mensagem: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await usuarioService.autenticar(email, senha);
    req.session.usuarioId = usuario._id;
    res.json({ mensagem: 'Login realizado com sucesso' });
  } catch (err) {
    res.status(400).json({ mensagem: err.message });
  }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const usuario = await usuarioService.atualizarUsuario(req.params.id, req.body);
    res.json({ mensagem: 'Usuário atualizado', usuario });
  } catch (err) {
    res.status(400).json({ mensagem: err.message });
  }
});

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao listar usuários' });
  }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
  try {
    await usuarioService.deletarUsuario(req.params.id);
    res.json({ mensagem: 'Usuário excluído' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao excluir usuário' });
  }
});

module.exports = router;
