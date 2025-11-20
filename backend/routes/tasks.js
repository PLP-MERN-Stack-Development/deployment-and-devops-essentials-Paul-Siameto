const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

const asyncHandler = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(async (req, res) => {
  const { status, sort } = req.query;
  
  const query = {};
  if (status) {
    query.status = status;
  }

  const sortBy = {};
  if (sort) {
    const [field, order] = sort.split(':');
    sortBy[field] = order === 'desc' ? -1 : 1;
  } else {
    sortBy.createdAt = -1;
  }

  const tasks = await Task.find(query).sort(sortBy).select('-__v');
  res.json({
    status: 'success',
    results: tasks.length,
    data: { tasks }
  });
}));

router.post('/', asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { task }
  });
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).select('-__v');

  if (!task) {
    return res.status(404).json({
      status: 'fail',
      message: 'No task found with that ID'
    });
  }

  res.json({
    status: 'success',
    data: { task }
  });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id).select('-__v');

  if (!task) {
    return res.status(404).json({
      status: 'fail',
      message: 'No task found with that ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}));

module.exports = router;
