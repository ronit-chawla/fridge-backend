const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpError');
const Fridge = require('../models/Fridge');
const Item = require('../models/Item');

exports.create = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(error);
		return next(new HttpError('Invalid inputs.', 422));
	}
	const { title, password } = req.body;

	let existingFridge;
	try {
		existingFridge = await Fridge.findOne({
			title : title.toLowerCase()
		});
	} catch (err) {
		const error = new HttpError(
			'Internal server error',
			500
		);
		return next(error);
	}
	if (existingFridge) {
		return next(
			new HttpError(
				'Fridge with the same title already exists',
				422
			)
		);
	}

	let hashedPwd;
	try {
		hashedPwd = await bcrypt.hash(password, 12);
	} catch (err) {
		return next(
			new HttpError('Internal server error', 500)
		);
	}

	const fridge = new Fridge({
		title    : title.toLowerCase(),
		password : hashedPwd,
		items    : []
	});

	try {
		await fridge.save();
	} catch (err) {
		return next(
			new HttpError('Internal server error', 500)
		);
	}

	res.status(201).json({
		fridge : {
			id    : fridge.id,
			title : fridge.title,
			items : fridge.items
		}
	});
};

exports.auth = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(error);
		return next(new HttpError('Invalid inputs.', 422));
	}
	const { title, password } = req.body;

	let fridge;
	try {
		fridge = await Fridge.findOne({
			title : title.toLowerCase()
		}).populate('items');
	} catch (err) {
		const error = new HttpError(
			'Internal server error',
			500
		);
		return next(error);
	}
	if (!fridge) {
		return next(
			new HttpError(
				'Fridge with given name not found',
				404
			)
		);
	}
	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(
			password,
			fridge.password
		);
	} catch (err) {
		const error = new HttpError(
			'Internal server error',
			500
		);
		return next(error);
	}

	if (!isValidPassword) {
		return next(
			new HttpError('Incorrect password', 403)
		);
	}
	res.json({
		fridge : {
			id    : fridge.id,
			title : fridge.title,
			items : fridge.items
		}
	});
};

exports.addItem = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs.', 422));
	}
	const { id } = req.params;
	const { title, quantity } = req.body;

	let fridge;
	try {
		fridge = await Fridge.findById(id);
	} catch (err) {
		return next(
			new HttpError(
				"Something went wrong couldn't find Fridge.",
				500
			)
		);
	}

	if (!fridge) {
		return next(
			new HttpError(
				"Fridge with the given ID couldn't be found",
				404
			)
		);
	}

	const item = new Item({
		title,
		quantity
	});

	try {
		await item.save();
	} catch (err) {
		return next(
			new HttpError(
				"Something went wrong couldn't find Fridge.",
				500
			)
		);
	}

	try {
		fridge.items.push(item._id);
		await fridge.save();
	} catch (err) {
		return next(
			new HttpError(
				"Something went wrong couldn't find Fridge.",
				500
			)
		);
	}
	res.status(201).json({ message: 'Item created', item });
};

exports.get = async (req, res, next) => {
	const { id } = req.params;

	let fridge;
	try {
		fridge = await Fridge.findOne(
			{ _id: id },
			'-password'
		).populate('items');
	} catch (err) {
		return next(
			new HttpError(
				"Something went wrong couldn't find Fridge.",
				500
			)
		);
	}

	if (!fridge) {
		return next(
			new HttpError(
				"Fridge with the given ID couldn't be found",
				404
			)
		);
	}
	res.json({ fridge });
};

exports.editItem = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs.', 422));
	}
	const { title, quantity } = req.body;
	const { itemId } = req.params;

	let item;
	try {
		item = await Item.findById(itemId);
	} catch (err) {
		return next(
			new HttpError('Something went wrong', 500)
		);
	}

	if (!item) {
		return next(
			new HttpError(
				'Item with given ID not found',
				404
			)
		);
	}
	item.title = title;
	item.quantity = quantity;

	try {
		await item.save();
	} catch (err) {
		return next(
			new HttpError('Something went wrong', 500)
		);
	}
	res.json({ item });
};

exports.deleteItem = async (req, res, next) => {
	const { id, itemId } = req.params;

	let fridge;
	try {
		fridge = await Fridge.findById(id);
	} catch (err) {
		return next(
			new HttpError(
				"Something went wrong couldn't find Fridge.",
				500
			)
		);
	}

	if (!fridge) {
		return next(
			new HttpError(
				"Fridge with the given ID couldn't be found",
				404
			)
		);
	}

	let item;

	try {
		item = await Item.findById(itemId);
	} catch (err) {
		return next(
			new HttpError('Something went wrong', 500)
		);
	}

	if (!item) {
		return next(
			new HttpError(
				'Item with given ID not found',
				404
			)
		);
	}
	try {
		await item.remove();
		await fridge.items.pull(item);
	} catch (err) {
		return next(
			new HttpError('Something went wrong', 500)
		);
	}
	res.json({ message: 'Succesfully deleted item' });
};
