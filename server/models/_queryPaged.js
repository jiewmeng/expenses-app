const Promise = require('bluebird');

module.exports = function({
  findQuery,
  sort,
  perPage = 100,
  paginationCondition,
  populate = []}) {

  let query = this.find(Object.assign({}, findQuery, paginationCondition));

  if (sort) query = query.sort(sort);

  query = query.limit(perPage);

  populate.forEach(field => query = query.populate(field));

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
