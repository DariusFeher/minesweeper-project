this.firstClick = true;
newGame(true);

function beginnerGame(firstGame) {
	this.board_length = 5;
	this.board = new Array(this.board_length);
	this.no_bombs =  this.board_length;
	newGame();
}

function intermediateGame(firstGame) {
	this.board_length = 9;
	this.board = new Array(this.board_length);
	this.no_bombs =  this.board_length;
	newGame();
}

function expertGame(firstGame) {
	this.board_length = 16;
	this.board = new Array(this.board_length);
	this.no_bombs = this.board_length;
	newGame();
}

function createTable() {
	var table = document.createElement('table');
	table.className = "boardContainer";
	table.id = "board";
	for (var i = 0; i < this.board_length; i++) {
		this.board[i] = new Array(this.board_length);
	    var tr = document.createElement('tr');
		for (var j = 0; j < this.board_length; j++) {
			this.board[i][j] = "e"; // Set each square to empty
		    var td = document.createElement('td');
		    var cell = document.createElement("BUTTON");
		    cell.id = i.toString() + "," + j.toString();
		    cell.className = "table_but";
		    cell.onmousedown = function() {check(event, this)};
		    td.appendChild(cell);
		    tr.appendChild(td);
		}
	    table.appendChild(tr);
	}
	document.getElementById("table").appendChild(table);
}

function newGame() {
	var board = document.getElementById('board');
	if (board) {
		var parentBoard = board.parentElement;
		parentBoard.removeChild(board);
	}

	createTable();
	this.discoveredCells = new Array(this.board_length);
	for (var i = 0; i < this.board_length; i++){
		this.discoveredCells[i] = new Array(this.board_length);
		for (var j = 0; j < this.board_length; j++){
			this.discoveredCells[i][j] = 0;
			this.board[i][j] = "e"; // Set each square to empty
		    var id = i.toString() + "," + j.toString();
		    var cell = document.getElementById(id);
		    cell.disabled = false;
		    cell.style = "";
		    cell.innerHTML = "";
		}
	}
	
	this.firstClick = true;	
}

function initialiseVisited() {
	this.visited = new Array(this.board_length);
	for (var i = 0; i < this.board_length; i++) {
		this.visited[i] = new Array(this.board_length);
		for (var j = 0; j < this.board_length; j++) {
			this.visited[i][j] = 0;
		}
	}
}

function checkWin() {
	var no_discovered_cells = 0;
	for (var i = 0; i < this.board_length; i++) {
		for (var j = 0; j < this.board_length; j++) {
			no_discovered_cells += this.discoveredCells[i][j];
		}
	}
	if (no_discovered_cells + this.x_bomb_positions.length == this.board_length * this.board_length) {
		return true;
	}
	return false;
}

function check(event, cell) {
	var res = cell.id.split(",");
	var x = parseInt(res[0])
	var y = parseInt(res[1]);
	if (event.button == "2") {
		if (this.discoveredCells[x][y] == 0) {
			cell.style = "background-image: url(https://image.flaticon.com/icons/png/512/395/395841.png); background-size: 40px 40px;";
		}
	} else {
		if (this.firstClick == true) {
			placeBombs(cell);
			initialiseVisited();
			discoverCells(x, y);
		} else {
			if (this.board[x][y] == "b") {
				cell.style = "background-image: url(https://www.flaticon.com/premium-icon/icons/svg/1978/1978361.svg); background-size: 40px 40px;";
				cell.style.backgroundColor = "red";
				disableAll();
				discoverAllBombs(x, y);
				alert("Game over!");
			} else if (this.board[x][y] != "e") {
				cell.innerHTML = this.board[x][y];
				cell.style = "background-image:";
				cell.style.backgroundColor = "white";
				this.discoveredCells[x][y] = 1;
			} else {
				initialiseVisited();
				discoverCells(x, y);
			}
		}
		if (checkWin() == true) {
			discoverAllBombs();
			disableAll();
			alert("CONGRATULATIONS, YOU WON!");
		}
	}
}

