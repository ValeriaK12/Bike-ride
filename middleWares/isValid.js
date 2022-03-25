exports.isValid = (req, res, next) => {
  const { name, password, email } = req.body;
  if(name && password && email) next();
  else res.status(401).end();
};
