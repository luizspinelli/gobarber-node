export default {
  jwt: {
    secret: process.env.APP_SECRET || 'no-secret',
    expiresIn: '1d',
  },
};
