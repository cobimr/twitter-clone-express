const passport = require('passport');
const Usuario = require('../modelos/usuario');

// Sign Up
exports.postSignup = (req, res, next) => {
  const nuevoUsuario = new Usuario({
    email: req.body.email,
    nombre: req.body.nombre,
    password: req.body.password
  });

  Usuario.findOne({email: req.body.email}, (err, usuarioExistente) => {
    if (usuarioExistente) {
      return res.status(400).send('Ya ese email esta registrado')
    }
    nuevoUsuario.save((err) => {
      if (err) {
        next(err);
      }
      req.logIn(nuevoUsuario, (err) => {
        if (err) {
          next(err);
        }
        res.send('Usuario creado exitosamente')
      })
    })
  })
}

// Log In
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, usuario, info) => {
    if (err) {
      next(err);
    }
    if (!usuario) {
      return res.status(400).send('Email o contrasena no validos');
    }
    req.logIn(usuario, (err) => {
      if (err) {
        next(err);
      }
      res.send('Login exitoso')
    })
  })(req, res, next)
}

// Log Out
exports.getLogout = (req, res, next) => {
  req.logout();
  res.send('Logout exitoso');
}