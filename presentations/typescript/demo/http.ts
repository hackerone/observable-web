/// <reference path="./node.d.ts" />
function getRuns() {
    return [
        {
            "id": 1001,
            "start": "2014-06-22T22:00:00Z",
            "end": "2014-06-22T23:00:00Z",
            "isIntervallTraining": false
        }, {
            "id": 1002,
            "start": "2015-06-22T22:00:00Z",
            "end": null,
            "isIntervallTraining": true
        }, {
            "id": 1004,
            "start": "2015-06-23T22:00:00Z",
            "end": "2015-06-23T23:00:00Z",
            "isIntervallTraining": false
        }, {
            "id": 1112,
            "start": "2015-07-23T22:00:00Z",
            "end": "2015-07-23T23:30:00Z",
            "isIntervallTraining": false
        }, {
            "id": 1142,
            "start": "2015-06-23T22:30:00Z",
            "end": "2015-06-23T23:15:00Z",
            "isIntervallTraining": false
        },
    ];
}

module.exports = {
    getRuns: getRuns
};
