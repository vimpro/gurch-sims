let c = document.getElementById("canvas")
let ctx = c.getContext("2d")

const WIDTH = 500
const HEIGHT = 500

function drawAxis() {
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2

    // y axis
    ctx.beginPath()
    ctx.moveTo(WIDTH / 2, 0)
    ctx.lineTo(WIDTH / 2, HEIGHT)
    ctx.stroke()

    // x axis
    ctx.beginPath()
    ctx.moveTo(0, HEIGHT/2)
    ctx.lineTo(WIDTH, HEIGHT/2)
    ctx.stroke()

    ctx.lineWidth = 1
    ctx.strokeStyle = "grey"
    
    // minor y axes
    for (let i = 1; i < 10; i++) {
        ctx.beginPath()
        ctx.moveTo(i * 50, 0)
        ctx.lineTo(i * 50, HEIGHT)
        ctx.stroke()
    }

    // minor x axes
    for (let i = 1; i < 10; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * 50)
        ctx.lineTo(WIDTH, i * 50)
        ctx.stroke()
    }
}

function drawFunction(fn, color) {
    let points = []

    for (let i = -WIDTH/2; i < WIDTH/2; i++) {
        let yval = eval(fn.replaceAll("x", i.toString()))
        points.push(yval)
    }

    ctx.lineWidth = 3
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(0, HEIGHT/2-points[0])
    for (let i = 1; i < 500; i++) {
        ctx.lineTo(i, HEIGHT/2-points[i])
    }
    ctx.stroke()
}

// build function string given little endian format coefficients
// e.g., given [4, 0, 5, 2] build 4 + 0x + 5x^2 + 2x^4
function buildFnString(fn_coefficients) {
    let fn_string = ""
    for (let i = 0; i < fn_coefficients.length; i++) {
        let term = ""
        term += fn_coefficients[i]
        for (let j = 0; j < i; j++) {
            term += "*x"
        }
        fn_string += term + "+"
    }
    fn_string = fn_string.substring(0, fn_string.length-1)
    return fn_string
}

let functions = []

function drawAll() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    drawAxis()

    for (let fn of functions) {
        drawFunction(fn)
    }

    requestAnimationFrame(drawAll)
}

drawAll()

document.getElementById("input").onchange = (e) => {
    functions[0] = e.target.value
}

// drawFunction(buildFnString([0, 2]), "red")