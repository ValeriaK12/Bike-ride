const { Way } = require('../db/models/');

exports.sortWays = async (id) => {
  switch (id) {
    case 1:
      return ways1 = await Way.findAll({ raw: true });
    case 2:
      return ways1 = await Way.findAll({ order: [['createdAt', 'DESC']], raw: true });
    case 3:
      return ways1 = await Way.findAll({ order: [['distance', 'ASC']], raw: true });
    default:
      return ways1 = await Way.findAll({ raw: true });
  }
};

exports.sortRating = (ways) => {
  return ways.sort((a, b) => b.rating - a.rating)
};

exports.sortDistance = (ways) => {
  return ways.sort((a, b) => parseInt(b.distance) - parseInt(a.distance))
};
