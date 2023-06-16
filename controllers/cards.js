const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => console.log(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.send(card))
    .catch((err) => console.log(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => console.log(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`));
};
