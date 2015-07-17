/// <reference path="./moment.d.ts" />
/// <reference path="./node.d.ts" />

var moment = require('moment');
var http = require('./http');

function calcDuration(startStr, endStr) {
    var start = moment(startStr);
    var end = moment(endStr);
    return end.diff(start, 'seconds');
}

function addDurations(runs) {
    var total = 0;
    runs.forEach(function(t) {
        if (!t.isIntervallTraining) {
            total = total + calcDuration(t.start, t.end);
        }
    });
    return total;
}


function main() {
    var runs = http.getRuns();
    var totalDuration = addDurations(runs);
    console.log("total running time: " + totalDuration + " seconds")
}

main();
