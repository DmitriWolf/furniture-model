var express = require('express')
var exphbs  = require('express-handlebars');
var path = require('path');

var woodshop = require('./model/Woodshop.js');
var bookcase = woodshop();

var app = express()

app.engine('handlebars', exphbs({
	defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	    res.render('home', {
        data: {
        	one: 1,
        	two: 2,
        	name: "number conversion"
        }
    });
});

app.get('/bookcase', function (req, res) {
	    res.render('bookcase', { bookcase } );
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
})