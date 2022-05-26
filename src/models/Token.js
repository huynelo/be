const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  token: { 
    type: String,
    max: 255,
    min: 6
  },
  device: { 
    type: String,
    max: 255,
    min: 6
  },
  user_id: {
    type: String,
    max: 255,
    min: 6
  },
  expired_at: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
  },
});

module.exports = mongoose.model('Token', tokenSchema);
