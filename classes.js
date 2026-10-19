// =============================================================
// Bilder (Sprites)
// =============================================================

function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

const bauerPicture = loadImage("assets/Bauer.png");
const goblinPicture = loadImage("assets/Goblin.png");
const castlePicture = loadImage("assets/Castle.png");
const treePicture = loadImage("assets/tree.png");
const towerPicture = loadImage("assets/tower.png");


// =============================================================
// Hilfsfunktionen, die mehrere Klassen gemeinsam benutzen
// =============================================================

// Abstand zwischen zwei Punkten (Satz des Pythagoras)
function distanceBetween(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// Bewegt ein Objekt mit x, y, target und speed ein Stück Richtung Ziel
function moveTowardsTarget(entity) {
    const dx = entity.target.x - entity.x;
    const dy = entity.target.y - entity.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= entity.speed) {
        // Fast da: direkt aufs Ziel setzen, damit es nicht hin und her zittert
        entity.x = entity.target.x;
        entity.y = entity.target.y;
    } else {
        entity.x += dx / distance * entity.speed;
        entity.y += dy / distance * entity.speed;
    }
}

function hasReachedTarget(entity) {
    return entity.x === entity.target.x && entity.y === entity.target.y;
}

// Zeichnet ein Sprite mittig auf x, y
function drawSprite(ctx, sprite, x, y, size) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
}

// Roter Hintergrund, grüner Anteil = aktuelle Lebenspunkte
function drawHealthBar(ctx, entity, offsetY, height) {
    const left = entity.x - entity.size / 2;
    const top = entity.y - entity.size / 2 - offsetY;
    const healthPart = Math.max(0, entity.healthcurr) / entity.healthMax;

    ctx.fillStyle = "red";
    ctx.fillRect(left, top, entity.size, height);
    ctx.fillStyle = "green";
    ctx.fillRect(left, top, healthPart * entity.size, height);
}

// Kreis unter einer Einheit, z. B. für "ausgewählt"
function drawSelectionRing(ctx, entity, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(entity.x, entity.y + entity.size / 2, entity.size / 4, entity.size / 4, 0, 0, Math.PI * 2);
    ctx.stroke();
}


// =============================================================
// Bauer: sammelt Holz und bringt es zur Burg
// =============================================================

export class Bauer {

    static sprite = bauerPicture;

    constructor(x, y, color = "blue", home) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 24;
        this.chosen = false;
        this.target = { x: this.x, y: this.y };
        this.speed = 1.5;
        this.task = null;
        this.status = "wait";
        this.workTimer = null;
        this.workDuration = 3000;   // Millisekunden am Baum
        this.home = home;
    }

    draw(ctx) {
        if (this.chosen) {
            drawSelectionRing(ctx, this, "yellow");
        }

        drawSprite(ctx, Bauer.sprite, this.x, this.y, this.size);

        ctx.fillStyle = "white";
        ctx.font = "10px MedievalSharp";
        ctx.textAlign = "center";
        ctx.fillText(this.status, this.x, this.y - this.size);
    }

    setTarget(x, y) {
        this.target.x = x;
        this.target.y = y;
    }

    // Zustandsmaschine: wait -> move to task -> working task -> hauling -> move to task ...
    update(resources) {
        switch (this.status) {

            case "wait":
                if (this.task != null) {
                    this.status = "move to task";
                }
                break;

            case "move to task":
                this.setTarget(this.task.x, this.task.y);
                if (hasReachedTarget(this)) {
                    this.status = "working task";
                    this.workTimer = performance.now();
                }
                break;

            case "working task":
                if (performance.now() - this.workTimer >= this.workDuration) {
                    this.status = "hauling";
                }
                break;

            case "hauling":
                this.setTarget(this.home.x, this.home.y);
                if (hasReachedTarget(this)) {
                    resources.wood += 5;
                    this.status = "move to task";
                }
                break;

            case "move free":
                if (hasReachedTarget(this)) {
                    this.status = "wait";
                }
                break;
        }
    }

    move() {
        moveTowardsTarget(this);
    }

    assignTask(task) {
        this.clearTask();
        this.task = task;
        this.task.user = this;
        this.status = "move to task";
    }

    clearTask() {
        if (this.task != null) {
            this.task.user = null;
            this.task = null;
        }
    }

    moveWithoutTask(x, y) {
        this.clearTask();
        this.status = "move free";
        this.setTarget(x, y);
    }

    isHit(x, y) {
        return distanceBetween(x, y, this.x, this.y) <= this.size;
    }
}


// =============================================================
// Baum: Ressource, an der der Bauer Holz sammelt
// =============================================================

export class Tree {

