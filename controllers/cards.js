const Card = require('../models/card');

// Получить все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

// Создать карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.status(201).send(card))
    .catch(next);
};

// Удалить карточку
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidCardId'))
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (JSON.stringify(card.owner) === JSON.stringify(req.user._id)) {
        return Card.deleteOne(card);
      }
      res.send({ message: 'Вы не можете удалить карточку, созданную другим пользователем' });
    })
    .then((card) => res.send(card))
    .catch(next);
};

// Лайк карточки
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).orFail(new Error('NotValidCardId'))
  .then((card) => res.send(card))
  .catch(next);

// Дизайк карточки
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).orFail(new Error('NotValidCardId'))
  .then((card) => res.send(card))
  .catch(next);
