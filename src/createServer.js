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

    if (Number.isNaN(id)) {
      return res.status(400).send('Bad Request');
    }

    const newUsers = users.filter((user) => user.id !== id);

    if (users.length === newUsers.length) {
      return res.status(404).send('Not Found');
    }

    users = newUsers;

    res.status(204).send();
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

    const parsedUserId = Number(userId);
    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedUserId)) {
      return res.status(400).send('Bad Request');
    }

    if (Number.isNaN(parsedAmount)) {
      return res.status(400).send('Bad Request');
    }

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).send('Bad Request');
    }

    if (typeof category !== 'string' || category.trim() === '') {
      return res.status(400).send('Bad Request');
    }

    if (typeof note !== 'string') {
      return res.status(400).send('Bad Request');
    }

    const userExists = users.some((user) => user.id === parsedUserId);

    if (!userExists) {
      return res.status(400).send('Bad Request');
    }

    let spentAtValue;

    if (spentAt !== undefined) {
      const date = new Date(spentAt);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).send('Bad Request');
      }

      spentAtValue = date.toISOString();
    } else {
      spentAtValue = new Date().toISOString();
    }

    const expense = {
      id: nextExpenseId,
      userId: parsedUserId,
      spentAt: spentAtValue,
      title,
      amount: parsedAmount,
      category,
      note,
    };

    nextExpenseId += 1;
    expenses.push(expense);

    return res.status(201).json(expense);
  });

  app.put('/expenses/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).send('Bad Request');
    }

    const { userId, title, amount, category, note } = req.body;

    const parsedUserId = Number(userId);
    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedUserId)) {
      return res.status(400).send('Bad Request');
    }

    if (Number.isNaN(parsedAmount)) {
      return res.status(400).send('Bad Request');
    }

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).send('Bad Request');
    }

    if (typeof category !== 'string' || category.trim() === '') {
      return res.status(400).send('Bad Request');
    }

    if (typeof note !== 'string') {
      return res.status(400).send('Bad Request');
    }

    const userExists = users.some((user) => user.id === parsedUserId);

    if (!userExists) {
      return res.status(400).send('Bad Request');
    }

    const expense = expenses.find((e) => e.id === id);

    if (!expense) {
      return res.status(404).send('Not Found');
    }

    Object.assign(expense, {
      userId: parsedUserId,
      title,
      amount: parsedAmount,
      category,
      note,
    });

    return res.status(200).json(expense);
  });

  app.delete('/expenses/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).send('Bad Request');
    }

    const newExpenses = expenses.filter((expense) => expense.id !== id);

    if (expenses.length === newExpenses.length) {
      return res.status(404).send('Not Found');
    }

    expenses = newExpenses;

    res.status(204).send();
  });

  return app;
}

module.exports = {
  createServer,
};
