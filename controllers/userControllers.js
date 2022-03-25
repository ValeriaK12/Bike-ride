const { User, UserInfo, Way } = require('../db/models');
const bcrypt = require('bcrypt');
const { ratingController } = require('./ratingController')


exports.createUserAndSession = async (req, res, next) => {
  const { name, password, email } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      name,
      password: hashedPassword,
      email,
    });
    req.session.user = { id: user.id, name: name };

  } catch (err) {
    console.error('Err message:', err.message);
    console.error('Err code', err.code);
    return failAuth(res, err.message);
  }
  res.redirect('/')
};

exports.editUserProfile = async (req, res, next) => {
  let userInfo;
  try {
    const editUser = await UserInfo.update({
      city: req.body.city,
      bike: req.body.bike,
      age: req.body.age,
      about_me: req.body.about_me,
    },
      { where: { user_id: req.body.user_id } });
    if (!editUser[0]) {
      userInfo = await UserInfo.create({
        age: req.body.age,
        bike: req.body.bike,
        city: req.body.city,
        about_me: req.body.about_me,
        user_id: req.body.user_id,
        role: 'user'
      });
    }
  } catch (error) {
  }
  res.json({})
}

exports.renderUserProfile = async (req, res, next) => {
  let user, userlogIn, ways;
  try {
    user = await User.findOne({
      where: { id: req.params?.id },
      include: [{
        model: UserInfo,
        attributes: ['bike', 'city', 'about_me', 'age', 'role']
      }],
      raw: true
    });
    userlogIn = await User.findOne({
      where: { name: res.locals?.username },
      include: [{
        model: UserInfo,
        attributes: ['role']
      }],
      raw: true
    });
    const ways1 = await Way.findAll({ order: [['id', 'DESC']], where: { user_id: user.id }, raw: true });
    ways = await ratingController(ways1);
  } catch (error) {
    return res.json({ message: 'user router.get(/:id - Не получить данный из базы даных.' });
  }
  user.age = user['UserInfo.age']
  user.about_me = user['UserInfo.about_me']
  user.city = user['UserInfo.city']
  user.bike = user['UserInfo.bike']
  if (userlogIn['UserInfo.role'] === 'admin' || userlogIn.id == user.id || userlogIn.name === 'admin835') userlogIn.isEditor = true
  res.render('userProfile', { user, userlogIn, ways })
}

exports.EditIsAdmin = async (req, res, next) => {
  let user;
  try {
    user = await UserInfo.update({
      role: req.body.role
    }, { where: { user_id: req.body.user_id } })
  } catch (error) {
    return res.json({ message: 'Не удалось обновить запись в базе данных.' });
  }
  res.json({ user })
}

exports.renderFormEditUser = async (req, res, next) => {
  let user;
  let userlogIn;
  try {
    userlogIn = await User.findOne({
      where: { name: res.locals?.username },
      include: [{
        model: UserInfo,
        attributes: ['role']
      }],
      raw: true
    })
    user = await User.findOne({
      where: { id: req.params?.id },
      include: [{
        model: UserInfo,
        attributes: ['bike', 'city', 'about_me', 'age', 'role']
      }],
      raw: true
    })
  } catch (error) {

  }
  user.age = user['UserInfo.age'];
  user.about_me = user['UserInfo.about_me'];
  user.city = user['UserInfo.city'];
  user.bike = user['UserInfo.bike'];
  user.userRole = user['UserInfo.role'] !== 'admin';
  if (userlogIn['UserInfo.role'] === 'admin' || userlogIn.name === 'admin835') userlogIn.isAdmin = true;
  res.render('editProfile', { user, userlogIn });
}

exports.checkUserAndCreateSession = async (req, res, next) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ where: { name: name }, raw: true });
    if (!user) return failAuth(res, ' Неправильное имя');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return failAuth(res, ' Неправильный пароль');

    req.session.user = { id: user.id, name: user.name };

  } catch (err) {
    console.error('Err message:', err.message);
    console.error('Err code', err.code);
    return failAuth(res, err.message);
  }
  res.redirect('/')
};

exports.destroySession = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('sid');
    res.redirect('/');
  });
}

exports.renderSignInForm = (req, res) => res.render('signIn');
exports.renderSignUpForm = (req, res) => res.render('signUp');


/**
 * Завершает запрос с ошибкой аутентификации
 * @param {object} res Ответ express
 * @param err  сообщение об ошибке
 */
function failAuth(res, err) {
  return res.status(401).json({ err: err });
}
