const canvas = document.getElementById('mondrianCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

function drawRandomLines() {
    let numberOfLines = Math.floor((Math.random() * 5) + 5);
    let lines = []; // Array to store line information

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
        
     // Store line information
        lines.push({
            x: position,
            y: position,
            orientation: lineOrientation,
            thickness: lineThickness
        });
    }
    
    return lines;
}

function isShapeValid(newShape, existingShapes, lines) {
    // Check overlap with existing shapes
    for (let shape of existingShapes) {
        if (!(newShape.x + newShape.width <= shape.x ||
              shape.x + shape.width <= newShape.x ||
              newShape.y + newShape.height <= shape.y ||
              shape.y + shape.height <= newShape.y)) {
            return false; // Overlap detected
        }
    // Check overlap with lines
    for (let line of lines) {
        if (line.orientation === 'vertical') {
            if (newShape.x < line.x && newShape.x + newShape.width > line.x - line.thickness) {
                return false; // Overlap with vertical line
            }
        } else { // Horizontal line
            if (newShape.y < line.y && newShape.y + newShape.height > line.y - line.thickness) {
                return false; // Overlap with horizontal line
                }
            }
        }
    return true; // No overlap
    }
}

function generateShapes(maxWidth, maxHeight, minShapes, maxShapes, lines) {
    const shapes = [];
    const maxAttempts = 200;
    let attempts = 0;
    const targetShapeCount = Math.floor(Math.random() * (maxShapes - minShapes + 1)) + minShapes;
    
    while (shapes.length < targetShapeCount && attempts < maxAttempts) {
        attempts++;
        let width = Math.floor(Math.random() * 2 + 1) * (maxWidth / 64);
        let height = Math.floor(Math.random() * 2 + 1) * (maxHeight / 64);

        let x = Math.floor(Math.random() * 8) * (maxWidth / 64);
        let y = Math.floor(Math.random() * 8) * (maxHeight / 64);

        let newShape = { x, y, width, height };
        if (isShapeValid(newShape, shapes, lines)) { // Pass lines to isShapeValid
        shapes.push(newShape);
        } 
    }
     console.log(`Attempt ${attempts}: Shape - x: ${x}, y: ${y}, width: ${width}, height: ${height}`);
        if (isShapeValid(newShape, shapes, lines)) {
            shapes.push(newShape);
            console.log('Shape added successfully');
        } else {
            console.log('Shape failed validation');
        }
    }

    console.log(`Total shapes generated: ${shapes.length}`);
    return shapes;
}

function colorShapes(ctx, shapes) {
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const lines = drawRandomLines(); // Capture line information
    const shapes = generateShapes(canvas.width, canvas.height, 4, 8, lines); // Pass lines to generateShapes
    colorShapes(ctx, shapes);
    placeButtons(shapes);
}


window.onload = init;
