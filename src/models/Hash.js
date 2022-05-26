const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hashSchema = new Schema({
  hash_name: { 
    type: String,
  },
  hash_value: { 
    type: String,
  },
  user_id: {
    type: String,
    max: 255,
    min: 6
  },
  status: {
    type: String,
    default: "AVAILABLE",
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

module.exports = mongoose.model('Hash', hashSchema);
