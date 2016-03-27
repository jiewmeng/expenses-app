module.exports = function *(next) {
  try {
    yield next;
  } catch (err) {
    this.logger.log('error', err.message, {
      stack: err.stack,
      tags: err.tags,
      details: err.details
    });
    err.status = err.status || 500;
    err.message = err.message || 'An error occured';

    this.status = err.status;
    this.body = err.message;
  }
}