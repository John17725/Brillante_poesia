const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const multer = require('multer');
const {v4:uuid} = require('uuid');

const app = express();
const PORT = 3000;

// CONNECT TO DB
mongoose.connect('mongodb://localhost/db-poesia', { useNewUrlParser: true})
	.then(db => console.log('DB Conecction successful'))
	.catch(err => console.log(err))


const indexRoutes = require('./routes/index')

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//MIDDELWARE
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
	destination: path.join(__dirname, 'public/img'),
	filename: (req, file, cb, filename) => {
		cb(null, uuid()+path.extname(file.originalname));
	}
});

app.use(multer({
	storage: storage
}).single('image'));

app.use('/', indexRoutes);

app.listen(PORT, () => console.log(`listen on port ${PORT}`));
