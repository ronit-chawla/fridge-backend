const express = require('express');
const { body } = require('express-validator');

const {
	create,
	auth,
	get,
	addItem,
	editItem,
	deleteItem
} = require('../controllers/fridge');

const router = express.Router();

router.get('/:id', get);
router.post(
	'/',
	[
		body('title')
			.trim()
			.not()
			.isEmpty()
			.isLength({ max: 40 }),
		body('password').trim().isLength({ min: 6 })
	],
	create
);
router.post(
	'/auth',
	[
		body('title')
			.trim()
			.not()
			.isEmpty()
			.isLength({ max: 40 }),
		body('password').trim().isLength({ min: 6 })
	],
	auth
);
router.post(
	'/:id',
	[
		body('title')
			.trim()
			.not()
			.isEmpty()
			.isLength({ max: 40 }),
		body('quantity').isNumeric().isInt({ min: 0 })
	],
	addItem
);
router.put('/:id/item/:itemId', [
	[
		body('title')
			.trim()
			.not()
			.isEmpty()
			.isLength({ max: 40 }),
		body('quantity').isNumeric().isInt({ min: 0 })
	],
	editItem
]);
router.delete('/:id/item/:itemId', deleteItem);

module.exports = router;
