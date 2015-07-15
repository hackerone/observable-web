/// <reference path="./node.d.ts" />
function getTransactions() {
    return [
        {
            "id": 1001,
            "start": "2014-06-22T22:00:00Z",
            "end": "2014-06-22T23:00:00Z",
            "deleted": false
        }, {
            "id": 1002,
            "start": "2015-06-22T22:00:00Z",
            "end": "2015-06-22T23:00:00Z",
            "deleted": true
        }, {
            "id": 1004,
            "start": "2015-06-23T22:00:00Z",
            "end": "2015-06-23T23:00:00Z",
            "deleted": false
        }, {
            "id": 1112,
            "start": "2015-07-23T22:00:00Z",
            "end": "2015-07-22T23:30:00Z",
            "deleted": false
        }, {
            "id": 1142,
            "start": "2015-06-23T22:30:00Z",
            "end": "2015-06-24T23:00:00Z",
            "deleted": false
        },
    ];
}

module.exports = {
    getTransactions: getTransactions
};
