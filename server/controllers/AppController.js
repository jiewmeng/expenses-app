module.exports = {
  index: function*(next) {
    this.body = 'INDEX ACTION';
    yield next;
  },
};
