document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('mondrianCanvas');
    const ctx = canvas.getContext('2d');
    let lines = [];
    let shapes = [];

    function adjustCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 80; // Account for banner
        init();
    }

    function init() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines = drawRandomLines();
        shapes = generateShapes(canvas.width, canvas.height, 5, 10, lines);
        assignColorsToShapes(shapes);
        placeButtons(shapes);
    }

    function drawRandomLines() {
        let lines = [];
        const numLines = Math.floor(Math.random() * 10) + 1; // Random number of lines between 1-11
        for (let i = 0; i < numLines; i++) {
            let lineOrientation = Math.random() < 0.5 ? 'vertical' : 'horizontal';
            let lineThickness = Math.floor(Math.random() * (8 - 1) + 1) * 2; // 2-16 at intervals of 2
            let position = Math.random() * (lineOrientation === 'vertical' ? canvas.width : canvas.height);

            ctx.strokeStyle = 'black';
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

            lines.push({ orientation: lineOrientation, position, thickness: lineThickness });
        }
        return lines;
    }

    function generateShapes(maxWidth, maxHeight, minShapes, maxShapes, lines) {
        const shapes = [];
        const maxAttempts = 1000;
        let attempts = 0;
        const targetShapeCount = Math.floor(Math.random() * (maxShapes - minShapes + 1)) + minShapes;

        while (shapes.length < targetShapeCount && attempts < maxAttempts) {
            attempts++;
            let newShape = generateRandomSizeShape(maxWidth, maxHeight);
            if (isValidShape(newShape, lines)) {
                shapes.push(newShape);
            }
        }
        return shapes;
    }

    function generateRandomSizeShape(maxWidth, maxHeight) {
    const minSize = Math.min(maxWidth, maxHeight) / 20; // Smaller minimum size
    let width = Math.random() * (maxWidth / 4) + minSize; // More varied size calculation
    let height = Math.random() * (maxHeight / 4) + minSize;

    let x = Math.random() * (maxWidth - width);
    let y = Math.random() * (maxHeight - height);

    return { x, y, width, height };
}


    function isValidShape(shape, lines) {
        let isValid = true; // Assume the shape is valid initially
        lines.forEach((line) => {
            if (line.orientation === 'vertical') {
                if (shape.x < line.position + line.thickness && shape.x + shape.width > line.position) {
                    isValid = false; // Shape overlaps vertically
                }
            } else {
                if (shape.y < line.position + line.thickness && shape.y + shape.height > line.position) {
                    isValid = false; // Shape overlaps horizontally
                }
            }
        });

        if (!isValid) return false;

        // Check if shape touches at least two lines (a corner)
        const touchesVerticalLine = lines.some(line => line.orientation === 'vertical' && (shape.x === line.position || shape.x + shape.width === line.position));
        const touchesHorizontalLine = lines.some(line => line.orientation === 'horizontal' && (shape.y === line.position || shape.y + shape.height === line.position));

        return touchesVerticalLine && touchesHorizontalLine;
        console.log(`Generated ${shapes.length} shapes`);
    }

    function assignColorsToShapes(shapes) {
        const colors = [
            {color: '#FF4136', probability: 0.3}, // Firehouse Red
            {color: '#FFD700', probability: 0.3}, // Pure Yellow
            {color: '#0074D9', probability: 0.3}, // Blue
            {color: '#2ECC40', probability: 0.1}  // Green
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
            shape.color = chosenColor; // Assign the color directly to the shape object
        });
    }

    function placeButtons(shapes) {
        shapes.forEach((shape, index) => {
            let button = document.createElement('button');
            button.style.position = 'absolute';
            button.style.left = `${shape.x}px`;
            button.style.top = `${shape.y}px`;
            button.style.width = `${shape.width}px`;
            button.style.height = `${shape.height}px`;
            button.style.opacity = 0; // Make the button invisible but clickable
            button.style.cursor = 'pointer'; // Change cursor to indicate clickable area
            button.setAttribute('data-index', index); // Set data attribute for referencing

            button.addEventListener('click', () => {
                const galleryModal = document.querySelector('.gallery-modal');
                const img = galleryModal.querySelector('img');
                img.src = shape.imageSrc || 'https://your.default/image/source.jpg'; // Provide a default or shape-specific image source
                galleryModal.style.display = 'block';
            });

            document.body.appendChild(button); // Append each button to the document body
        });
    }

    window.addEventListener('resize', adjustCanvas);
    adjustCanvas(); // Initial setup
});
