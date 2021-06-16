module.exports = class HttpError extends Error {
	constructor(msg, status) {
		super(msg);
		this.status = status;
	}
};
