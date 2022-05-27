const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user_id: {
    type: String,
    max: 255,
    min: 6
  },
  order_id: {
    type: String,
    max: 255,
    min: 6
  },
  tx: {
    type: String,
  },
  nft_type: {
    type: String,
  },
  nft_level: {
    type: String,
  },
  nft_rarity: {
    type: String,
  },
  token_id: {
    type: String,
  },
  block_numner: {
    type: Number,
  },
  minted_at: {
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

module.exports = mongoose.model('Order', orderSchema);