function discoverAllBombs(x, y) {
	for (var i = 0; i < this.x_bomb_positions.length; i++) {
		if (this.x_bomb_positions[i] != x || this.y_bomb_positions[i] != y) {
			document.getElementById(this.x_bomb_positions[i].toString() + "," + this.y_bomb_positions[i].toString()).style = "background-image: url(https://www.flaticon.com/premium-icon/icons/svg/1978/1978361.svg); background-size: 40px 40px;";
		}
	}
}

function disableAll() {
	for (var i = 0; i < this.board_length; i++) {
		for (var j = 0; j < this.board_length; j++) {
			document.getElementById(i.toString() + "," + j.toString()).disabled = true;
		}
	}
}

function placeBombs(cell) {
	var res = cell.id.split(",");
	var x = parseInt(res[0])
	var y = parseInt(res[1]);

	this.x_bomb_positions = []
	this.y_bomb_positions = []

	while (this.x_bomb_positions.length < this.no_bombs) {
		var x_bomb_position = Math.floor(Math.random() * this.board_length);
		var y_bomb_position = Math.floor(Math.random() * this.board_length);
		if ((this.x_bomb_positions.indexOf(x_bomb_position) == -1  || this.y_bomb_positions.indexOf(y_bomb_position) == -1) &&  (x_bomb_position != x || y_bomb_position != y)) {
			this.x_bomb_positions.push(x_bomb_position);
			this.y_bomb_positions.push(y_bomb_position);
			this.board[x_bomb_position][y_bomb_position] = "b";
		}
	}
	fillSurroundingBombs();
	this.firstClick = false;
}

function fillSurroundingBombs() {
	for (var i = 0; i < this.board_length; i++) {
		for (var j = 0; j < this.board_length; j++) {
			if (this.board[i][j] == "e") {
				var no_surrounding_bombs = 0;
				if (i > 0) {
					if (this.board[i - 1][j] == "b") {
						no_surrounding_bombs++;
					}
					if (j < this.board_length - 1 && this.board[i - 1][j + 1] == "b") {
						no_surrounding_bombs++;
					}
					if (j > 0 && this.board[i - 1][j - 1] == "b") {
						no_surrounding_bombs++;
					}
				}
				if (j > 0 && this.board[i][j - 1] == "b") {
					no_surrounding_bombs++;
				}
				if (i < this.board_length - 1) {
					if (j > 0 && this.board[i + 1][j - 1] == "b") {
						no_surrounding_bombs++;
					}
					if (j < this.board_length - 1 && this.board[i + 1][j + 1] == "b") {
						no_surrounding_bombs++;
					}
					if (this.board[i + 1][j] == "b") {
						no_surrounding_bombs++;
					}
				}
				if (j < this.board_length - 1 && this.board[i][j + 1] == "b") {
					no_surrounding_bombs++;
				}
				if (no_surrounding_bombs) {
					this.board[i][j] = no_surrounding_bombs;
				}
			}
		}
	}
}

function discoverCells(i, j) {
	if (this.visited[i][j] == 0) {
		var button = document.getElementById(i.toString() + "," + j.toString());
		if (this.board[i][j] != "e") {
			button.innerHTML = this.board[i][j];
		}
		button.style = "background-image:";
		button.style.backgroundColor = "white";
		this.visited[i][j] = 1;
		this.discoveredCells[i][j] = 1;
		if (this.board[i][j] == "e") {
			if (i > 0) {
				discoverCells(i - 1, j);
				if (j < this.board_length - 1) {
					discoverCells(i - 1, j + 1);
				}
				if (j > 0) {
					discoverCells(i - 1, j - 1);
				}
			}
			if (j > 0) {
				discoverCells(i, j - 1);
			}
			if (j < this.board_length - 1) {
				discoverCells(i, j + 1);
			}
			if (i < this.board_length - 1) {
				if (j > 0) {
					discoverCells(i + 1, j - 1);
				}
				if (j < this.board_length - 1) {
					discoverCells(i + 1, j + 1);
				}
				discoverCells(i + 1, j);
			}
		}
	}
}
