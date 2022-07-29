function randomWhole(maxExclusive) {
    return Math.floor(Math.random() * maxExclusive);
}

function blockIndex(index) {
    const by = Math.floor(index / 27) * 27;
    const bx = Math.floor((index % 9) / 3) * 3;
    return by + bx;
}

function allowed(squares, index) {
    if (squares[index] !== null) return null;
    const out = Array(9).fill(true);

    // check column
    for (let i = index % 9; i < 81; i += 9)
        if (squares[i] !== null) out[squares[i]] = false;

    // check row
    const rowIndex = Math.floor(index / 9) * 9;
    for (let i = rowIndex; i < rowIndex + 9; i++)
        if (squares[i] !== null) out[squares[i]] = false;

    // check block
    const bi = blockIndex(index);
    for (let ri = bi; ri < bi + 27; ri += 9)
        for (let i = ri; i < ri + 3; i++)
            if (squares[i] !== null) out[squares[i]] = false;

    return out;
}

// checks for any mistakes in the sudoku board
function verifySudoku(tableData) {
    // check rows
    for (let y = 0; y < 81; y += 9) {
        const row = Array(9).fill(false);
        for (let x = y; x < y + 9; x++) {
            const data = tableData[x];
            if (data === null || row[data]) return false;
            row[data] = true;
        }
    }

    // check columns
    for (let x = 0; x < 9; x++) {
        const col = Array(9).fill(false);
        for (let y = x; y < 81; y += 9) {
            const data = tableData[y];
            if (data === null || col[data]) return false;
            col[data] = true;
        }
    }

    // check blocks
    for (let by = 0; by < 81; by += 27) {
        for (let bx = by; bx < by + 9; bx += 3) {
            const blk = Array(9).fill(false);
            for (let y = bx; y < bx + 27; y += 9) {
                for (let x = y; x < y + 3; x++) {
                    const data = tableData[x];
                    if (data === null || blk[data]) return false;
                    blk[data] = true;
                }
            }
        }
    }

    return true;
}

// take nth element of array
function take(arr, i) {
    let val = arr.pop();
    if (arr.length === i) return val;
    let out = arr[i];
    arr[i] = val;
    return out;
}

// removes and returns a random element
function takeRandom(arr) {
    const val = take(arr, randomWhole(arr.length));
    return val === undefined ? null : val;
}

// array from 0 to end-1
function arrayRange(end) {
    return [...Array(end).entries()].map(kv => kv[0]);
}

// returns an array of every index inside of array that is null
function emptySpaceIndices(arr) {
    return [...arr.entries()].filter(kv => kv[1] === null).map(kv => kv[0]);
}

// credit: https://www.codeproject.com/Articles/23206/Sudoku-Algorithm-Generates-a-Valid-Sudoku-in-0-018
// had to port from VB.NET to JavaScript, then make a couple modifications
function solveTable(squares = Array(81).fill(null), hole = null) {
    let spaces = emptySpaceIndices(squares).map(index => {
        const allowed_tiles = allowed(squares, index);
        let baseline = arrayRange(9).filter(x => allowed_tiles[x]);
        return {
            index,
            baseline,
            available: [...baseline],
        };
    });

    // sneakily insert a new hole but disallow the true value
    if (hole !== null) {
        const true_val = squares[hole];
        squares[hole] = null;
        let allowed_tiles = allowed(squares, hole);
        allowed_tiles[true_val] = false;
        let baseline = arrayRange(9).filter(x => allowed_tiles[x]);
        spaces.push({
            index: hole,
            baseline,
            available: [...baseline],
        });
    }

    let curIdx = 0;
    let current = spaces[curIdx];

    let iterations = 0;
    while (curIdx !== spaces.length) {
        const testNum = takeRandom(current.available);
        if (testNum !== null) {
            if (allowed(squares, current.index)[testNum]) {
                squares[current.index] = testNum;
                curIdx++;
                current = spaces[curIdx];
            }
        } else {
            current.available = [...current.baseline];
            curIdx--;
            if (curIdx < 0) return null;
            current = spaces[curIdx];
            squares[current.index] = null;
        }
        iterations++;
        // LOGICAL ERROR: it will not exhaustively search for solutions anymore if this is enabled
        // if (iterations > 8192) {
        //     if (hole === null) {
        //         alert('that took a little too many attempts. try again.');
        //         return squares;
        //     } else {
        //         return null;
        //     }
        // }
    }

    console.log(`iters: ${iterations}`);
    return squares;
}

