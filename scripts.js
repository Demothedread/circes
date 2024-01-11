const canvas = document.getElementById('mondrianCanvas');
const ctx = canvas.getContext('2d');

#function drawRandomLines() {
    // Logic to draw random lines on the canvas
    
}

#function generateShapes() {
    // Logic to generate random shapes without overlapping
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
    }

    return shapes;
}

function isShapeValid(newShape, existingShapes) {
    // Check for overlap with existing shapes
    for (let shape of existingShapes) {
        if (!(newShape.x + newShape.width <= shape.x ||
              shape.x + shape.width <= newShape.x ||
              newShape.y + newShape.height <= shape.y ||
              shape.y + shape.height <= newShape.y)) {
            return false; // Overlap detected
        }
    }
    return true; // No overlap
}

}

#function colorShapes() {
    // Logic to fill shapes with random colors
.m, m bbfunction colorShapes(ctx, shapes) {
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

}

#function placeButtons() {
    // Logic to dynamically place buttons on the canvas
}

#function init() {
    drawRandomLines();
    generateShapes();
    colorShapes();
    placeButtons();
}

init();
