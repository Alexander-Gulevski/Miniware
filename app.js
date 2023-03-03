document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const flagsLeft = document.querySelector("#flags-left");
  const result = document.querySelector("#result");
  let width = 16;
  let bombAmount = 40;
  let flags = 0;
  let squares = [];
  let isGameOver = false;
  let clickAmount = 0;
  

  //create Board
  function createBoard() {
    flagsLeft.innerHTML = bombAmount;

    //get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    let gameArray = emptyArray.concat(bombsArray);
    let shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      
      //
      square.addEventListener("mousedown", function (e) {
        result.innerHTML = "😱";
      });
      square.addEventListener("mouseup", function (e) {
        result.innerHTML = "🙂";
      });
      //normal click
      square.addEventListener("click", function (e) {
        click(square);
        if (clickAmount === 0) {
          window.setInterval(stopwatch, 1000);
          window.setInterval(timer, 60000);
          clickAmount++;
        }
      // time
        function timer() {
          let minutTimer = document.querySelector("#minutTimer");
          if (
            parseInt(minutTimer.innerHTML) === 0 ||
            isGameOver === true
          ) {
            gameOver();
            clearInterval()
          } else{
            minutTimer.innerHTML = parseInt(minutTimer.innerHTML) - 1;
          }
        }
        function stopwatch() {
          let secondStopwatch = document.querySelector("#secondStopwatch");
          let minutStopwatch = document.querySelector("#minutStopwatch");
          if (
            parseInt(minutStopwatch.innerHTML) === 40 ||
            isGameOver === true
          ) {
            gameOver();
            clearInterval();
          } else {
            if (parseInt(secondStopwatch.innerHTML) === 60 ) {
              secondStopwatch.innerHTML = 0;
              minutStopwatch.innerHTML = parseInt(minutStopwatch.innerHTML) + 1;
            } else {
              secondStopwatch.innerHTML =
                parseInt(secondStopwatch.innerHTML) + 1;
            }
          }
        }
      });

      //cntrl and left click
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    //add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains("valid")) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++;
        if (
          i > 15 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++;
        if (i > 16 && squares[i - width].classList.contains("bomb")) total++;
        if (
          i > 17 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          total++;
        if (
          i < 254 &&
          !isRightEdge &&
          squares[i + 1].classList.contains("bomb")
        )
          total++;
        if (
          i < 246 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++;
        if (
          i < 244 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++;
        if (i < 245 && squares[i + width].classList.contains("bomb")) total++;
        squares[i].setAttribute("data", total);
      }
    }
  }
  createBoard();

  //add Flag with right click
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = " 🚩";
        flags++;
        flagsLeft.innerHTML = bombAmount - flags;
        checkForWin();
      } else if (!square.classList.contains("question")) {
        square.classList.add("question");
        square.innerHTML = "?";
      } else {
        square.classList.remove("flag");
        square.classList.remove("question");
        flags--;
        flagsLeft.innerHTML = bombAmount - flags;
        square.innerHTML = "";
      }
    }
  }

  //click on square actions
  function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      let total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("checked");
        if (total == 1) square.classList.add("one");
        if (total == 2) square.classList.add("two");
        if (total == 3) square.classList.add("three");
        if (total == 4) square.classList.add("four");
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }
  //check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 15 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 16) {
        const newId = squares[parseInt(currentId - width)].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 17 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 254 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 246 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 244 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 245) {
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  //game over

  function gameOver() {
    result.innerHTML = "😔";
    isGameOver = true;
    window.clearInterval();
    //show ALL the bombs
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
        square.classList.remove("bomb");
        square.classList.add("checked");
      }
    });
  }

  //check for win
  function checkForWin() {
    ///simplified win argument
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bombAmount) {
        result.innerHTML = "😎";
        isGameOver = true;
        window.clearInterval();
      }
    }
  }

  // result.addEventListener('click', () => {
  //   console.log('click res');
  //   grid.innerHTML = '';
  //   createBoard();
  // })
  // function update(){
  //   console.log(1,2,3)
  //   grid.innerHTML = '';
  //     createBoard();
  // }
});