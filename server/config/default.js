module.exports = {
  key: process.env.KEY || 'kGeEQuRj7OGL8VXVKr2PRfR0QoJUBnmW',
  db: {
    url: process.env.DB_URL || 'mongodb://localhost:27017/expenses'
  },
  auth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '1009433701788-r40vdhch809bqnhptfnpqmpcqm36u6nq.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '6fK2_TUbrMQphHqz7_r8-4qx'
    }
  }
};
