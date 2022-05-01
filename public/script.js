"use strict"

const CLOSED = 0;
const OPENED = 1;
const FLAG = 2;
const MINE = 9;

const fieldW = 10;
const fieldH = 10;
const mineAmount = 10;

let field = [];

 for (let i = 0; i < fieldH; ++i) {
     let line = [];
     for (let j = 0; j < fieldW; ++j) {
        let cell = {
            obj: document.createElement("button"),
            type: CLOSED,
            value: 0
        };
        cell.obj.classList.add("cell");
        line.push(cell);
        document.body.appendChild(cell.obj);
     }
     document.body.appendChild(document.createElement("br"));
     field.push(line);
 }

function fillField() {
    let mines = 0;
    do {
        let mine_i = Math.round(Math.random() * (mineAmount - 1));
        let mine_j = Math.round(Math.random() * (mineAmount - 1));;
        if (field[mine_i][mine_j].value != MINE) {
            field[mine_i][mine_j].value = MINE;
            mines++;
        }
    } while (mines < mineAmount);
}
fillField();

let seconds = 0;
let clock = document.getElementById("timer");
let clockId = setInterval(function() {
    seconds++;
    clock.innerHTML = Math.floor(seconds / 60) + ':' + seconds % 60;
}, 1000);

let timerId = setTimeout(function() {
    alert("Чёт вы слишком долго играете... Наверное, вы не прочитали правила. Милости прошу в главное меню =)");
    endGame(false);
}, 3600000);

for (let i = 0; i < fieldH; ++i) {
    for (let j = 0; j < fieldW; ++j) {
        field[i][j].obj.onclick = function() {
            revealTile(i, j);
            checkWin();
        }
        field[i][j].obj.oncontextmenu = function() {
            if (field[i][j].type == CLOSED) {
                field[i][j].obj.innerHTML = '!';
                field[i][j].obj.classList.add("mine");
                field[i][j].type = FLAG;
            } else if (field[i][j].type == FLAG) {
                field[i][j].obj.innerHTML = '';
                field[i][j].obj.classList.remove("mine");
                field[i][j].type = CLOSED;
            }
            return false;
        }
    }
}

function countNghbs(x, y) {
    let result = 0;
    for (let i = y - 1; i < y + 2; ++i) {
        for (let j = x - 1; j < x + 2; ++j) {
            if ((i >= 0 && i < fieldH && j >= 0 && j < fieldW) && (i != y || j != x)) {
                if (field[i][j].value == MINE) {
                    result++;
                }
            }
        }
    }
    return result;
}

function revealTile(i, j) {
    if (field[i][j].type == CLOSED) {
        field[i][j].type = OPENED;
        if (field[i][j].value == MINE) {
            endGame(false);
        } else {
            field[i][j].obj.classList.add("opened");
            field[i][j].value = countNghbs(j, i);
            field[i][j].obj.innerHTML = field[i][j].value;
            if (field[i][j].value == 0) {
                revealNeighboringTiles(j, i);
            }
        }
        
    }
}

function revealNeighboringTiles(x, y) {
    for (let i = y - 1; i < y + 2; ++i) {
        for (let j = x - 1; j < x + 2; ++j) {
            if ((i >= 0 && i < fieldH && j >= 0 && j < fieldW) && (i != y || j != x)) {
                if (field[i][j].type == CLOSED) {
                    revealTile(i, j);
                }
            }
        }
    }
}

function checkWin() {
    for (let i = 0; i < fieldH; ++i) {
        for (let j = 0; j < fieldW; ++j) {
            if (field[i][j].type != OPENED && field[i][j].value != MINE) {
                return;
            }
        }
    }
    endGame(true);
}

function endGame(result) {
    for (let i = 0; i < fieldH; ++i) {
        for (let j = 0; j < fieldW; ++j) {
            if (field[i][j].value == MINE) {
                field[i][j].obj.classList.add("mine");
                field[i][j].obj.innerHTML = '*';
            }
        }
    }
    if (result) {
        alert("YOU WIN!!! Your time: " + Math.floor(seconds / 60) + ':' + seconds % 60);
    } else {
        alert("You lose =(");
    }
    let home = document.createElement("a");
    home.innerHTML = "Return to main menu";
    home.classList.add("menu");
    home.href = "/index.html";
    document.body.appendChild(home);
    clearInterval(clockId);
    clearTimeout(timerId);
}