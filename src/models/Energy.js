const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const energySchema = new Schema({
  user_id: {
    type: String,
    max: 255,
    min: 6
  },
  energy_icon: {
    type: Number,
    default: 0,
  },
  steps: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
  },
});

module.exports = mongoose.model('Energy', energySchema);
