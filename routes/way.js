const router = require('express').Router();

const {
  renderAllWays,
  renderSortAllWays,
  commentDelete,
  renderNewComment,
  renderFormNewWay,
  renderFormEditWay,
  editWay,
  createNewWay,
  deleteWay,
  renderFormInfoWay
} = require('../controllers/waysControllers');

const { isRedactor } = require('../middleWares/isRedactor')
const { isAuth } = require('../middleWares/isAuth')

router.get('/', isAuth, renderAllWays);

router.get('/sort/:id', isAuth, renderSortAllWays);

router.delete('/comment/delete/:id', isAuth, isRedactor, commentDelete)

router.post('/comment', isAuth, renderNewComment)

router.route('/new')
  .get(isAuth, renderFormNewWay)
  .post(isAuth, createNewWay)

router.route('/edit/:id')
  .get(isAuth, isRedactor, renderFormEditWay)
  .put(editWay)

router.get('/delete/:id', isAuth, isRedactor, deleteWay)

router.get('/:id', isAuth, renderFormInfoWay)

module.exports = router;
