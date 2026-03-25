'use strict';

const express = require('express');

function createServer() {
  const app = express();

  let users = [];
  let expenses = [];

  let nextUserId = 1;
  let nextExpenseId = 1;

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('<p>Hello</p>');
  });

  app.get('/users', (req, res) => {
    res.json(users);
  });

  app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).send('Bad Request');
    }

    const reqId = users.find((user) => user.id === id);

    if (!reqId) {
      return res.status(404).send('Not Found');
    }

    res.json(reqId);
  });

  app.post('/users', (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send('Bad Request');
    }

    const id = nextUserId++;
    const user = {
      id,
      name,
    };

    users.push(user);

    return res.status(201).json(user);
  });

  app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const newUsers = users.filter((user) => user.id !== id);

    if (users.length === newUsers.length) {
      return res.status(404).send('Not Found');
    }

    if (Number.isNaN(id)) {
      return res.status(400).send('Bad Request');
    }

    users = newUsers;

    res.status(204).json(users);
  });

  app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).send('Bad Request');
    }

    const { name } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).send('Bad Request');
    }

    if (!name) {
      return res.status(400).send('Bad Request');
    }

    const userToUpdate = users.find((user) => user.id === id);

    if (!userToUpdate) {
      return res.status(404).send('Not Found');
    }

    Object.assign(userToUpdate, { name });

    res.status(200).json(userToUpdate);
  });

  app.get('/expenses', (req, res) => {
    let filteredExpenses = [...expenses];
    const { userId, category, from, to } = req.query;

    if (userId) {
      filteredExpenses = filteredExpenses.filter(
        (expense) => expense.userId === Number(userId),
      );
    }

    if (category) {
      filteredExpenses = filteredExpenses.filter(
        (expense) => expense.category === category,
      );
    }

    if (from) {
      filteredExpenses = filteredExpenses.filter(
        (expense) => expense.spentAt >= from,
      );
    }

    if (to) {
      filteredExpenses = filteredExpenses.filter(
        (expense) => expense.spentAt <= to,
      );
    }

    res.json(filteredExpenses);
  });

  app.get('/expenses/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).send('Bad Request');
    }

    const reqId = expenses.find((expense) => expense.id === id);

    if (!reqId) {
      return res.status(404).send('Not Found');
    }

    res.json(reqId);
  });

  app.post('/expenses', (req, res) => {
    const { userId, spentAt, title, amount, category, note } = req.body;

    if (
      userId === undefined ||
      !title ||
      amount === undefined ||
      !category ||
      !note
    ) {
      return res.status(400).send('Bad Request');
    }

    const userExists = users.some((user) => user.id === Number(userId));

    if (!userExists) {
      return res.status(400).send('Bad Request');
    }

    if (Number.isNaN(Number(userId))) {
      return res.status(400).send('Bad Request');
    }

    const id = nextExpenseId++;
    // const spentAt = new Date().toISOString();
    const expense = {
      id,
      userId: Number(userId),
      spentAt,
      title,
      amount: Number(amount),
      category,
      note,
    };

    expenses.push(expense);

    return res.status(201).json(expense);
  });

  app.put('/expenses/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).send('Bad Request');
    }

    const { userId, title, amount, category, note } = req.body;

    if (!userId || !title || !amount || !category || !note) {
      return res.status(400).send('Bad Request');
    }

    const expenseToUpdate = expenses.find((expense) => expense.id === id);

    if (!expenseToUpdate) {
      return res.status(404).send('Not Found');
    }

    Object.assign(expenseToUpdate, {
      userId: Number(userId),
      title,
      amount: Number(amount),
      category,
      note,
    });

    res.status(200).json(expenseToUpdate);
  });

  app.delete('/expenses/:id', (req, res) => {
    const id = Number(req.params.id);
    const newExpenses = expenses.filter((expense) => expense.id !== id);

    if (expenses.length === newExpenses.length) {
      return res.status(404).send('Not Found');
    }

    if (Number.isNaN(id)) {
      return res.status(400).send('Bad Request');
    }

    expenses = newExpenses;

    res.status(204).json(expenses);
  });

  return app;
}

module.exports = {
  createServer,
};
