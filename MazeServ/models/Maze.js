const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mazeSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author!'
  },
  drawing: {
    type: String
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  }
});

function autopopulate(next) {
  this.populate('author');
  next();
}

mazeSchema.pre('find', autopopulate);
mazeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Maze', mazeSchema);
