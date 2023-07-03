const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((err, req, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  } else if (err.message === 'AuthError') {
    res.status(401).send({ message: 'Необходима авторизация' });
  } else if (err.message === 'LoginError') {
    res.status(401).send({ message: 'Неправильные почта или пароль' });
  } else if (err.message === 'NotValidUserId') {
    res.status(404).send({ message: 'Пользователь с данным id не найден' });
  } else if (err.message === 'NotValidCardId') {
    res.status(404).send({ message: 'Карточка с данным id не найдена' });
  } else if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с данным email уже зарегистрирован' });
  } else {
    res.status(500).send({ message: `На сервере произошла ошибка: ${err.name}` });
  }
  next();
});

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