// converts a pettan list of squares into a string
function gridStr(squares) {
    let grid = '';
    for (let y = 0; y < 9; y++) {
        let row = '';
        for (let x = 0; x < 9; x++) {
            row += squares[y * 9 + x] + ' ';
        }
        grid += row + '\n';
    }
    return `grid:\n${grid}`;
}

// pokes holes in the list of squares until either the target is reached
// or you can't poke any more without creating multiple solutions
function pokeHoles(squares, target) {
    if (target > 50) {
        alert("don't generate more than 50 holes. It takes too long.");
        return;
    }
    let filled = arrayRange(81);
    for (let count = 0; count < target; ) {
        const idx = takeRandom(filled);
        if (idx === null) {
            alert(`could only generate ${count} out of ${target} holes.`);
            return;
        }
        const testSolve = solveTable([...squares], idx);
        if (testSolve !== null) {
            if (count > 60) alert(count, gridStr(testSolve));
            // alert('nonnull');
            continue;
        }
        squares[idx] = null;
        count++;
    }
}

// TODO: use json
const members = [
    {
        name: 'risu',
        link: 'https://hololive.hololivepro.com/wp-content/uploads/2022/04/%E3%83%AA%E3%82%B9-1.png',
    },
    {
        name: 'moona',
        link: 'https://hololive.hololivepro.com/wp-content/uploads/2022/04/%E3%83%A0%E3%83%BC%E3%83%8A-1.png',
    },
    {
        name: 'iofi',
        link: 'https://hololive.hololivepro.com/wp-content/uploads/2022/04/%E3%82%A4%E3%82%AA%E3%83%95%E3%82%A3-1.png',
    },
    {
        name: 'ollie',
        link: 'https://hololive.hololivepro.com/wp-content/uploads/2021/11/kureiji_ollie_thumb-2.png.png',
    }, // yes there are 2 .png's
    {
        name: 'anya',
        link: 'https://hololive.hololivepro.com/wp-content/uploads/2021/11/anya_melfissa_thumb-2.png.png',
    }, // 2 .png's again
    {
        name: 'reine',
        link: 'https://hololive.hololivepro.com/wp-content/uploads/2021/11/pavolia_reine_thumb-2.png.png.png',
    }, // now this is getting out of hand
    {
        name: 'zeta',
        link: 'https://hololive.hololivepro.com/wp-content/uploads/2022/03/1_%E3%83%99%E3%82%B9%E3%83%86%E3%82%A3%E3%82%A2%E3%83%BB%E3%82%BC%E3%83%BC%E3%82%BF.png',
    }, // she uses so many unicode characters in her link dude
    {
        name: 'kaela',
        link: 'https://hololive.hololivepro.com/wp-content/uploads/2022/03/2_%E3%82%AB%E3%82%A8%E3%83%A9%E3%83%BB%E3%82%B3%E3%83%B4%E3%82%A1%E3%83%AB%E3%82%B9%E3%82%AD%E3%82%A2.png',
    }, // ...
    {
        name: 'kobo',
        link: 'https://hololive.hololivepro.com/wp-content/uploads/2022/03/3_%E3%81%93%E3%81%BC%E3%83%BB%E3%81%8B%E3%81%AA%E3%81%88%E3%82%8B.png',
    }, // pls why is your gen so unicode
];

