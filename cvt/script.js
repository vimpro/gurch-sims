const canvas = document.getElementById('diagram');
const ctx = canvas.getContext('2d');

let lastTime = 0;

const centerX = 400
const centerY = 400

function drawPulley(vertical_offset, horizontal_separation, pulley_angle, rpm_label) {
    //draw left pulley
    ctx.strokeStyle = "black"
    ctx.beginPath()
    ctx.moveTo(centerX - horizontal_separation/2, centerY + vertical_offset)
    ctx.lineTo(centerX - horizontal_separation/2 - 50, centerY - 50 + vertical_offset)
    ctx.lineTo(centerX - horizontal_separation/2 - 50, centerY + 50 + vertical_offset)
    ctx.lineTo(centerX - horizontal_separation/2, centerY + vertical_offset)
    ctx.stroke()

    ctx.font = 'bold 30px Tahoma Red'
    ctx.fillStyle = "red"
    ctx.fillText(`RPM: ${Math.round(rpm_label*1000)/1000}`, centerX + 100, centerY + vertical_offset);

    //draw right pulley
    ctx.beginPath()
    ctx.moveTo(centerX + horizontal_separation/2, centerY + vertical_offset)
    ctx.lineTo(centerX + horizontal_separation/2 + 50, centerY - 50 + vertical_offset)
    ctx.lineTo(centerX + horizontal_separation/2 + 50, centerY + 50 + vertical_offset)
    ctx.lineTo(centerX + horizontal_separation/2, centerY + vertical_offset)
    ctx.stroke()/ ctx.stroke()
}


function computePulleyWidth(beltLength, vertical_separation, pulley_theta, beltWidth, x) {
    return -2 * (beltLength - 2 * vertical_separation) / (Math.PI * Math.tan(pulley_theta)) + 2 * beltWidth - x
}

function computeBeltHeight(pulley_angle, belt_width, p_width) {
    return Math.tan(pulley_angle)*(belt_width/2 - p_width/2)
}

function drawRpmCircle(vertical_offset, angle) {
    const radius = 20

    ctx.beginPath()
    ctx.arc(centerX - 100, centerY + vertical_offset, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX - 100, centerY + vertical_offset);
    ctx.lineTo(centerX - 100 + radius * Math.cos(angle), centerY + vertical_offset + radius * Math.sin(angle));
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function drawBelt(width, vertical_separation, p1_width, p2_width, pulley_theta) {
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    ctx.fillRect(centerX - width/2,
                centerY - vertical_separation / 2 - computeBeltHeight(pulley_theta, width, p1_width),
                width,
                vertical_separation + computeBeltHeight(pulley_theta, width, p1_width) + computeBeltHeight(pulley_theta, width, p2_width)
            )
}

let prev_angle_1 = 0
let prev_angle_2 = 0
function animate(timestamp) {
    const deltaT = (timestamp - lastTime) / 1000;
    startTime += deltaT
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const beltWidth = 50
    const beltLength = 500
    const vertical_separation = 200
    let pulley_theta = Math.PI / 4 //45 deg, for now

    let p1_width = Number(document.getElementById("p1_width_select").value)
    document.getElementById("p1_width").innerText = p1_width
    document.getElementById("p1_width_select").max = computePulleyWidth(beltLength, vertical_separation, pulley_theta, beltWidth, 0)

    let p2_width = computePulleyWidth(beltLength, vertical_separation, pulley_theta, beltWidth, p1_width)
    document.getElementById("p2_width").innerText = p2_width

    let gear_ratio = computeBeltHeight(pulley_theta, beltWidth, p1_width) / computeBeltHeight(pulley_theta, beltWidth, p2_width) 
    let rpm = 100;
    let rpm_prime = 100 * gear_ratio

    document.getElementById("ratio").innerText = `1:${gear_ratio}`



    drawPulley(-vertical_separation/2, p1_width, pulley_theta, rpm)
    drawPulley(vertical_separation/2, p2_width, pulley_theta, rpm_prime)

    drawBelt(beltWidth, vertical_separation, p1_width, p2_width, pulley_theta)
    
    prev_angle_1 += (rpm/60) * deltaT * 2 * Math.PI
    prev_angle_2 += (rpm_prime/60) * deltaT * 2 * Math.PI
    drawRpmCircle(-vertical_separation/2, prev_angle_1)
    drawRpmCircle(vertical_separation/2, prev_angle_2)
 
    requestAnimationFrame(animate);
}


let startTime = 0;
requestAnimationFrame(animate);