document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mondrianCanvas');
    const ctx = canvas.getContext('2d');

    let lines = [];
    let shapes = [];

    function adjustCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 50;  // Account for banner
        initArt();
    }

    function initArt() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines = drawRandomLines();
        shapes = generateShapes(canvas.width, canvas.height, 4, 8, lines);
        colorShapes(shapes);
        overlayMultimediaButtons(shapes);
    }

    function drawRandomLines() {
        const numberOfLines = Math.floor((Math.random() * 10) + 5);
        const lines = [];
    
        for (let i = 0; i < numberOfLines; i++) {
            const orientation = Math.random() < 0.5 ? 'vertical' : 'horizontal';
            const thickness = Math.floor(Math.random() * 8 + 1) * 2;
            const position = Math.random() * (orientation === 'vertical' ? canvas.width : canvas.height);
    
            ctx.lineWidth = thickness;
            ctx.beginPath();
            if (orientation === 'vertical') {
                ctx.moveTo(position, 0);
                ctx.lineTo(position, canvas.height);
            } else {
                ctx.moveTo(0, position);
                ctx.lineTo(canvas.width, position);
            }
            ctx.stroke();
            lines.push({ x: position, orientation, thickness });
        }
        return lines;
    }

    function generateShapes(maxWidth, maxHeight, minShapes, maxShapes, lines) {
        const attemptLimit = 200;
        let shapes = [], currentAttempts = 0;

        const targetShapeCount = Math.floor(Math.random() * (maxShapes - minShapes + 1)) + minShapes;

        while (shapes.length < targetShapeCount && currentAttempts < attemptLimit) {
            currentAttempts++;
            let newShape = {
                width: Math.floor(Math.random() * (maxWidth / 4) + 20),
                height: Math.floor(Math.random() * (maxHeight / 4) + 20),
                x: Math.floor(Math.random() * (maxWidth - this.width)),
                y: Math.floor(Math.random() * (maxHeight - this.height))
            };

            if (isValidShape(newShape, lines)) {
                shapes.push(newShape);
            }
        }
        return shapes;
    }

    // Check shapes don't overlap existing lines and fit within A logical grid framed by these lines
    function isValidShape(shape, lines) {
        let inVerticalBoundary = false;
        let inHorizontalBoundary = false;
        
        // Check for each line if it divides the shape:
        // A vertical line should not cross the shape horizontally (pass through it left to right)
        // A horizontal line should not cross the shape vertically (pass through it top to bottom)
        for (let line of lines) {
            if (line.orientation === 'vertical') {
                const verticalCross = (shape.x < line.x && shape.x + shape.width > line.x) 
                               || (shape.x > line.x + line.thickness);
        
                if (!verticalCross) {
                    inVerticalBoundary = true;
                } else if(verticalCross && (shape.x + shape.width >= line.x && shape.x <= line.x)) {
                    // Hop out, as the shape is clipped horizontally
                    return false;
                }
            } else { // line.orientation is 'horizontal'
                const horizontalCross = (shape.y < line.y && shape.y + shape.height > line.y) 
                                     || (shape.y > line.y + line.thickness);
        
                if (!horizontalCross) {
                    inHorizontalBoundary = true;
                } else if(horizontalCross && (shape.y + shape.height >= line.y && shape.y <= line.y)) {
                    // Hop out, as the shape is clipped vertically
                    return false;
            }
        }
    }

    // Ensure the shape has adequate surrounding bordering lines (bottom, top)
    return inVerticalBoundary && inHorizontalBoundary;
}

// Use this function in your shape creation loop to ensure all shapes meet these position criteria.



   function assignColorsToShapes(shapes) {
    const colors = [
        {color: '#FF4136', probability: 0.3},  // Firehouse Red
        {color: '#FFD700', probability: 0.3},  // Pure Yellow
        {color: '#0074D9', probability: 0.3},  // Blue
        {color: '#2ECC40', probability: 0.1}   // Green
    ];

    // Calculate cumulative probabilities for random picking
    let cumulativeProbability = 0;
    let cumulativeProbArray = colors.map(color => {
        cumulativeProbability += color.probability;
        return cumulativeProbability;
    });

    // Assigning colors to shapes based on calculated probabilities
    shapes.forEach(shape => {
        let randomProb = Math.random();
        let chosenColor = colors[cumulativeProbArray.findIndex(prob => randomProb <= prob)].color;
        shape.color = chosenColor;  // Assign the color directly to the shape object
    });

    // Optionally, you might want to draw or fill these shapes here or in another function.
}

    }

    function overlayMultimediaButtons(shapes) {
        // Implementation to set up interactive multimedia elements over colored shapes
    }

    window.addEventListener('resize', adjustCanvas);
    adjustCanvas();  // Initial setup
});
