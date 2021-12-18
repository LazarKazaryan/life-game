let block_w = 10
let win_w = Math.floor(window.innerWidth / block_w);
let win_h = Math.floor(window.innerHeight / block_w);
let animSpeed = 100

const cvs = document.querySelector('#board')
cvs.width = win_w * block_w - 150
cvs.height = win_h * block_w

const ctx = cvs.getContext('2d')

let blocks = []
let allblocks = 0


function fillBlocks(){
    for (let i = 0; i < win_h; i++) {
        let row = []
        for (let j = 0; j < win_w; j++) {
            row.push(0)
            allblocks++
        }
        blocks.push(row)
    }
}

function fillBoard() {
    blocks = []
    for (let i = 0; i < win_h; i++) {
        for (let j = 0; j < win_w; j++) {
            let x = (block_w * j)
            let y = (block_w * i)
            ctx.fillStyle = `#ccc`
            ctx.lineWidth = 0.5
            ctx.strokeRect(x, y, block_w, block_w);

        }
    }
}

function render() {
    let live = [];
    blocks.forEach((row, row_idx) => {
        row.forEach((col, col_idx) => {
            let neighbors = {
                n_top_l: row_idx != 0 ? blocks[row_idx - 1][col_idx - 1] : 0,
                n_top_r: row_idx != 0 ? blocks[row_idx - 1][col_idx + 1] : 0,
                n_top: row_idx != 0 ? blocks[row_idx - 1][col_idx] : 0,
                n_bottom_l: row_idx + 1 < blocks.length ? blocks[row_idx + 1][col_idx - 1] : 0,
                n_bottom_r: row_idx + 1 < blocks.length ? blocks[row_idx + 1][col_idx + 1] : 0,
                n_bottom: row_idx + 1 < blocks.length ? blocks[row_idx + 1][col_idx] : 0,
                n_right: col_idx + 1 < row.length ? blocks[row_idx][col_idx + 1] : 0,
                n_left: col_idx - 1 > 0 ? blocks[row_idx][col_idx - 1] : 0
            }
            let n_count = 0
            for(let key in neighbors){
                if(neighbors[key] == 1){
                    n_count ++
                }
            }
            if(col == 0 && n_count == 1){
                live.push([row_idx,col_idx])
            }
            else if(col == 1){
                live.push([row_idx,col_idx])
            }
        })
    })

    ctx.clearRect(0, 0, cvs.width, cvs.height);
    fillBoard()
    allblocks = 0
    fillBlocks()
    
    live.forEach((l) => {
        ctx.fillStyle = '#000'
        ctx.fillRect(l[1] * block_w,l[0] * block_w,block_w,block_w)
        blocks[l[0]][l[1]] = 1
    })

    live = []
}

function draw(){
    for(let m = 0; m <blocks.length;m++){
        for(let n = 0; n <blocks[m].length;n++){
            if(blocks[m][n] == 1){
                ctx.fillStyle = '#000'
                ctx.fillRect(n * block_w,m * block_w,block_w,block_w)
            }
        }
    }

}

fillBoard()
fillBlocks()

let renderInterval

window.addEventListener('keyup' ,(e) => {
    if(e.key == 'Escape'){
        clearInterval(renderInterval)
    }
    if(e.key == 'Enter'){
        renderInterval = setInterval(render, animSpeed)
    }
})

document.querySelector('.start').addEventListener('click',() => {
    renderInterval = setInterval(render, animSpeed)
})
document.querySelector('.pause').addEventListener('click',() => {
    clearInterval(renderInterval)
})
document.querySelector('.random').addEventListener('click',() => {
    clearInterval(renderInterval)
    for(let i = 0; i < Math.round(allblocks / 2); i++){
        let y = Math.floor(Math.random() * win_w)
        let x = Math.floor(Math.random() * win_h)
    
        blocks[x][y] = 1
    }
    draw()
})
document.querySelector('.clear').addEventListener('click',() => {
    allblocks = 0
    fillBoard()
    fillBlocks()
    clearInterval(renderInterval)
    render()
})

document.querySelector('.speed > input').addEventListener('input',(e) => {
    animSpeed = Number(e.target.value)
    clearInterval(renderInterval)
    renderInterval = setInterval(render, animSpeed)
})


cvs.addEventListener('mousemove', (e) => {
    e.preventDefault()
    if(e.which != 0){
        clearInterval(renderInterval)
        let block_x = Math.floor(e.offsetX / block_w)
        let block_y = Math.floor(e.offsetY / block_w)
        if(e.which == 1){
            blocks[block_y][block_x] = 1
        }else if(e.which == 3){
            blocks[block_y][block_x] = 0
        }
        draw()
    }
})
cvs.addEventListener('mousedown', (e) => {
    e.preventDefault()
    clearInterval(renderInterval)
    let block_x = Math.floor(e.offsetX / block_w)
    let block_y = Math.floor(e.offsetY / block_w)
    if(e.which == 1){
        blocks[block_y][block_x] = 1
    }else if(e.which == 3){
        blocks[block_y][block_x] = 0
    }
    draw()
})
