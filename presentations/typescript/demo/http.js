function getTransactions() {
	return [
		{
			"start": "2014-06-22T22:00:00Z",
			"end": "2014-06-22T23:00:00Z",
			"deleted": false
		}, {
			"start": "2015-06-22T22:00:00Z",
			"end": "2015-06-22T23:00:00Z",
			"deleted": true
		}, {
			"start": "2015-06-23T22:00:00Z",
			"end": "2015-06-23T23:00:00Z",
			"deleted": false
		}, {
			"start": "2015-07-23T22:00:00Z",
			"end": "2015-07-22T23:30:00Z",
			"deleted": false
		}, {
			"start": "2015-06-23T22:30:00Z",
			"end": "2015-06-24T23:00:00Z",
			"deleted": false
		},
	];
}

module.exports = {
	getTransactions: getTransactions
};
