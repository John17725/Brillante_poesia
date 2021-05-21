const express = require('express');
const router = express.Router();
const path = require('path');
var alert = require('alert');
const TWILIO_ID = '';
const TWILIO_SK = '';
const client = require('twilio')(TWILIO_ID,TWILIO_SK);
const { unlink } = require('fs-extra');

router.use(express.static('public'));
router.use('/styles', express.static(__dirname + 'public/styles'));
router.use('/img', express.static(__dirname + 'public/img'));
router.use('/js', express.static(__dirname + 'public/js'));


const Image = require('../models/imagen')
const Petition = require('../models/petition')
router.get('/', async (req, res) => {
	const images = await Image.find();
	res.render('index', {images})
})

router.get('/posts', async (req, res) => {
	const images = await Image.find();
	res.render('posts', {images})
})

router.get('/post_manager', async (req, res) => {
	const images = await Image.find();
	res.render('post_manager', {images})
})

router.get('/blog', (req, res) => {
	res.render('blog')
})
router.get('/contacto', (req, res) => {
	res.render('contacto')
})

router.get('/panel', async (req, res) => {
	const petition = await Petition.find({status: false});
	res.render('panel', {petition})
})

router.get('/panel_completed', async (req, res) => {
	const petition = await Petition.find({status: true});
	console.log(petition)
	res.render('panel_completed', {petition})
})

router.get('/upload', (req, res) => {
	res.render('upload');
})

router.get('/request', (req, res) => {
	res.render('request');
})

router.get('/check_request/:id', async(req, res) => {
	const {id} = req.params;
	console.log(id)
	const petition = await Petition.findById(id);
	console.log(petition)
	res.render('check_request',{petition});
})

router.post('/check_request', async(req, res) => {
	const value = req.body.id_ser;
	// console.log(await Petition.findById(value))
	const filename_s = req.file.filename;
	const path_s = '/img/' + req.file.filename;
	const originalname_s = req.file.originalname;
	const mimetype_s = req.file.mimetype;
	const size_s = req.file.size;
	const tel = await Petition.findById(value);
	console.log(tel.tel);
	// console.log('ID',value)
	// console.log('FILE NAME',filename_s);
	// console.log('PATH',path_s);
	// console.log('ORGINAL NAME',originalname_s);
	// console.log('MIMETYPE',mimetype_s);
	// console.log('SIZE',size_s);
	const pet_up1 = await Petition.findByIdAndUpdate(value,{filename: filename_s});
	const pet_up2 = await Petition.findByIdAndUpdate(value,{path: path_s});
	const pet_up3 = await Petition.findByIdAndUpdate(value,{mimetype: mimetype_s});
	const pet_up4 = await Petition.findByIdAndUpdate(value,{size: size_s});
	const pet_up5 = await Petition.findByIdAndUpdate(value,{status: true});
	// console.log(await Petition.findById(value))
	client.messages
	  .create({
	     from: 'whatsapp:+14155238886',
	     body: `Gracias por usar nuestro servicio`,
	     to: 'whatsapp:+5217121642397'
	   })
	  .then(message => console.log(message.sid));
	res.redirect('/panel')
})


router.post('/upload', async (req, res) => {
	
	if (req.body.title === '' || req.body.title === ' ' || req.body.description == '' || req.body.description == ' ') {
		res.send('Llene los campos correctamente');
	}else{
		const image = new Image();
		image.title = req.body.title;
		image.description = req.body.description.split(' ');
		image.filename = req.file.filename;
		image.path = '/img/' + req.file.filename;
		image.originalname = req.file.originalname;
		image.mimetype = req.file.mimetype;
		image.size = req.file.size;
		await image.save();

		res.redirect('/upload');
	}
})

router.post('/request', async (req, res) => {
	const petition = new Petition();
	petition.name = req.body.nombre;
	petition.tel = req.body.telefono;
	petition.description = req.body.mensaje;
	await petition.save();
	res.redirect('/request');
});

router.get('/image/:id/delete', async (req, res) => {
	const {id} = req.params;
	const image = await Image.findByIdAndDelete(id);
	await unlink(path.resolve('./public' + image.path));
	res.redirect('/post_manager');
}) 


router.post('/index', async(req, res) => {
	const desc = req.body.buscartext;
	if (desc.length==0) {
		res.redirect('/')
	}else{
		const image = await Image.find({description: desc}).exec();
		if (image.length == 0) {
			res.send('Sin resultado de busqueda para:' + desc);
			console.log(image.length)
		}else{
			console.log(image.length)
			res.render('search_result', {image})

		}
	}
});
module.exports = router;
