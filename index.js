require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const HttpError = require('./models/HttpError');
const fridgeRoutes = require('./routes/fridge');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE'
	);
	next();
});

app.use('/fridge', fridgeRoutes);

app.use((req, res, next) => {
	next(new HttpError("Couldn't find this route", 404));
});
app.use(async (err, req, res, next) => {
	res.status(err.status || 500).json({
		message : err.message || 'A unknown error occured'
	});
});

mongoose.Promise = Promise;
mongoose
	.connect(
		process.env.MONGO_URL || //production
			'mongodb://localhost:27017/fridge',
		{
			keepAlive          : true,
			useNewUrlParser    : true,
			useUnifiedTopology : true
		}
	)
	.then(() =>
		app.listen(PORT, () =>
			console.log(
				`connect to DB and started server at port ${PORT}`
			)
		)
	)
	.catch(e => console.log(e));
