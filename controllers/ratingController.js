const { Comment } = require('../db/models/');

exports.ratingController = async (ways1) => {
  return await Promise.all(ways1.map(async (el) => {
    const arrComments = await Comment.findAll({ where: { way_id: el.id }, raw: true })
    el.rating = Number((arrComments.reduce((acc, comm) => acc += comm.rating, 0) / arrComments.length).toFixed(2)) || 0;
    return el
  }));
};
