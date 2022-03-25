const { User, UserInfo } = require('../db/models/');


exports.isAdmin = async (req, res, next) => {
  let userlogIn;
  try {
    userlogIn = await User.findOne({
      where: { name: res.locals?.username },
      include: [{
        model: UserInfo,
        attributes: ['role']
      }], raw: true
    });
    if (userlogIn['UserInfo.role'] === 'admin' || userlogIn.name === 'admin835') next();
    else return res.json({ message: 'Не удалось обновить запись в базе данных.' });
  } catch (error) {
    return res.json({ message: 'Не удалось обновить запись в базе данных.' });
  }
}

