const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const configsiteSchema = new Schema({
  id: Number,
  title: {type: String,
    unique: true} ,
  url: String,
  panel: String,
  link: String,
  ref: String,
  header: String,
  summary: String,
  img: String,
  imgattr: String,
  author: String,
  public: Boolean
});

const Configsite = module.exports = mongoose.model('Configsite', configsiteSchema);
