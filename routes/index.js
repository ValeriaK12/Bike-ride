const router = require('express').Router();

router.get('/', (req, res) => res.redirect('/ways'));

module.exports = router;
