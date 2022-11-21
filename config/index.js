const mongoose = require('mongoose');
require('dotenv').config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Kết nối Thành Công')
    } catch (error) {
        console.log('Kết nối Thất Bại')
    }
}

module.exports = {
    connect
}