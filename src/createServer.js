'use strict';

const express = require('express');

function createServer() {
  // Use express to create a server
  // Add a routes to the server
  // Return the server (express app)

  const app = express();

  let users = [];

  let nextUserId = 1;

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('<p>Hello</p>');
  });

  app.get('/users', (req, res) => {
    res.json(users);
  });

  app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);

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
    const { name } = req.body;

    if (Number.isNaN(id)) {
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

  return app;
}

module.exports = {
  createServer,
};
