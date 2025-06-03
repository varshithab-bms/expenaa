const express = require('express');
const {
  getExpenses,
  addExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

// Base path = /api/expenses
router.get('/', getExpenses);         // GET    /api/expenses
router.post('/', addExpense);         // POST   /api/expenses
router.delete('/:id', deleteExpense); // DELETE /api/expenses/:id

module.exports = router;