// converts a nullable id into a url to an image
function getMemberImgUrl(id) {
    return id === null
        ? 'https://static.wikia.nocookie.net/fc620067-166e-48d9-baa7-44abee59e6e1/scale-to-width/755'
        : members[id].link;
}

function makeTile(clickable) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    if (clickable) {
        tile.classList.add('clickable');
        tile.tabIndex = -1;
    }
    return tile;
}

// creates a tile with a holomem's picture on it
// if clickable, the tile will react to mouse hovers and clicks
// however will not actually do anything until functionality is provided
function makeImageTile(src, clickable) {
    const tile = makeTile(clickable);
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('tile');
    tile.appendChild(img);
    return tile;
}

function submitSudoku(tableData) {
    if (verifySudoku(tableData)) {
        alert('You Win!');
    } else {
        alert("The board isn't solved yet, try again.");
    }
}

function viewTile(target, tableData, tileIdx) {
    const view = document.getElementById('tileView');
    view.innerHTML = '';

    const div = document.createElement('div');
    div.innerHTML = '<h1>Change Tile?</h1>';

    // makes the block of holomems
    function makeSetterTile(data) {
        const src = getMemberImgUrl(data);
        const tile = makeImageTile(src, true);
        tile.onclick = _ => {
            tableData[tileIdx] = data;
            target.children[0].src = src;
            target.focus();
        };
        return tile;
    }
    const table = make3x3((x, y) => makeSetterTile(y * 3 + x));

    // TODO: generalize make3x3 to allow this 3x4
    // or not?
    const row = document.createElement('tr');
    function append(thing) {
        const tile = document.createElement('td');
        tile.appendChild(thing);
        row.appendChild(tile);
    }

    // append close button
    const close = makeImageTile(
        'https://toppng.com/uploads/preview/red-x-in-circle-x-ico-11563249170jvl0jhe7df.png',
        true
    );
    close.onclick = _ => closeTileView();
    append(close);

    // append empty tile
    append(makeSetterTile(null));

    // append submit button
    const submit = makeImageTile(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Eo_circle_green_white_checkmark.svg/800px-Eo_circle_green_white_checkmark.svg.png',
        true
    );
    submit.onclick = _ => submitSudoku(tableData);
    append(submit);

    table.appendChild(row);
    div.appendChild(table);

    view.appendChild(div);
}

function closeTileView() {
    document.getElementById('tileView').innerHTML = '<h1>Select a tile.</h1>';
}

function makeSudokuTile(tableData, tileIdx) {
    const data = tableData[tileIdx];
    const holoTile = makeImageTile(getMemberImgUrl(data), data === null);
    holoTile.onclick =
        data === null
            ? _ => viewTile(holoTile, tableData, tileIdx)
            : _ => closeTileView();
    return holoTile;
}

function make3x3(f) {
    const table = document.createElement('table');
    for (let y = 0; y < 3; y++) {
        const row = document.createElement('tr');
        for (let x = 0; x < 3; x++) {
            const tile = document.createElement('td');
            tile.appendChild(f(x, y));
            row.appendChild(tile);
        }
        table.appendChild(row);
    }
    return table;
}

// takes a pettan list of squares and displays it to the user
// by inserting the sudoku board into the element with id 'board'
function makeTable(squares) {
    closeTileView();
    const board = document.getElementById('board');
    board.innerHTML = '';
    board.appendChild(
        make3x3((bx, by) =>
            make3x3((x, y) => {
                const tileIdx = by * 27 + bx * 3 + y * 9 + x;
                return makeSudokuTile(squares, tileIdx);
            })
        )
    );
}

// generates a new sudoku puzzle with the specified number of holes
function generate() {
    const table = solveTable();
    console.log(gridStr(table));
    const holeCount = document.getElementById('holeCount').value;
    const solved = [...table];
    pokeHoles(table, holeCount);
    console.log(gridStr(table));
    makeTable(table);
}
generate();
