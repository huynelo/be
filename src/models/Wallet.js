const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  wallet_address: { 
    type: String,
    max: 255,
    min: 6
  },
  user_id: {
    type: String,
    max: 255,
    min: 6
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
  },
});

module.exports = mongoose.model('Wallet', walletSchema);
