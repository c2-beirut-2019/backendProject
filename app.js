let express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  config = require('./config'),
  compression = require('compression'),
  CORS = require('cors'),
  messagesService = require('./Services/messagesService');

let app = express();
app.use(bodyParser.json({limit: '20mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true, parameterLimit: 2000}));
app.use(compression());
app.use(CORS());

mongoose.connect(config.mongodb.database, config.mongodb.options).then(() => {
  console.log('Mongoose connected');
}).catch((err) => {
  console.log('Mongoose connection errr>', err);
});

let port = config.port || 4444;

app.listen(port, () => {
  console.log('server Started on port ' + port);
});

app.use((req, res) => {
  res.status(404).send(messagesService.noRestFound);
});
process.on('uncaughtException', function (err) {
  console.log(err);
});
require('./prototypes');
