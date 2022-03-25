
exports.isAuth = async (req, res, next) => {
  if(res.locals?.username) next();
  else return res.redirect('/user/signin');
}

