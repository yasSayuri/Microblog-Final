const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  conteudo: { type: String, required: true },
  autorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
