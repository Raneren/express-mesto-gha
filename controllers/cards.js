const Card = require('../models/card');

// Получить все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка: ${err.name}` }));
};

// Создать карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Удалить карточку
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: `Карточка c id: ${req.params.cardId} не найдена` });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Лайк карточки
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => {
  if (!card) {
    res.status(404).send({ message: `Карточка c id: ${req.params.cardId} не найдена` });
    return;
  }
  res.send(card);
})
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  });

// Дизайк карточки
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => {
  if (!card) {
    res.status(404).send({ message: `Карточка c id: ${req.params.cardId} не найдена` });
    return;
  }
  res.send(card);
})
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  });
