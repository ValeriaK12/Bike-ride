const { Way, User, Comment, UserInfo } = require('../db/models/');
const { sortWays, sortRating, sortDistance } = require('../middleWares/sortWays');
const { ratingController } = require('./ratingController');



exports.renderAllWays = async (req, res, next) => {
  let ways, ways1, userlogIn;
  try {
    userlogIn = await User.findOne({ where: { name: res.locals?.username }, raw: true });
    ways1 = await Way.findAll({ order: [['id', 'DESC']], raw: true });
    ways = await ratingController(ways1);
  } catch (error) {
    return res.render('error', { message: 'Не удалось не удалось подключиться к базе данных.', error: {} });
  }
  return res.render('index', { ways, userlogIn });
}
exports.renderSortAllWays = async (req, res) => {
  let ways, ways1, userlogIn;
  try {
    userlogIn = await User.findOne({ where: { name: res.locals?.username }, raw: true });
    ways1 = await sortWays(req.params.id);
    ways = await ratingController(ways1);

    if (req.params?.id == 1) ways = sortRating(ways);
    if (req.params?.id == 3) ways = sortDistance(ways);

  } catch (error) {
    return res.render('error', { message: 'Не удалось не удалось подключиться к базе данных.', error: {} });

  }
  return res.json({ ways, userlogIn });
}

exports.commentDelete = async (req, res) => {
  let delet;
  try {
    delet = await Comment.destroy({ where: { id: req.params.id } });
  } catch (error) {
    return res.render('error', { message: 'Не удалось удалить комментарий из базы данных.', error: {} });
  }
  return res.json({ delet });

}

exports.renderNewComment = async (req, res) => {
  let newComment, user, newRating;
  try {
    user = await User.findOne({ where: { name: res.locals?.username }, raw: true });
    newComment = await Comment.create({ text: req.body.text, rating: req.body.rating, user_id: user.id, way_id: req.body.way_id }, { returning: true, plain: true });
    const comment = await Comment.findAll({ where: { way_id: req.body.way_id }, raw: true });
    newRating = Number((comment.reduce((acc, el) => acc += el.rating, 0) / comment.length).toFixed(2)) || 0;
    newComment.dataValues.username = user.name;
  } catch (error) {
    return res.json({ isUpdateSuccessful: false, errorMessage: 'Не удалось обновить запись в базе данных.' });
  }
  return res.json({ newComment, newRating });
}

exports.renderFormNewWay = (req, res) => res.render('newRoad');

exports.renderFormEditWay = async (req, res) => {
  let userlogIn, way;
  try {
    userlogIn = await User.findOne({
      where: { name: res.locals?.username },
      include: [{
        model: UserInfo,
        attributes: ['role']
      }],
      raw: true
    })
    way = await Way.findOne({ where: { id: req.params?.id }, raw: true });
    if (userlogIn.id === way.user_id || userlogIn['UserInfo.role'] === 'admin' || userlogIn.name === 'admin835') userlogIn.isEditor = true;
    else res.render('error', { message: 'Нет прав для редактирования записи', error: {} });
  } catch (error) {
    return res.render('error', { message: 'Не удалось не удалось подключиться к базе данных.', error: {} });
  }
  return res.render(`newRoad`, { way, userlogIn });
}
exports.editWay = async (req, res) => {
  let userlogIn, way;
  try {
    userlogIn = await User.findOne({ where: { name: res.locals?.username }, raw: true });
    way = await Way.update({
      title: req.body.wayTitle,
      body: req.body.wayText,
      city: req.body.wayCity,
      user_id: userlogIn.id,
      distance: req.body.distance,
      xy_start: req.body.xy1.join('_'),
      xy_end: req.body.xy2.join('_'),
      url_img: req.body.wayImage,
    }, { where: { id: req.body.id } }, { returning: true, plain: true });

  } catch (error) {
    return res.render('error', { message: 'Не удалось не удалось подключиться к базе данных.', error: {} });
  }
  res.json({ way });
}

exports.createNewWay = async (req, res) => {
  let newWay, userlogIn;
  try {
    userlogIn = await User.findOne({ where: { name: res.locals?.username }, raw: true });
    newWay = await Way.create({
      title: req.body.wayTitle,
      body: req.body.wayText,
      city: req.body.wayCity,
      user_id: userlogIn.id,
      distance: req.body.distance,
      xy_start: req.body.xy1.join('_'),
      xy_end: req.body.xy2.join('_'),
      url_img: req.body.wayImage,
    }, { returning: true, plain: true });
  } catch (error) {
    return res.render('error', { message: 'Не удалось не удалось подключиться к базе данных.', error: {} });
  }
  res.json({ newWay });
}

exports.deleteWay = async (req, res) => {
  try {
    await Way.destroy({ where: { id: req.params.id } });
  } catch (error) {
    return res.render('error', { message: 'Не удалось не удалось подключиться к базе данных.', error: {} });
  }
  return res.redirect('/ways');
}

exports.renderFormInfoWay = async (req, res) => {
  let way, comment, userlogIn;
  try {
    userlogIn = await User.findOne({ where: { name: res.locals?.username }, include: [{ model: UserInfo, attributes: ['role'] }], raw: true });
    way = await Way.findOne({ where: { id: req.params.id }, include: [{ model: User, attribute: ['name'] }], raw: true });
    comment = await Comment.findAll({ where: { way_id: way.id }, order: [['createdAt', 'DESC']], include: [{ model: User, attribute: ['name'] }], raw: true });
    way.rating = Number((comment.reduce((acc, el) => acc += el.rating, 0) / comment.length).toFixed(2)) || 0;
    way.nameUser = way['User.name']
    comment.forEach(el => {
      if (el.user_id === userlogIn.id || userlogIn['UserInfo.role'] === 'admin' || userlogIn.name === 'admin835') el.isGrantDelComm = true;
      return el;
    })
  } catch (error) {
    return res.render('error', { message: 'Не удалось не удалось подключиться к базе данных.', error: {} });
  }
  comment.forEach(el => el.nameUser = el['User.name']);
  if (userlogIn.id === way.user_id || userlogIn['UserInfo.role'] === 'admin' || userlogIn.name === 'admin835') userlogIn.isEditor = true;
  return res.render('infoRoad', { way, comment, userlogIn });
}

