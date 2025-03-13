const mongoose = require('mongoose');
//Khai báo thư viện mongooose để kết nối với MongoDBCompass

mongoose.set('strictQuery', false);  // hoặc true tùy theo nhu cầu của bạn

//khai báo hàm để kết nối
async function connect() {
    try {
        //server, tên DB
        await mongoose.connect(`mongodb://localhost:27017/moviapp`);
        
        //nếu thành công sẽ hiện thông báo và ngược lại
        console.log('Kết nối thành công!');
    } catch (error) {
        console.log("Kết nối không thành công:", error.message);
    }
}

module.exports = connect;
