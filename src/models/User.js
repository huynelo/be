const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  token_id: { 
    type: String,
  },
  game_id: { 
    type: String,
  },
  setting_id: { 
    type: String,
  },
  firstName: { 
    type: String,
    max: 255,
    min: 6
  },
  lastName: { 
    type: String,
    max: 255,
    min: 6
  },
  email: {
    type: String,
    max: 255,
    min: 6
  },
  password: {
    type: String,
  },
  user_name: {
    type: String,
    max: 255,
    min: 6
  },
  wallet_address: {
    type: String,
  },
  wallet_network: {
    type: String,
    max: 255,
    min: 6
  },
  wallet_balance: {
    type: Number,
    default: 0,
  },
  account_balance: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "WEB",
  },
  status: {
    type: String,
    default: "AVAILABLE",
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
  },
});

module.exports = mongoose.model('User', userSchema);
