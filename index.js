import express from 'express';
import session from 'express-session';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Para __dirname com ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração MongoDB
const mongoURL = 'mongodb://localhost:27017';
const client = new MongoClient(mongoURL);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('microblogdb');
    console.log('✅ Conectado ao MongoDB');
  } catch (err) {
    console.error('❌ Erro ao conectar no MongoDB', err);
  }
}
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'segredo_super_secreto',
  resave: false,
  saveUninitialized: false, // Melhor false para segurança
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rotas para páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html')); // Cadastro
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html')); // Login
});

app.get('/feed', (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public/feed.html')); // Feed
});

// API

// Criar usuário
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    // Verificar se email já existe
    const existente = await db.collection('usuarios').findOne({ email });
    if (existente) return res.status(409).json({ error: 'Email já cadastrado' });

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = { nome, email, senha: senhaHash };
    const resultado = await db.collection('usuarios').insertOne(usuario);
    res.json({ msg: 'Usuário criado com sucesso', id: resultado.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await db.collection('usuarios').findOne({ email });
    if (!usuario) return res.status(401).json({ error: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Senha inválida' });

    req.session.usuarioId = usuario._id.toString();
    req.session.usuarioNome = usuario.nome;
    res.json({ msg: 'Login realizado com sucesso',  usuario: { _id: usuario._id, nome: usuario.nome } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Logout (opcional)
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Erro ao deslogar' });
    res.json({ msg: 'Logout realizado com sucesso' });
  });
});

// Criar postagem (só se logado)
app.post('/posts', async (req, res) => {
  try {
    if (!req.session.usuarioId) return res.status(401).json({ error: 'Usuário não autenticado' });
    const { conteudo } = req.body;
    if (!conteudo) return res.status(400).json({ error: 'Conteúdo da postagem é obrigatório' });

    const post = {
      conteudo,
      autorId: new ObjectId(req.session.usuarioId),
      data: new Date()
    };
    const resultado = await db.collection('posts').insertOne(post);
    res.json({ msg: 'Post criado com sucesso', id: resultado.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Listar posts do usuário logado
app.get('/posts/meus', async (req, res) => {
  try {
    if (!req.session.usuarioId) return res.status(401).json({ error: 'Usuário não autenticado' });
    const posts = await db.collection('posts').find({ autorId: new ObjectId(req.session.usuarioId) }).toArray();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Listar todos os posts (feed)
app.get('/posts', async (req, res) => {
  try {
    const posts = await db.collection('posts').find().sort({ data: -1 }).toArray();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Listar usuários (sem senha)
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await db.collection('usuarios').find({}, { projection: { senha: 0 } }).toArray();
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Excluir usuário (opcional, precisa validação se é admin ou dono)
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

    await db.collection('usuarios').deleteOne({ _id: new ObjectId(id) });
    res.json({ msg: 'Usuário excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Excluir post (opcional, precisa validação)
app.delete('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

    await db.collection('posts').deleteOne({ _id: new ObjectId(id) });
    res.json({ msg: 'Post excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Atualizar usuário (exemplo)
app.put('/usuarios/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, email, senha } = req.body;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

    const updateData = {};
    if (nome) updateData.nome = nome;
    if (email) updateData.email = email;
    if (senha) updateData.senha = await bcrypt.hash(senha, 10);

    await db.collection('usuarios').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    res.json({ msg: 'Usuário atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Atualizar post
app.put('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { conteudo } = req.body;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    if (!conteudo) return res.status(400).json({ error: 'Conteúdo obrigatório' });

    await db.collection('posts').updateOne({ _id: new ObjectId(id) }, { $set: { conteudo } });
    res.json({ msg: 'Post atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
