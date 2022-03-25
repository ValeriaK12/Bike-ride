const express = require('express');
const cors = require('cors');
const createError = require('http-errors');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const waysRouter = require('./routes/way.js');

const app = express();
const PORT = process.env.PORT || 3000;
const FileStore = require('session-file-store')(session);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', true);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const fileStoreOptions = {};

const sessionConfig = {
  name: 'sid',
  store: new FileStore(fileStoreOptions),
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 10,
  },
}

app.use(session(sessionConfig));

app.use((req, res, next) => {
  res.locals.username = req.session?.user?.name;
  console.log("\n\x1b[33m", 'req.session.user :', req.session.user);
  console.log("\x1b[35m", 'res.locals.username:', res.locals.username);
  next();
});

app.use('/', indexRouter);
app.use('/ways', waysRouter);
app.use('/user', usersRouter);

app.use((req, res, next) => {
  const error = createError(404, 'Запрашиваемой страницы не существует на сервере.');
  next(error);
});

app.use(function (err, req, res, next) {
  const appMode = req.app.get('env');
  let error;

  if (appMode === 'development') {
    error = err;
  } else {
    error = {};
  }
  res.locals.message = err.message;
  res.locals.error = error;

  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`server started PORT: ${PORT}`);
})
