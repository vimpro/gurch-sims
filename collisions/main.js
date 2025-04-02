const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.getAttribute("width")
const HEIGHT = canvas.getAttribute("height")

const GRAVITY = -100
const GRAVITY_DAMPEN = 0.5

let items = []

let deltaT

function runFrame() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    deltaT = 0.001 * (Date.now() - prevTime)
    prevTime = Date.now()

    for (let item of items) {
        item.x += item.vx * deltaT
        item.y += item.vy * deltaT
        
        if (item.y <= item.size) {
            item.y = item.size
            item.vy *= -1 * GRAVITY_DAMPEN
        } else if (item.y >= HEIGHT - item.size) {
            item.y = HEIGHT - item.size
            item.vy *= -1 * GRAVITY_DAMPEN
        } else {
            item.vy += GRAVITY * deltaT
        }

        if (item.x >= WIDTH - item.size) {
            item.x = WIDTH - item.size
            item.vx *= -1 * GRAVITY_DAMPEN
        } else if (item.x <= item.size) {
            item.x = item.size
            item.vx *= -1 * GRAVITY_DAMPEN
        }

        // collisions
        for (let otheritem of items) {
            if (otheritem.id === item.id) continue
            if (intersecting(item, otheritem)) {
                let distance = Math.sqrt((item.x - otheritem.x) ** 2 + (item.y - otheritem.y) ** 2)
                let vCollisionNorm = {x: (item.x - otheritem.x) / distance, y: (item.y - otheritem.y) / distance};

                let vRelativeVelocity = {x: item.vx - otheritem.vx, y: item.vy - otheritem.vy};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                item.vx -= speed * vCollisionNorm.x
                item.vy -= speed * vCollisionNorm.y
                otheritem.vx += speed * vCollisionNorm.x
                otheritem.vy += speed * vCollisionNorm.y
            }
        }

        ctx.fillStyle = item.color
        ctx.beginPath()
        ctx.arc(item.x, HEIGHT-item.y, item.size, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke()
    }

    requestAnimationFrame(runFrame)
}

let prevTime = Date.now()
requestAnimationFrame(runFrame)

function spawnObject() {
    let item = {}
    let form = document.getElementById("spawnform")
    item["id"] = Math.floor(Math.random() * 100000)
    item["x"] = Number(form.elements["x"].value)
    item["y"] = Number(form.elements["y"].value)
    item["vx"] = Number(form.elements["vx"].value)
    item["vy"] = Number(form.elements["vy"].value)
    item["color"] = form.elements["color"].value
    item["size"] = Number(form.elements["size"].value)

    items.push(item)
}

function intersecting(item1, item2) {
    return Math.sqrt((item2.y - item1.y) ** 2 + (item2.x - item1.x) ** 2) <= item1.size + item2.size
}