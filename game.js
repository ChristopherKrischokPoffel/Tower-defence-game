import { Bauer, Tree, Castle, Goblin, Tower, UIbutton } from "./classes.js";

// =============================================================
// Canvas und Einstellungen
// =============================================================

const gameArea = document.getElementById("background");
const ctx = gameArea.getContext("2d");

const sidebar = document.getElementById("sidebar");
const sidectx = sidebar.getContext("2d");

const centerX = gameArea.width / 2;
const centerY = gameArea.height / 2;

const spawnInterval = 30 * 1000;   // alle 30 Sekunden ein Goblin
const treeAmount = 20;
const treeMargin = 40;             // Abstand der Bäume zum Kartenrand


// =============================================================
// Spielzustand (wird in resetGame() neu aufgebaut)
// =============================================================

let gamestate = "running";
let lastSpawnTime;
let resources;

let castle;
let bauer;

let playerBuildings = [];
let playerUnits = [];
let resourceUnits = [];
let monsters = [];
let uiElements = [];


// =============================================================
// Game Loop
// =============================================================

function gameLoop() {
    switch (gamestate) {
        case "running":
            updateAndDraw();
            if (castle.healthcurr <= 0) {
                gamestate = "gameover";
            }
            break;

        case "gameover":
            drawGameOver();
            break;
    }

    requestAnimationFrame(gameLoop);
}

function updateAndDraw() {
    sidectx.clearRect(0, 0, sidebar.width, sidebar.height);
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);

    for (const resource of resourceUnits) {
        resource.draw(ctx);
    }

    for (const monster of monsters) {
        monster.update(castle);
        monster.move();
        monster.draw(ctx);
    }
    monsters = monsters.filter(monster => !monster.dead);
    spawnOnTimer();

    for (const building of playerBuildings) {
        building.update(monsters);
        building.draw(ctx);
    }

    for (const unit of playerUnits) {
        unit.update(resources);
        unit.move();
        unit.draw(ctx);
    }

    drawSidebar();
}

function drawSidebar() {
    for (const element of uiElements) {
        element.draw(sidectx);
    }

    sidectx.fillStyle = "white";
    sidectx.font = "24px MedievalSharp";
    sidectx.textAlign = "center";
    sidectx.fillText("wood: " + resources.wood, sidebar.width / 2, 140);
}

// Text mit dunklem Schatten dahinter
function drawShadowText(text, x, y, size) {
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.font = (size + 2) + "px MedievalSharp";
    ctx.fillText(text, x, y);
    ctx.fillStyle = "darkred";
    ctx.font = size + "px MedievalSharp";
    ctx.fillText(text, x, y);
}

function drawGameOver() {
    drawShadowText("GAME OVER", centerX, centerY / 2, 64);
    drawShadowText("try again? press space...", centerX, centerY, 48);
}


// =============================================================
// Eingaben
// =============================================================

// Rechnet Bildschirm-Koordinaten in Canvas-Koordinaten um.
// clientLeft/clientTop = Dicke der Border, clientWidth/clientHeight = Größe ohne Border.
function mouseLocation(x, y, canvas) {
    const rect = canvas.getBoundingClientRect();
    const factorWidth = canvas.width / canvas.clientWidth;
    const factorHeight = canvas.height / canvas.clientHeight;

    return {
        X: (x - rect.left - canvas.clientLeft) * factorWidth,
        Y: (y - rect.top - canvas.clientTop) * factorHeight,
    };
}

// Linksklick aufs Spielfeld: auswählen oder bauen
gameArea.addEventListener("click", function (event) {
    const mouse = mouseLocation(event.clientX, event.clientY, gameArea);

    for (const unit of playerUnits) {
        unit.chosen = unit.isHit(mouse.X, mouse.Y);
    }

    for (const resource of resourceUnits) {
        resource.chosen = resource.isHit(mouse.X, mouse.Y);
    }

    for (const element of uiElements) {
        if (element.chosen) {
            tryBuild(element, mouse.X, mouse.Y);
        }
    }
});

// Rechtsklick aufs Spielfeld: ausgewählte Bauern zum Baum oder zur Stelle schicken
gameArea.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    const mouse = mouseLocation(event.clientX, event.clientY, gameArea);

    let resourceHit = null;
    for (const resource of resourceUnits) {
        if (resource.isHit(mouse.X, mouse.Y)) {
            resourceHit = resource;
        }
    }

    for (const unit of playerUnits) {
        if (!unit.chosen) {
            continue;
        }
        if (resourceHit != null) {
            unit.assignTask(resourceHit);
        } else {
            unit.moveWithoutTask(mouse.X, mouse.Y);
        }
    }
});

// Klick auf die Sidebar: Bau-Button auswählen
sidebar.addEventListener("click", function (event) {
    const mouse = mouseLocation(event.clientX, event.clientY, sidebar);

    for (const element of uiElements) {
        element.chosen = element.isHit(mouse.X, mouse.Y);
    }
});

window.addEventListener("keydown", function (event) {
    if (gamestate === "gameover" && event.code === "Space") {
        event.preventDefault();
        resetGame();
        gamestate = "running";
    }
});


// =============================================================
// Bauen
// =============================================================

function canAfford(cost) {
    for (const material in cost) {
        if (cost[material] > resources[material]) {
            return false;
        }
    }
    return true;
}

function pay(cost) {
    for (const material in cost) {
        resources[material] -= cost[material];
    }
}

function tryBuild(button, x, y) {
    const building = button.building;

    if (canAfford(building.cost)) {
        pay(building.cost);
        playerBuildings.push(new building(x, y));
    } else {
        button.chosen = false;
    }
}


// =============================================================
// Spawnen
// =============================================================

function randomEdgePosition() {
    switch (Math.floor(Math.random() * 4)) {
        case 0: return { X: 0, Y: Math.random() * gameArea.height };              // links
        case 1: return { X: Math.random() * gameArea.width, Y: 0 };               // oben
        case 2: return { X: gameArea.width, Y: Math.random() * gameArea.height }; // rechts
        case 3: return { X: Math.random() * gameArea.width, Y: gameArea.height }; // unten
    }
}

function spawnOnTimer() {
    if (performance.now() - lastSpawnTime >= spawnInterval) {
        const position = randomEdgePosition();
        monsters.push(new Goblin(position.X, position.Y, castle));
        lastSpawnTime = performance.now();
    }
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function spawnTrees() {
    for (let i = 0; i < treeAmount; i++) {
        const x = randomBetween(treeMargin, gameArea.width - treeMargin);
        const y = randomBetween(treeMargin, gameArea.height - treeMargin);
        resourceUnits.push(new Tree(x, y));
    }
}


// =============================================================
// Start / Neustart
// =============================================================

function resetGame() {
    lastSpawnTime = performance.now();
    resources = { wood: 0 };

    castle = new Castle(centerX, centerY);
    playerBuildings = [castle];

    bauer = new Bauer(castle.x, castle.y + castle.size, "blue", castle);
    playerUnits = [bauer];

    resourceUnits = [];
    spawnTrees();

    monsters = [];

    uiElements = [
        new UIbutton(sidebar.width / 2, 60, Tower),
    ];
}

resetGame();
gameLoop();
