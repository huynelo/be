const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 2202;

const routes = require('./src/routes/index');
const MONGO_URI = `mongodb+srv://huyneloworld:${process.env.MONGODB_PW}@cluster0.zgq89.mongodb.net`;

app.use(cors({
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

mongoose.connect(
  MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true
  }, (req, res) => { console.log('DB connected successfully!'); }
)

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
