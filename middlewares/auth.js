const jwt = require('jsonwebtoken');
const LoginError = require('../errors/login-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new LoginError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new LoginError('Необходима авторизация'));
    return;
  }
  // Записываем пейлоуд в объект запроса
  req.user = payload;

  next();
};
