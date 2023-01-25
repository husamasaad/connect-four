// Selectors
const playerTurn = document.getElementById('pl-turn');
const columns = [...document.getElementsByTagName('tr')];
const board = document.querySelector('.board');
const menu = document.getElementById('menu');
const restart = document.getElementById('reset');
const newGameLi = [...document.querySelectorAll('.start-game li')];
const closeRules = document.getElementById('close-rules');
const newGame = document.querySelector('.start-game');
const gameRules = document.querySelector('.start-game-con .game-rules');
const model = document.querySelector('.start-game-con');
const results = document.querySelector('.game-won');
const theWinner = document.getElementById('results');
const playAgain = document.getElementById('play-again');


// Setup
let currentPlayer = 1;
let winningArray = [ 
  [0, 1, 2, 3], [41, 40, 39, 38],[7, 8, 9, 10], 
  [34, 33, 32, 31], [14, 15, 16, 17], [27, 26, 25, 24], 
  [21, 22, 23, 24], [20, 19, 18, 17], [28, 29, 30, 31], 
  [13, 12, 11, 10], [35, 36, 37, 38], [6, 5, 4, 3], 
  [0, 7, 14, 21], [41, 34, 27, 20], [1, 8, 15, 22], 
  [40, 33, 26, 19], [2, 9, 16, 23], [39, 32, 25, 18], 
  [3, 10, 17, 24], [38, 31, 24, 17], [4, 11, 18, 25], 
  [37, 30, 23, 16], [5, 12, 19, 26], [36, 29, 22, 15], 
  [6, 13, 20, 27], [35, 28, 21, 14], [0, 8, 16, 24], 
  [41, 33, 25, 17], [7, 15, 23, 31], [34, 26, 18, 10], 
  [14, 22, 30, 38], [27, 19, 11, 3], [35, 29, 23, 17], 
  [6, 12, 18, 24], [28, 22, 16, 10], [13, 19, 25, 31], 
  [21, 15, 9, 3], [20, 26, 32, 38], [36, 30, 24, 18], 
  [5, 11, 17, 23], [37, 31, 25, 19], [4, 10, 16, 22], 
  [2, 10, 18, 26], [39, 31, 23, 15], [1, 9, 17, 25], 
  [40, 32, 24, 16], [9, 7, 25, 33], [8, 16, 24, 32], 
  [11, 7, 23, 29], [12, 18, 24, 30], [1, 2, 3, 4], 
  [5, 4, 3, 2], [8, 9, 10, 11], [12, 11, 10, 9],
  [15, 16, 17, 18], [19, 18, 17, 16], [22, 23, 24, 25], 
  [26, 25, 24, 23], [29, 30, 31, 32], [33, 32, 31, 30], 
  [36, 37, 38, 39], [40, 39, 38, 37], [7, 14, 21, 28], 
  [8, 15, 22, 29], [9, 16, 23, 30], [10, 17, 24, 31], 
  [11, 18, 25, 32], [12, 19, 26, 33], [13, 20, 27, 34] 
  ];


// handle New Game Model
newGameLi.forEach((li, index) => {
  li.addEventListener('click', () => {
    switch (index) {
      case 0:
        model.style.top = "-200%";
        li.textContent = "Continue the Game";
        newGameLi[1].remove();
        addLi();
        break;
      case 1:
        Swal.fire({
          position: 'center',
          icon: "info",
          title: 'Ai Player will be added Soon!',
          showConfirmButton: true,
        });
        break;
      case 2:
        newGame.classList.add('hide');
        gameRules.classList.add('show');
        closeRules.addEventListener('click', () => {
          newGame.classList.remove('hide');
          gameRules.classList.remove('show');
        })
    }
  })
})


// handling menu and restart
menu.onclick = () => {
  model.style.top = "0";
}

function addLi() {
  let ul = document.querySelector('.start-game ul');
  if (ul.children.length == 2) {
    let li = document.createElement('li');
    li.textContent = "Exit Game";
    li.addEventListener('click', () => {
      location.reload();
    })
    ul.appendChild(li);
  }
}

restart.addEventListener('click', resetGame);
playAgain.addEventListener('click', resetGame);

function resetGame() {
  let slots = [...document.querySelectorAll('.board td')];

  slots.forEach((slot) => {
    slot.classList.remove('checked');
    slot.classList.remove('pl2');
    slot.classList.remove('pl1');

    currentPlayer = 1;
    playerTurn.innerHTML = `Player ${currentPlayer}'s turn`;
    playerTurn.className = `p${currentPlayer}`;
    board.classList.add(`pt${currentPlayer}`);

    columns.forEach(col => {
      col.removeEventListener("click", handler, true);
    })
  })
  results.classList.remove('show');
}



// Click event for each column
columns.forEach((col, index) => {
  col.addEventListener('click', function dropIt() {
    let slots = [...col.querySelectorAll('.board td')];
    for (i = 5; i  >= 0; i--) {
      if (!slots[i].classList.contains('checked')) {
        slots[i].classList.add('checked');
        slots[i].classList.add(`pl${currentPlayer}`);
        board.classList.remove(`pt${currentPlayer}`);
        checkWin(`pl${currentPlayer}`);
        currentPlayer = currentPlayer == 1? 2 : 1;
        playerTurn.innerHTML = `Player ${currentPlayer}'s turn`;
        playerTurn.className = `p${currentPlayer}`;
        board.classList.add(`pt${currentPlayer}`);
        break;
      }
    }
  })
})

function checkWin(cp) { 
  let takenSlots = [...document.querySelectorAll(`.${cp}`)];
  let SlotsArr = takenSlots.map((slot) => {
    return parseInt(slot.dataset.slot);
  });

  winningArray.forEach(win => {
    if (win.every((cs) => {
      if (SlotsArr.indexOf(cs) != -1) {
        return true
      }
    })) {
      declareWinner(cp);
    }
  })
}


function declareWinner(cp) {
  let winner = cp == "pl1" ? 1: 2;
  console.log('you win')

  // Stop clicking Event
  columns.forEach(col => {
    col.addEventListener("click", handler, true);
  })

  theWinner.innerHTML = `Player ${winner} is the winner`;
  theWinner.className = `p${winner}`;
  results.classList.add('show');

}


function handler(e) {
  e.stopPropagation();
  e.preventDefault();
}