    static sprite = treePicture;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 32;
        this.chosen = false;
        this.user = null;   // der Bauer, der hier gerade arbeitet
    }

    draw(ctx) {
        if (this.chosen) {
            drawSelectionRing(ctx, this, "black");
        }
        if (this.user) {
            drawSelectionRing(ctx, this, this.user.color);
        }

        drawSprite(ctx, Tree.sprite, this.x, this.y, this.size);
    }

    isHit(x, y) {
        return distanceBetween(x, y, this.x, this.y) <= this.size / 2;
    }
}


// =============================================================
// Burg: muss verteidigt werden, bei 0 Leben ist Game Over
// =============================================================

export class Castle {

    static cost = { wood: 100 };
    static sprite = castlePicture;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 48;
        this.chosen = false;
        this.healthMax = 10;
        this.healthcurr = this.healthMax;
    }

    draw(ctx) {
        drawSprite(ctx, Castle.sprite, this.x, this.y, this.size);
        drawHealthBar(ctx, this, 10, this.size / 10);
    }

    // Die Burg macht (noch) nichts von selbst. Die Methode gibt es,
    // damit der Game Loop update() für alle Gebäude aufrufen kann.
    update() {
    }
}


// =============================================================
// Goblin: läuft zur Burg und macht dort Schaden
// =============================================================

export class Goblin {

    static sprite = goblinPicture;

    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.size = 32;
        this.target = { x: target.x, y: target.y };
        this.speed = 0.5;
        this.healthMax = 5;
        this.healthcurr = this.healthMax;
        this.dead = false;
    }

    draw(ctx) {
        drawSprite(ctx, Goblin.sprite, this.x, this.y, this.size);
        drawHealthBar(ctx, this, 6, 4);
    }

    move() {
        moveTowardsTarget(this);
    }

    update(castle) {
        if (hasReachedTarget(this)) {
            castle.healthcurr -= 1;
            this.dead = true;
        }
        if (this.healthcurr <= 0) {
            this.dead = true;
        }
    }
}


// =============================================================
// Turm: sucht das nächste Monster in Reichweite und schießt
// =============================================================

export class Tower {

    static cost = { wood: 1 };
    static sprite = towerPicture;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 48;
        this.chosen = false;
        this.healthMax = 10;
        this.healthcurr = this.healthMax;
        this.range = 150;
        this.target = null;
        this.damage = 1;
        this.attackSpeed = 1;       // Schüsse pro Sekunde
        this.timeLastAttack = 0;    // 0 = der erste Schuss kommt sofort
    }

    draw(ctx) {
        if (this.target != null) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.target.x, this.target.y);
            ctx.stroke();
        }

        drawSprite(ctx, Tower.sprite, this.x, this.y, this.size);
    }

    update(monsters) {
        this.target = this.findNearestMonster(monsters);
        this.tryShoot();
    }

    // Gibt das nächste Monster in Reichweite zurück, oder null
    findNearestMonster(monsters) {
        let nearestMonster = null;
        let nearestDistance = Infinity;

        for (const monster of monsters) {
            const distance = distanceBetween(this.x, this.y, monster.x, monster.y);

            if (distance <= this.range && distance <= nearestDistance) {
                nearestMonster = monster;
                nearestDistance = distance;
            }
        }
        return nearestMonster;
    }

    tryShoot() {
        const cooldown = 1000 / this.attackSpeed;
        const timeSinceAttack = performance.now() - this.timeLastAttack;

        if (this.target != null && timeSinceAttack >= cooldown) {
            this.target.healthcurr -= this.damage;
            this.timeLastAttack = performance.now();
        }
    }
}


// =============================================================
// Button in der Sidebar: wählt aus, welches Gebäude gebaut wird
// =============================================================

export class UIbutton {

    constructor(x, y, building) {
        this.x = x;
        this.y = y;
        this.size = 64;
        this.chosen = false;
        this.building = building;   // die Klasse, die gebaut wird (z. B. Tower)
    }

    draw(ctx) {
        const left = this.x - this.size / 2;
        const top = this.y - this.size / 2;

        ctx.fillStyle = "black";
        ctx.fillRect(left, top, this.size, this.size);

        drawSprite(ctx, this.building.sprite, this.x, this.y, this.size);

        if (this.chosen) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 3;
            ctx.strokeRect(left, top, this.size, this.size);
        }
    }

    // Rechteck-Test: liegt der Punkt zwischen linkem/rechtem und oberem/unterem Rand?
    isHit(x, y) {
        const half = this.size / 2;
        return x >= this.x - half && x <= this.x + half
            && y >= this.y - half && y <= this.y + half;
    }
}
