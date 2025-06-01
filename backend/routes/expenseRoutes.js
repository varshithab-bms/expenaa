const express = require('express');
const { getExpenses, addExpense, deleteExpense } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getExpenses);
router.post('/', addExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
