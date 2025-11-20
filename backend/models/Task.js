const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: { 
    type: String, 
    default: 'pending', 
    enum: {
      values: ['pending', 'in-progress', 'completed'],
      message: 'Status is either: pending, in-progress, or completed'
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    select: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

taskSchema.index({ status: 1, createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
