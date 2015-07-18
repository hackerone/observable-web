/// <reference path="./moment.d.ts" />
/// <reference path="./node.d.ts" />

var moment = require('moment');
var http = require('./http');

function calculateDuration(startStr, endStr) {
    var start = moment(startStr);
    var end = moment(endStr);
    return end.diff(start, 'seconds');
}

function addUpDurations(runs) {
    var total = 0;
    runs.forEach(function(t) {
        if (!t.isIntervallTraining) {
            total = total + calculateDuration(t.start, t.end);
        }
    });
    return total;
}


function main() {
    var runs = http.getRuns();
    var totalDuration = addUpDurations(runs);
    console.log("total running time: " + totalDuration + " seconds")
}

main();
