"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function spaceinvaders() {
    // Inside this function you will use the classes and functions 
    // from rx.js
    // to add visuals to the svg element in pong.html, animate them, and make them interactive.
    // Study and complete the tasks in observable exampels first to get ideas.
    // Course Notes showing Asteroids in FRP: https://tgdwyer.github.io/asteroids/ 
    // You will be marked on your functional programming style
    // as well as the functionality that you implement.
    // Document your code!  
    const svg = document.getElementById("canvas");
    const amryTank = document.createElementNS(svg.namespaceURI, 'polygon');
    Object.entries({
        points: [[280, 535], [280, 540], [275, 540], [275, 550], [265, 550], [265, 555], [260, 555], [260, 575], [310, 575], [310, 555], [305, 555], [305, 550], [295, 550], [295, 540], [290, 540], [290, 535]],
        fill: '#7fff00',
        stroke: 'black'
    }).forEach(([key, val]) => amryTank.setAttribute(key, String(val)));
    svg.appendChild(amryTank);
    const keyDown = rxjs_1.fromEvent(document, "keydown");
    function createInvaders(typeInvaders) {
        const invader = document.createElementNS(svg.namespaceURI, 'image');
        Object.entries({
            id: typeInvaders.id,
            x: typeInvaders.x,
            y: typeInvaders.y,
            width: typeInvaders.width, height: typeInvaders.height,
            href: typeInvaders.imageName,
            visibility: 'visible'
        }).forEach(([key, val]) => invader.setAttribute(key, String(val)));
        svg.appendChild(invader);
        console.log(invader);
    }
    function moveInvadersToRight(invaders) {
        const invader = document.getElementById(invaders);
        const unsubscribe = rxjs_1.interval(10).subscribe(() => invader.setAttribute('x', String(1 + Number(invader.getAttribute('x')))));
        rxjs_1.timer(1000).subscribe(() => unsubscribe.unsubscribe());
    }
    function moveInvadersToLeft(invaders) {
        const invader = document.getElementById(invaders);
        const unsubscribe = rxjs_1.interval(10).subscribe(() => invader.setAttribute('x', String(Number(invader.getAttribute('x')) - 1)));
        rxjs_1.timer(1000).subscribe(() => unsubscribe.unsubscribe());
    }
    const firstRowInvaders = rxjs_1.range(10).pipe(operators_1.map(i => ({ x: (i + 1) * 50, y: 60, width: 30, height: 30, imageName: 'image/a1.png', id: "first row invaders " + String(i) }))).subscribe(typeInvaders => { createInvaders(typeInvaders); });
    const firstRowInvaderMoveRight = rxjs_1.range(19).pipe(operators_1.map(i => i < 10 ? moveInvadersToRight("first row invaders " + String(i)) :
        moveInvadersToLeft("first row invaders " + String(i - 10)))).subscribe();
    const secondRowInvaders = rxjs_1.range(10).pipe(operators_1.map(i => ({ x: (i + 1) * 50, y: 90, width: 30, height: 30, imageName: 'image/a2.png', id: "second row invaders " + String(i) }))).subscribe(typeInvaders => { createInvaders(typeInvaders); });
    const secondRowInvaderMove = rxjs_1.range(10).pipe(operators_1.map(i => "second row invaders " + String(i))).subscribe(invaders => moveInvadersToRight(invaders));
    keyDown.pipe(operators_1.filter((e) => e.key == 'w' || e.key == "ArrowUp")).subscribe(() => amryTank.setAttribute('points', String(amryTank.getAttribute('points').split(',').map(e => Number(e)).map((x, i) => i % 2 == 1 ? x -= 10 : x))));
    keyDown.pipe(operators_1.filter((e) => e.key == 's' || e.key == "ArrowUp")).subscribe(() => amryTank.setAttribute('points', String(amryTank.getAttribute('points').split(',').map(e => Number(e)).map((x, i) => i % 2 == 1 ? x += 10 : x))));
    keyDown.pipe(operators_1.filter((e) => e.key == 'a' || e.key == "ArrowUp")).subscribe(() => amryTank.setAttribute('points', String(amryTank.getAttribute('points').split(',').map(e => Number(e)).map((x, i) => i % 2 == 0 ? x -= 10 : x))));
    keyDown.pipe(operators_1.filter((e) => e.key == 'd' || e.key == "ArrowUp")).subscribe(() => amryTank.setAttribute('points', String(amryTank.getAttribute('points').split(',').map(e => Number(e)).map((x, i) => i % 2 == 0 ? x += 10 : x))));
    const rect = document.getElementById("trung");
    console.log;
}
// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
    window.onload = () => {
        spaceinvaders();
    };
//# sourceMappingURL=spaceinvaders.js.map