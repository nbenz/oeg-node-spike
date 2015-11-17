function compareBids(b1, b2) {
    if (b1.cost > b2.cost)
        return -1;
    if (b1.cost < b2.cost)
        return  1;
    if (b1.timeStamp < b2.timeStamp)
        return -1;
    if (b1.timeStamp > b2.timeStamp)
        return  1;
    return 0;
}

function auction(teams) {
    var results = {};
    for (var i = 0; i < teams.length; i++) {
        for(var b of teams[i].bids) {
            var prev = results[b.landPoint];
            if (typeof prev === 'undefined' || compareBids(b, prev.bid) < 0) {
                results[b.landPoint] = { bid: b, team: i };
            }
        }
    }
    var values = [];
    for (var k in results) {
        values.push(results[k]);
    }
    return values;
}

var ts = [ {"bids":[{"landPoint": 2, "cost": 5,"timeStamp":100}]}, 
           {"bids":[{"landPoint": 2, "cost": 5,"timeStamp":555}]} ];
console.log("ts = " + JSON.stringify(ts));
var rs = auction(ts);
console.log("rs = " + JSON.stringify(rs));