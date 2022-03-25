const express = require('express');
const {
  checkUserAndCreateSession,
  createUserAndSession, destroySession,
  renderSignInForm,
  renderSignUpForm,
  renderFormEditUser,
  editUserProfile,
  renderUserProfile,
  EditIsAdmin
} = require('../controllers/userControllers');

const { isValid } = require('../middleWares/isValid')
const { isAdmin } = require('../middleWares/isAdmin')
const { isAuth } = require('../middleWares/isAuth')
const { isRedactorProfile } = require('../middleWares/isRedactor')
const router = express.Router();

router
  .route('/signup')
  .get(renderSignUpForm)
  .post(isValid, createUserAndSession);

router
  .route('/signin')
  .get(renderSignInForm)
  .post(checkUserAndCreateSession);

router.get('/signout', destroySession);

router
  .route('/edit/:id')
  .get(isAuth, isRedactorProfile, renderFormEditUser)
  .put(isAuth, isRedactorProfile, editUserProfile);

router
  .route('/admin/:id')
  .put(isAdmin, EditIsAdmin);

router
  .route('/:id')
  .get(isAuth, renderUserProfile);

router.get('/', async (req, res) => res.redirect('/'));

module.exports = router;



