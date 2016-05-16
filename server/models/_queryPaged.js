const Promise = require('bluebird');

module.exports = function({
  findQuery,
  sort,
  perPage,
  paginationCondition }) {

  if (typeof perPage === 'undefined') perPage = 100;

  let query = this.find(Object.assign({}, findQuery, paginationCondition));

  if (sort) query = query.sort(sort);

  query = query.limit(perPage);

  return Promise.all([
    query,
    this.count(findQuery)
  ])
    .spread((data, count) => {
      return {
        data,
        count
      };
    });
};
