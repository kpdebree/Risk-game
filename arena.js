// Arena: The place for all gamesteps and computations.
// All dynamic objects exist in here, and interact here, to maximize speed. All other classes need to exchange dynamic object through here.


// dependencies
var _ = require('underscore');


// primary dynamic objects:
var g; //graph (the board/map)
var bench, p1, p2, p3; // bench = players



////////////////////////////////
// Initialize map and players //
////////////////////////////////

var control = true; //control test: don't randomize
var init = require('./initmap.js').initMap(control);
// create graph g.
g = init.g;
exports.g = g;
// create all players
bench = init.bench;
p1 = bench[0];
p2 = bench[1];
p3 = bench[2];



/////////////////////////////////////
// Reinforce-attack call sequence: //
/////////////////////////////////////
// 1. update worths and pressures for nodes (between enemy turns to detect changes)
// 2. enumPriority w/ AI personality(permutation)
// 3. Reinforce based on priority lists and origin-map
// 4. attack by list


var dealerM = require('./dealer.js').dealer;
var dealer = new dealerM();

var AIM = require('./AI-modules.js').AI;

var test = ['Constant', 'agressive', 'tactical', 'rusher'];
var AI = new AIM(p1, test);
console.log(AI.trait('wf'));

var setofCards = [];
var arm = dealer.getArmies(AI.player, setofCards);
console.log(arm);


// Import from priority algorithm, construct PA
var PrioAlg = require('./priority-alg.js');
var PA = new PrioAlg.PA(g, bench);

// AI updating its info before moves
function AIupdate(AI) {
    // update worths, pressures, using AI's 'wf' trait
    PA.updateForPriority(AI.player, AI.trait('wf'));
    // return map of all best origins of attack
    var attOrgMap = PA.mapAttOrigins(AI.player);
    // enumerate the priority target list
    var priorityList = PA.enumPriority(AI.player, AI.trait('priority'), 3);
    // set orgMap and plist for AI
    AI.attOrgMap = attOrgMap;
    AI.priorityList = priorityList;
};
AIupdate(AI);

AI.tradeIn();

// AI will call dealer method with its cards to trade in


// console.log(p1);

// console.log(AI);
// console.log(AI.getArmies());




// console.log(deck);
// console.log(p1);


// Timer
var start = new Date().getTime();
for (i = 0; i < 100; ++i) {
    // AIupdate(AI);
}
var end = new Date().getTime();
var time = end - start;
// console.log(p1);
// console.log(g.nodes[0]);
console.log('Execution time: ' + time);

// console.log(g);
