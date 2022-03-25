const { Way, User, UserInfo, Comment } = require('../db/models/');

exports.isRedactor = async (req, res, next) => {
  let way, comment, userlogIn;
  try {
    if (req.params?.id) way = await Way.findOne({ where: { id: req.params?.id } })
    if (req.params?.id) comment = await Comment.findOne({ where: { id: req.params?.id }, raw: true });
    userlogIn = await User.findOne({ where: { name: res.locals?.username }, include: [{ model: UserInfo, attributes: ['role'] }], raw: true });
    if (userlogIn.id === comment?.user_id || userlogIn.id === way?.user_id || userlogIn['UserInfo.role'] === 'admin' || userlogIn.name === 'admin835') return next()
    else {
      return res.render('error', {
        message: 'Нет прав доступа',
        error: {}
      });
    }
  } catch (error) {
    return res.render('error', {
      message: 'Не удалось подключиться к базе данных.',
      error: {}
    });
  }
}


exports.isRedactorProfile = async (req, res, next) => {
  let userlogIn, user;
  try {
    if (req.params?.id) user = await User.findOne({ where: { id: req.params?.id }, raw: true });
    userlogIn = await User.findOne({ where: { name: res.locals?.username }, include: [{ model: UserInfo, attributes: ['role'] }], raw: true });
    if (userlogIn['UserInfo.role'] === 'admin' || userlogIn.id === user.id || userlogIn.name === 'admin835') return next()
    else {
      return res.render('error', {
        message: 'У вас нет прав для редактирования профиля',
        error: {}
      });
    }
  } catch (error) {
    return res.render('error', {
      message: 'Не удалось подключиться к базе данных.',
      error: {}
    });
  }
}
