/// <reference path="../moment.d.ts" />

var moment = require('moment');
var http = require('./http');

function calcDuration(startStr, endStr) {
    var start = moment(startStr);
    var end = moment(endStr);
    return end.diff(start, 'seconds');
}

function addDurations(transactions) {
    var total = 0;
    transactions.forEach(function(t) {
        if (!t.deleted) {
            total = total + calcDuration(t.start, t.end);
        }
    });
    return "sum of all durations: " + total;
}


console.log(addDurations(http.getTransactions()));
