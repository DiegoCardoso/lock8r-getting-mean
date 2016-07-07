const passport = require('passport');
const mongoose = require('mongoose');

const User = mongoose.model('User');

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendJsonResponse(res, 400, {
      message: 'All fields are required.',
    });
  }

  const user = new User();

  user.name = name;
  user.email = email;

  user.setPassword(password);

  user.save((err) => {
    if (err) {
      return sendJsonResponse(res, 404, err);
    }

    const token = user.generateJwt();

    sendJsonResponse(res, 200, {
      token,
    });
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendJsonResponse(res, 400, {
      message: 'All field are required.',
    });
  }

  passport.authenticate('local', (err, user, info) => {
    console.log('CHEGOU AQUI PASSPORT!');

    if (err) {
      return sendJsonResponse(res, 404, err);
    }

    if (!user) {
      return sendJsonResponse(res, 401, info);
    }

    const token = user.generateJwt();
    sendJsonResponse(res, 200, {
      token,
    })
  })(req, res);
};
