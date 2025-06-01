const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ userId: req.user.id });
  res.json(expenses);
};

exports.addExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;
  const expense = new Expense({ userId: req.user.id, title, amount, category, date });
  await expense.save();
  res.status(201).json(expense);
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  await Expense.deleteOne({ _id: id, userId: req.user.id });
  res.status(204).end();
};
