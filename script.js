const canvas = document.getElementById('mondrianCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

function drawRandomLines() {
    let numberOfLines = Math.floor(Math.random() * 6) + 5; // Random number between 5 and 10

    for (let i = 0; i < numberOfLines; i++) {
        let lineOrientation = Math.random() < 0.5 ? 'vertical' : 'horizontal';
        let lineThickness = Math.floor(Math.random() * (8 - 1) + 1) * 2; // 2-16 at intervals of 2
        let position = Math.random() * (lineOrientation === 'vertical' ? canvas.width : canvas.height);

        ctx.lineWidth = lineThickness;
        ctx.beginPath();
        if (lineOrientation === 'vertical') {
            ctx.moveTo(position, 0);
            ctx.lineTo(position, canvas.height);
        } else {
            ctx.moveTo(0, position);
            ctx.lineTo(canvas.width, position);
        }
        ctx.stroke();
    }
}

function generateShapes(ctx, maxWidth, maxHeight) {
    const shapes = [];
    const maxAttempts = 100; // Limit attempts to avoid infinite loops
    let attempts = 0;

    while (shapes.length < 8 && attempts < maxAttempts) {
        attempts++;
        let width = Math.floor(Math.random() * 4 + 1) * (maxWidth / 8); // Width in multiples of 1/8th of canvas width
        let height = Math.floor(Math.random() * 4 + 1) * (maxHeight / 8); // Height in multiples of 1/8th of canvas height
        let x = Math.floor(Math.random() * 8) * (maxWidth / 8);
        let y = Math.floor(Math.random() * 8) * (maxHeight / 8);

        let newShape = { x, y, width, height };

        if (isShapeValid(newShape, shapes)) {
            shapes.push(newShape);
}

function isShapeValid(newShape, existingShapes) {
    for (let shape of existingShapes) {
        if (!(newShape.x + newShape.width <= shape.x ||
              shape.x + shape.width <= newShape.x ||
              newShape.y + newShape.height <= shape.y ||
              shape.y + shape.height <= newShape.y)) {
            return false; // Overlap detected
        }
      }
    }
  }
}

function colorShapes(shapes) {
    const colors = ['#FFD700', '#0055BF', '#CE2029', '#228B22']; // Yellow, Blue, Red, Forest Green
    const probabilities = [0.3, 0.3, 0.3, 0.1]; // Probabilities for each color

    shapes.forEach(shape => {
        let colorIndex = selectColorIndex(probabilities);
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    });
}

function selectColorIndex(probabilities) {
        let r = Math.random();
    let cumulativeProbability = 0;
    for (let i = 0; i < probabilities.length; i++) {
        cumulativeProbability += probabilities[i];
        if (r <= cumulativeProbability) {
            return i;
        }
    }
    return probabilities.length - 1; // Default to last color if none selected
}

function placeButtons(shapes) {
    const buttons = ['galleryButton', 'resumeButton', 'publicationsButton', 'aboutButton'];
    let placedButtons = 0;

    shapes.forEach(shape => {
        if (placedButtons < buttons.length) {
            let button = document.getElementById(buttons[placedButtons]);
            button.style.position = 'absolute';
            button.style.left = `${shape.x + (shape.width / 2)}px`;
            button.style.top = `${shape.y + (shape.height / 2)}px`;
            placedButtons++;
        }
    });
}

function init() {
    const canvas = document.getElementById('mondrianCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for redraw

    drawRandomLines(ctx, canvas.width, canvas.height);
    const shapes = generateShapes(ctx, canvas.width, canvas.height);
    colorShapes(ctx, shapes);
    placeButtons(shapes);
}

window.onload = init; 

