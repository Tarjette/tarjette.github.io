var c = document.getElementById("header-animated-canva");
var ctx = c.getContext("2d");
var cH;
var cW;
var animations = [];
var circles = [];
const colors = ["#282741", "#7E5B8F", "#2980B9", "#78290F"].sort((a,b)=>0.5 - Math.random());

var initialColor = colors[0];

var colorPicker = (function () {
    
    var index = 0;

    function next() {
        index = index++ < colors.length - 1 ? index : 0;
        return colors[index];
    }

    function current() {
        return colors[index]
    }
    return {
        next: next,
        current: current
    }
})();

function removeAnimation(animation) {
    var index = animations.indexOf(animation);
    if (index > -1) animations.splice(index, 1);
}

function calcPageFillRadius(x, y) {
    var l = Math.max(x - 0, cW - x);
    var h = Math.max(y - 0, cH - y);
    return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}

function addClickListeners() {
    c.addEventListener("touchstart", handleEvent);
    c.addEventListener("mousedown", handleEvent);
    document.querySelector("header").addEventListener("touchstart", handleEvent);
    document.querySelector("header").addEventListener("mousedown", handleEvent);
};

function handleEvent(e) {
    console.log(e);
    if (e.touches) {
        // e.preventDefault();
        e = e.touches[0];
    }

    var currentColor = colorPicker.current();
    var nextColor = colorPicker.next();
    var targetR = calcPageFillRadius(e.pageX, e.pageY);
    var rippleSize = Math.min(200, (cW * .4));
    var minCoverDuration = 750;

    var pageFill = new Circle({
        x: e.pageX,
        y: e.pageY,
        r: 0,
        fill: nextColor
    });
    var fillAnimation = anime({
        targets: pageFill,
        r: targetR,
        duration: Math.max(targetR / 2, minCoverDuration),
        easing: "easeOutQuart",
        complete: function () {
            initialColor = pageFill.fill;
            removeAnimation(fillAnimation);
        }
    });

    var particles = [];
    for (var i = 0; i < 32; i++) {
        var particle = new Circle({
            x: e.pageX,
            y: e.pageY,
            fill: currentColor,
            r: anime.random(24, 48)
        })
        particles.push(particle);
    }
    var particlesAnimation = anime({
        targets: particles,
        x: function (particle) {
            return particle.x + anime.random(rippleSize, -rippleSize);
        },
        y: function (particle) {
            return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
        },
        r: 0,
        easing: "easeOutExpo",
        duration: anime.random(1000, 1300),
        complete: removeAnimation
    });
    animations.push(fillAnimation, particlesAnimation);
}

function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

var Circle = function (opts) {
    extend(this, opts);
}

Circle.prototype.draw = function () {
    ctx.globalAlpha = this.opacity || 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    if (this.stroke) {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.width;
        ctx.stroke();
    }
    if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fill();
    }
    ctx.closePath();
    ctx.globalAlpha = 1;
}

var animate = anime({
    duration: Infinity,
    update: function () {
        ctx.fillStyle = initialColor;
        ctx.fillRect(0, 0, cW, cH);
        animations.forEach(function (anim) {
            anim.animatables.forEach(function (animatable) {
                animatable.target.draw();
            });
        });
    }
});

var resizeCanvas = function () {
    cW = window.innerWidth;
    console.log(window.innerHeight);
    cH = window.innerHeight;
    c.width = cW * devicePixelRatio;
    c.height = cH * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
};

(function init() {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    addClickListeners();

    c.addEventListener('touchend', event => {
        if (event.cancelable) event.preventDefault();
    });
    document.querySelector('header').addEventListener('touchend', event => {
        if (event.cancelable) event.preventDefault();
    });
})();
