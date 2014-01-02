/*
var hashTable = new HashTable({"000000000": 0});

//-------------------------------
// display contents of hashTable
var all = "";
hashTable.each(function(k, v) {
	all += 'key is: ' + k + ', value is: ' + v + '\n';
});
alert(all);

//-------------------------------
if (!hashTable.hasItem(scenario)){
	hashTable.setItem(scenario, mapTernaryStringToDecimal(scenario));
}
		
// ===========================		
// HASH TABLE
// ===========================		
function HashTable(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }
   
    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
};
*/

var gameMath = (function() {
	return {
		// map -/X/0 to 0/1/2
		mapTileValueToTernaryValue: function (tileValue) {
			var mapping = "";
			if (tileValue == "X"){
				mapping = "1";
			}
			else if (tileValue == "0"){
				mapping = "2";
			}
			else if (tileValue == "-") {
				mapping = "0";
			}
			else {
				alert("ERROR: invalid tile value " + tileValue);
			}
			
			return mapping;
		},

		// map string of 0,1,2 to a decimal value. Where left-most is the smallest value.
		// does not check to make sure the string only has 0,1, and 
		mapTernaryStringToDecimal: function (ternaryString) {
			var decimalValue = 0;
			for (var i=0; i< ternaryString.length;i++){
				decimalValue += Math.pow(3,i) * parseInt(ternaryString[i]);
			}
			return decimalValue;
		},

		// return representation of a number N
		// in the system based on radix 
		mapDecimalToAnother: function (N, radix){
		    var hex = new Array();
			hex[1] = "0";    
			hex[2] = "1";    
			hex[3] = "2";    
			hex[4] = "3";    
			hex[5] = "4";    
			hex[6] = "5";    
			hex[7] = "6";    
			hex[8] = "7";    
			hex[9] = "8";    
			hex[10] = "9";    
			hex[11] = "A";    
			hex[12] = "B";    
			hex[13] = "C";    
			hex[14] = "D";    
			hex[15] = "E";    
			hex[16] = "F";    
			hex[17] = "G";    
			hex[18] = "H";    
			hex[19] = "I";    
			hex[20] = "J";    
			hex[21] = "K";    
			hex[22] = "L";    
			hex[23] = "M";    
			hex[24] = "N";    
			hex[25] = "O";    
			hex[26] = "P";    
			hex[27] = "Q";    
			hex[28] = "R";    
			hex[29] = "S";    
			hex[30] = "T";    
			hex[31] = "U";    
			hex[32] = "V";    
			hex[33] = "W";    
			hex[34] = "X";    
			hex[35] = "Y";    
			hex[36] = "Z";    
			s = "";
			A = N;
			while (A >= radix) {
				B = A % radix;
				A = Math.floor(A / radix);
				s += hex[B+1];
			};
			s += hex[A+1];
	
			return s;
		},

	}
})();


// ===========================		
// BOARD 
// ===========================		
var Board = (function() {
	return function() {
		var EMPTY_TILE = "-";
		var init = false;
		var currentBoardState = new Array();
		
		return {
			init: function(){
				if (!init){
					for (var i=0; i<9; i++){
						currentBoardState[i] = document.getElementById('q'+i);
					}
					init = true;
				}
			},

			clear: function() {
				for (i=0;i<currentBoardState.length;i++){
					currentBoardState[i].value = EMPTY_TILE;
				}
			},
			
			areThereEmptyTiles: function(){
				var emptyTiles = false;
				for (i=0;i<currentBoardState.length;i++){
					// see if there are any empty tiles
					if (this.getBoardTileValue(i) == '-') {
						emptyTiles = true;
						break;
					}
				}
				return emptyTiles;
			},
			
			getBoardTileValue: function(tileNumber){
				return currentBoardState[tileNumber].value;
			},
			
			updateBoardTileValue: function (tileNumber, value){
				currentBoardState[tileNumber].value = value;
			},
			
			getBoardTernaryString: function(){
				var ternaryString = "";
				for (var i=0;i<9;i++){
					ternaryString += gameMath.mapTileValueToTernaryValue(this.getBoardTileValue(i));
				}
				return ternaryString;
			},
			
		}
	}
})();

// A "scenario" is a board with X and/or 0 in it the probabities are used to determine how good is the 
// outcome of placing your next move in the corresponding tile so if all the probabilities are 1 except 
// for one that's 3 then the 3 has a higher chance of success.
var Scenario = (function() {
	return function(theIndex) {
		var index = theIndex;	// ternary representation of the board state
		var tileProbability = new Array(0,0,0,0,0,0,0,0,0);
		
		return {
			init: function(){
				var ternaryString = gameMath.mapDecimalToAnother(index, 3);

				// make ternaryString 9 chars
				var ternaryStringLength = ternaryString.length;
				for(var i=0;i< (9 - ternaryStringLength);i++){
					ternaryString += "0";
				}
				// init probabity of empty tiles to 1
				for (var i=0; i<9; i++){
					if (ternaryString[i] == "0"){
						tileProbability[i] = 1;
					};
				};
			},
			
			getIndex: function(){
				return index;
			},
			setIndex: function(theIndex){
				index = theIndex;
				return index;
			},
			
			addToTileProbability: function(tileNumber) {
				tileProbability[tileNumber] += 1;
			},			
			subtractToTileProbability: function(tileNumber) {
				if (tileProbability[tileNumber] > 0) {
					tileProbability[tileNumber] -= 1;
				}
			},		
			setTileProbability: function (tileNumber, probValue){
				tileProbability[tileNumber] = probValue;
			},
			getTileProbability: function(tileNumber) {
				return tileProbability[tileNumber]
			},			
			getRandomEmptyTileByProbability: function(){
				var min = 0.1;
				var max = 0;
				for(var i = 0; i < tileProbability.length; i++) {
					max += tileProbability[i];
				}

				// get a tile at random based on their probability (tiles that lead to successful outcomes have higher probabilities)
				var randomNumber = Math.random() * (max - min) + min;
				var randomTile = 0;
				var sumOfPreviousProbabilities = 0;
				for(var i = 0; i < tileProbability.length; i++) {
					randomTile = i;
					sumOfPreviousProbabilities += tileProbability[i];
					if (randomNumber <= sumOfPreviousProbabilities){
						break;
					}
				}
				return randomTile;
			},
		}
	}
})();
	

