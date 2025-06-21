const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
  conteudo: { type: String, required: true },
  autorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comentario', ComentarioSchema);
