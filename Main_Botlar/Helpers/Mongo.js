class Mongoose {
  static Connect(URL = config.MongoURL) {
          require('mongoose').connect(URL, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useFindAndModify: false
          }).then(() => {
            client.logger.log("MongoDB Bağlantısı Tamamlandı!", "mngdb")
          }).catch((err) => {
            client.logger.log("MongoDB Bağlantısı Kurulamadı! " + err, "mngdb");
          });
  }
}

module.exports = { Mongoose }