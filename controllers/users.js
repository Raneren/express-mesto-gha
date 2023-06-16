const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => console.log(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => console.log(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => console.log(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`));
};
