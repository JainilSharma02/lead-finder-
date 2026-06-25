require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Lead Finder Pro API listening on port ${PORT}`);
    console.log(`Data provider: ${(process.env.LEAD_DATA_PROVIDER || 'google').toUpperCase()}`);
  });
};

start();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
});
