const logger = require(process.cwd() + '/bin/logger.js');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const moment = require('moment');
const consign = require('consign');
const cors = require('cors');
const app = express();
const firebase = require("firebase");
const admin = require("firebase-admin")
const Auth = require('../utils/auth')
const swaggerUi = require('swagger-ui-express')

const swaggerDocument = require("../utils/swagger.json")

let userLogged;

firebase.auth().onAuthStateChanged((user) => {
	if(user){
		userLogged = user
	} else {
		userLogged = null
	}
})

var key = {
	"type": process.env.type,
	"project_id": process.env.project_id,
	"private_key_id": process.env.private_key_id,
	"private_key": process.env.private_key,
	"client_email": process.env.client_email,
	"client_id": process.env.client_id,
	"auth_uri": process.env.auth_uri,
	"token_uri": process.env.token_uri,
	"auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
	"client_x509_cert_url": process.env.client_x509_cert_url
  }
  

admin.initializeApp({
	credential: admin.credential.cert(key),
	databaseURL: 'https://adopets-930a4.firebaseio.com/'
  });

moment.locale('pt-BR');

app.use(function (req, res, next) {
	console.log(req)
	var user = firebase.auth().currentUser
	if(req.path != "/api/login" && req.path.indexOf('/api-docs')){
		if(!user) {
			res.status(401)
			res.send({message: 'Unauthorized'})
	
		}
	}
	
	next()
	
});

app.use(cors(
	{
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
		optionsSuccessStatus: 204
	}

));

logger.info("Starting Logs...");
// "combined"
app.use(require("morgan")(function (tokens, req, res, next) {
	
	// console.log(user.email)
	//var date = moment(tokens.date(req, res, 'iso'), moment.ISO_8601).format('DD/MM/YYYY HH:mm');

	return [
		//date, '-',
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms'
	].join(' ');
}, { "stream": logger.stream }));

logger.info("Starting minimum settings for the ExpressJS...");
// Seta o ícone favicon do servidor.
app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));
app.use(cookieParser());

app.get('/', function (req, res) {
	res.send('localhost:3000');
});



logger.info("Starting module and route imports...");
consign({
	cwd: process.cwd(),
	locale: 'pt-br',
	logger: console,
	verbose: true,
	extensions: ['.js', '.json', '.node'],
})

	.then('bin/logger.js')
	.then('utils/auth.js')

	.then('src/controllers')

	.then('src/routes')
	.into(app)



logger.info("Iniciando rota 404...");
app.use(function (req, res, next) {
	res.status(404);
	res.sendFile(path.join(process.cwd() + '/public/404.html'));
});

logger.info("Starting error routes...");

app.use(function (err, req, res, next) {
	if (err.validador != undefined) {
		res.status(400);
		res.json(err.validador);
	} else {
		err.dsurl = req.protocol + '://' + req.get('host') + req.originalUrl;
	}
});

module.exports = app;
