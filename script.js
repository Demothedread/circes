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
        } 
        else {
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
    console.log("Lines generated:", lines); // Log generated lines
    return lines;
}

function generateLines(ctx) {
    const numLines = Math.floor(Math.random() * 10) + 5; // Random number of lines between 5 and 15
    for (let i = 0; i < numLines; i++) {
        let xOrY = Math.random() > 0.5 ? 'x' : 'y';
        let linePosition = Math.floor(Math.random() * canvas.width); // Adjust depending on orientation
        let thickness = 2 * (Math.floor(Math.random() * 8) + 1); // Ensures a line thickness of 2, 4,..., or 16

        ctx.fillStyle = 'black';
        if (xOrY === 'x') {
            ctx.fillRect(linePosition, 0, thickness, canvas.height); // Vertical line
        } else {
            ctx.fillRect(0, linePosition, canvas.width, thickness); // Horizontal line
        }
    }
}
function generateLines(ctx) {
    const numLines = Math.floor(Math.random() * 10) + 5; // Random number of lines between 5 and 15
    for (let i = 0; i < numLines; i++) {
        let xOrY = Math.random() > 0.5 ? 'x' : 'y';
        let linePosition = Math.floor(Math.random() * canvas.width); // Adjust depending on orientation
        let thickness = 2 * (Math.floor(Math.random() * 8) + 1); // Ensures a line thickness of 2, 4,..., or 16

        ctx.fillStyle = 'black';
        if (xOrY === 'x') {
            ctx.fillRect(linePosition, 0, thickness, canvas.height); // Vertical line
        } else {
            ctx.fillRect(0, linePosition, canvas.width, thickness); // Horizontal line
        }
    }
}

function generateShapes(maxWidth, maxHeight, minShapes, maxShapes, lines) {
    const shapes = [];
    const maxAttempts = 100;
    let attempts = 0;
    const targetShapeCount = Math.floor(Math.random() * (maxShapes - minShapes + 1)) + minShapes;
    minShapes = Math.max(minShapes, 5); // Ens minShapes = Math.max(minShapes, 5); // Ens
    
    while (shapes.length < targetShapeCount && attempts < maxAttempts) {
        attempts++;
        let newShape;

        if (Math.random() < 0.5) { // Half the time, generate shape between lines
            newShape = generateQuadrangleBetweenLines(lines, maxWidth, maxHeight);
        } else { // Other half, generate random size shape
            newShape = generateRandomSizeShape(maxWidth, maxHeight);
        }

        if (isShapeValid(newShape, shapes, lines)) {
            shapes.push(newShape);
            console.log("how many shapes:", shapes.length);
        }
    }
    return shapes;
}


function generateQuadrangleBetweenLines(lines, maxWidth, maxHeight) {
    // Separate vertical and horizontal lines
    let verticalLines = lines.filter(line => line.orientation === 'vertical').sort((a, b) => a.x - b.x);
    let horizontalLines = lines.filter(line => line.orientation === 'horizontal').sort((a, b) => a.y - b.y);

    // Add boundary lines for the canvas edges
    verticalLines.push({ x: 0, thickness: 0 }, { x: maxWidth, thickness: 0 });
    horizontalLines.push({ y: 0, thickness: 0 }, { y: maxHeight, thickness: 0 });

    // Randomly select gaps between lines
    let vertGap = selectRandomGap(verticalLines, maxWidth);
    let horizGap = selectRandomGap(horizontalLines, maxHeight);

    // Define the quadrangle shape
    return {
        x: vertGap.start + vertGap.thickness,
        y: horizGap.start + horizGap.thickness,
        width: vertGap.end - (vertGap.start + vertGap.thickness),
        height: horizGap.end - (horizGap.start + horizGap.thickness)
    };
}

function selectRandomGap(lines, maxDimension) {
        let gapIndex = Math.floor(Math.random() * (lines.length - 1));
        let startLine = lines[gapIndex];
        let endLine = lines[gapIndex + 1];

        return {
            start: startLine.x || startLine.y,
            end: endLine.x || endLine.y,
            thickness: startLine.thickness
        };
    }
 
function generateRandomSizeShape(maxWidth, maxHeight) {
    const minSize = Math.min(maxWidth, maxHeight) / 16; // Floor size 1/16th of screen size
    let width = Math.max(Math.random() * maxWidth / 8, minSize);
    let height = Math.max(Math.random() * maxHeight / 8, minSize);

    let x = Math.random() * (maxWidth - width);
    let y = Math.random() * (maxHeight - height);

    return { x, y, width, height };
}       

function isValidShape(x, y, width, height, lines) {
    let touchesHorizontalLine = false;
    let touchesVerticalLine = false;
    
    // Iterate through each line to check intersections and adjacency
    for (let line of lines) {
        if (line.orientation === 'horizontal') {
            // Check if line is at the top or bottom edge of the shape
            if ((line.y === y || line.y === y + height) && line.x < x + width && line.x + line.length > x) {
                touchesHorizontalLine = true;
            }
            // Check if the line intersects the shape
            if (line.y > y && line.y < y + height && line.x < x + width && line.x + line.length > x) {
                return false; // The line intersects the shape vertically.
            }
        } else if (line.orientation === 'vertical') {
            // Check if line is at the left or right edge of the shape
            if ((line.x === x || line.x === x + width) && line.y < y + height && line.y + line.length > y) {
                touchesVerticalLine = true;
            }
            // Check if the line intersects the shape
            if (line.x > x && line.x < x + width && line.y < y + height && line.y + line.length > y) {
                return false; // The line intersects the shape horizontally.
            }
        }
    }
    // Return true if shape is touching at least one horizontal and one vertical line without crossing
    return touchesHorizontalLine && touchesVerticalLine;
    
    // Check overlap with lines
    for (let line of lines) {
        let overlap;
        if (line.orientation === 'vertical') {
            overlap = newShape.x < line.x + line.thickness && newShape.x + newShape.width > line.x;
        } else { // Horizontal line
            overlap = newShape.y < line.y + line.thickness && newShape.y + newShape.height > line.y;
        }
        if (overlap) {
            console.log("Overlap with line detected", newShape, line);
            return false; // Overlap detected with a line
        }
    }
    return true; // No overlaps

    // Check mandatory line presence on edges
    const hasVerticalLine = lines.some(line => line.orientation === 'vertical' && 
    (newShape.x === line.x || newShape.x + newShape.width === line.x));
    const hasHorizontalLine = lines.some(line => line.orientation === 'horizontal' && 
    (newShape.y === line.y || newShape.y + newShape.height === line.y));

    if (!hasVerticalLine || !hasHorizontalLine) {
        console.log("Required line on edge missing", newShape);
        return false;
    }

    return true;
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
            button.style.position = "absolute";
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


window.onload = init()
