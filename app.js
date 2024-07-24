document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const movesDisplay = document.getElementById('moves');
    const gameOverScreen = document.getElementById('gameOver');
    const restartButton = document.getElementById('restart');
    const width = 8;
    const squares = [];
    const candyColors = ['red', 'yellow', 'blue', 'green', 'orange', 'purple'];
    let score = 0;
    let moves = 20;

    // Create Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            const randomColor = Math.floor(Math.random() * candyColors.length);
            square.classList.add('candy');
            square.classList.add(candyColors[randomColor]);
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            grid.appendChild(square);
            squares.push(square);
        }
    }

    createBoard();

    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('dragend', dragEnd));
    squares.forEach(square => square.addEventListener('dragover', dragOver));
    squares.forEach(square => square.addEventListener('dragenter', dragEnter));
    squares.forEach(square => square.addEventListener('dragleave', dragLeave));
    squares.forEach(square => square.addEventListener('drop', dragDrop));

    function dragStart() {
        colorBeingDragged = this.className.split(' ')[1];
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {
        this.style.backgroundColor = '';
    }

    function dragDrop() {
        colorBeingReplaced = this.className.split(' ')[1];
        squareIdBeingReplaced = parseInt(this.id);
        squares[squareIdBeingDragged].className = 'candy ' + colorBeingReplaced;
        this.className = 'candy ' + colorBeingDragged;
    }

    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];

        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            moves--;
            movesDisplay.innerText = moves;
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].className = 'candy ' + colorBeingReplaced;
            squares[squareIdBeingDragged].className = 'candy ' + colorBeingDragged;
        } else squares[squareIdBeingDragged].className = 'candy ' + colorBeingDragged;

        checkForGameOver();
    }

    function checkForGameOver() {
        if (moves <= 0) {
            gameOverScreen.classList.remove('hidden');
            gameOverScreen.style.display = 'flex';
            squares.forEach(square => square.setAttribute('draggable', false));
        }
    }

    restartButton.addEventListener('click', () => {
        score = 0;
        moves = 20;
        scoreDisplay.innerText = score;
        movesDisplay.innerText = moves;
        gameOverScreen.classList.add('hidden');
        gameOverScreen.style.display = 'none';
        grid.innerHTML = '';
        squares.length = 0;
        createBoard();
        squares.forEach(square => square.setAttribute('draggable', true));
    });

    // Check for matches
    function checkRowForThree() {
        for (let i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].className.split(' ')[1];
            const isBlank = squares[i].classList.contains('blank');

            if (rowOfThree.every(index => squares[index].className.includes(decidedColor) && !isBlank)) {
                score += 3;
                scoreDisplay.innerText = score;
                rowOfThree.forEach(index => {
                    squares[index].className = 'candy blank';
                });
            }
        }
    }

    function checkColumnForThree() {
        for (let i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].className.split(' ')[1];
            const isBlank = squares[i].classList.contains('blank');

            if (columnOfThree.every(index => squares[index].className.includes(decidedColor) && !isBlank)) {
                score += 3;
                scoreDisplay.innerText = score;
                columnOfThree.forEach(index => {
                    squares[index].className = 'candy blank';
                });
            }
        }
    }

    // Make candies fall down
    function moveDown() {
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].classList.contains('blank')) {
                squares[i + width].className = squares[i].className;
                squares[i].className = 'candy blank';

                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && squares[i].classList.contains('blank')) {
                    let randomColor = Math.floor(Math.random() * candyColors.length);
                    squares[i].className = 'candy ' + candyColors[randomColor];
                }
            }
        }
    }

    window.setInterval(function () {
        moveDown();
        checkRowForThree();
        checkColumnForThree();
    }, 100);
});
