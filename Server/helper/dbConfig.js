const { default: mongoose } = require('mongoose');

function DBConfig() {
  try {
    mongoose.connect(process.env.DB_URL).then(() => {
      console.log('Database connected successfully');
    });
  } catch (error) {
    console.log('Error connecting to database:', error);
  }
}


module.exports = DBConfig;