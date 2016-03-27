module.exports = function *(next) {
  yield next;

  if (this.status === 404) {
    this.body = 'Page not found';
  }
}