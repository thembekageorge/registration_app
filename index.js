var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var plates = require('./plates');
var app = express();

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

plates(app);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('The app is running on http://localhost: ' + port);
});