function isItWinner(board, tileValue) {
	var isItTheWinner = false;
	if (board.getBoardTileValue(0) == tileValue){
		// top row
		if ((board.getBoardTileValue(0) == board.getBoardTileValue(1)) && (board.getBoardTileValue(0) == board.getBoardTileValue(2))){
			isItTheWinner = true; 
		}
		// top left to lower right diagonal
		if ((board.getBoardTileValue(0) == board.getBoardTileValue(4)) && (board.getBoardTileValue(0) == board.getBoardTileValue(8))){
			isItTheWinner = true; 
		}
		// left column
		if ((board.getBoardTileValue(0) == board.getBoardTileValue(3)) && (board.getBoardTileValue(0) == board.getBoardTileValue(6))){
			isItTheWinner = true; 
		}
	}
	if (board.getBoardTileValue(1) == tileValue){
		// middle column
		if ((board.getBoardTileValue(1) == board.getBoardTileValue(4))&&(board.getBoardTileValue(1) == board.getBoardTileValue(7))){
			isItTheWinner = true; 
		}		
	}
	if (board.getBoardTileValue(2) == tileValue){
		// right column
		if ((board.getBoardTileValue(2) == board.getBoardTileValue(5)) && (board.getBoardTileValue(2) == board.getBoardTileValue(8))){
			isItTheWinner = true; 
		}
		if ((board.getBoardTileValue(2) == board.getBoardTileValue(4)) && (board.getBoardTileValue(2) == board.getBoardTileValue(6))){
			isItTheWinner = true; 
		}
	}
	if (board.getBoardTileValue(3) == tileValue){
		// middle row
		if ((board.getBoardTileValue(3) == board.getBoardTileValue(4))&&(board.getBoardTileValue(3) == board.getBoardTileValue(5))){
			isItTheWinner = true; 
		}	
	}
	if (board.getBoardTileValue(6) == tileValue){
		// bottom row
		if ((board.getBoardTileValue(6) == board.getBoardTileValue(7))&&(board.getBoardTileValue(7) == board.getBoardTileValue(8))){
			isItTheWinner = true; 
		}	
	}
	
	return isItTheWinner;
}

// ----------------------------
// INITIALIZE 
// ----------------------------
var board = Board();
var scenario = new Array();
for (var i=0; i<19683; i++){
	scenario[i] = Scenario(i);
	scenario[i].init();
}
var previousBoardScenario = board.getBoardTernaryString();
var previousComputerTile = 0;
	
// ----------------------------
// MAIN
// ----------------------------
function doTicTacToe(inTile) {
	board.init();

	var theWinner = 0;	/* nobody = 0, player = 1, ai = 2 */
		
	if (document.getElementById('q'+inTile).value != "-") {
		// can only place in an empty tile
	}
	else{	
		// -------------------------------------------------------------------
		// UPDATE GUI WITH PLAYER'S MOVE
		board.updateBoardTileValue(inTile, "X");
		
		// -------------------------------------------------------------------
		// DID PLAYER WIN?
		if (theWinner == 0){		
			if (isItWinner(board, "X")){		
				theWinner = 1;

				// update probabilities. Punish punish previous computer move
				var indexOfPrevScenario = gameMath.mapTernaryStringToDecimal(previousBoardScenario);
				scenario[indexOfPrevScenario].setTileProbability(previousComputerTile, 0);
				
				alert("You won");
			}
		}

		// -------------------------------------------------------------------
		// IF THE PLAYER DIDN'T WIN THEN IT'S THE COMPUTER'S TURN
		if (theWinner == 0){
			if (board.areThereEmptyTiles()){
				previousBoardScenario = board.getBoardTernaryString();

				// get random tile based on probability of success
				var notDone = true;
				while(notDone){
					scenarioIndex = gameMath.mapTernaryStringToDecimal(previousBoardScenario);
					var randomTile = scenario[scenarioIndex].getRandomEmptyTileByProbability();
					if (board.getBoardTileValue(randomTile) == "-"){
						notDone = false;
					};
				}
				previousComputerTile = randomTile;

				board.updateBoardTileValue(randomTile, "0");

				// did the computer win?
				if (isItWinner(board, "0")){
					theWinner = 2;

					// update probabilities. Reward the move
					var indexOfPrevScenario = gameMath.mapTernaryStringToDecimal(previousBoardScenario);
					scenario[indexOfPrevScenario].addToTileProbability(randomTile);

					alert("Computer won");
				}
			}
		}

		// -------------------------------------------------------------------
		// RESET BOARD
		if (theWinner == 0) {
			// if there are no more moves left then it's a tie
			if (board.areThereEmptyTiles() == false){
				alert("It's a tie");
				board.clear();
			}
		}
		// there was a winner. Get board ready for the next game.
		else {
			theWinner = 0;
			board.clear();
		};	
	};
}


