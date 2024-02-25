require('dotenv').config();
const mongoose = require('mongoose');

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log('Подключено к MongoDB');
  } catch (error) {
    console.error(`Ошибка подключения к MongoDB: ${error}`);
  }
}

function initializeModels() {
  require('../models/messageCounterModel.js');
  require('../models/roleModel.js');
  require('../models/userModel.js');
}

module.exports = { connectDatabase, initializeModels };
