document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mondrianCanvas');
    const ctx = canvas.getContext('2d');
    let lines = [];
    let shapes = [];

    // Adjusts the canvas size and re-initializes the drawing
    function adjustCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 50; // Account for banner
        init();
    }

    // Initializes the Mondrian drawing
    function init() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines = drawRandomLines();
        shapes = generateShapes(canvas.width, canvas.height, 5, 10, lines); // Ensuring at least 6 shapes
            assignColorsToShapes(shapes);
            drawShapes(shapes, ctx);
        placebuttons(shapes);
        
    }

    function drawRandomLines() {
      let lines = [];
      const numLines = Math.floor(Math.random() * 10) + 5; // Random number of lines between 5 and 15
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
                newShape.id = `shape-${shapes.length}`; // Assign an id to the shape
                shapes.push(newShape);
            }
        }
        return shapes;
    }

    function isValidShape(shape, lines) {
        // Check for non-overlapping with lines
        let overlaps = lines.some(line => {
            if (line.orientation === 'vertical') {
                return (shape.x < line.position + line.thickness && shape.x + shape.width > line.position);
            } else {
                return (shape.y < line.position + line.thickness && shape.y + shape.height > line.position);
            }
        });
    
        if (overlaps) {
            return false; // If any overlap exists, the shape is invalid
        }
    
        // Check for touch on at least two sides (one vertical and one horizontal line)
        const touchesVerticalLine = lines.some(line => line.orientation === 'vertical' && 
            (shape.x === line.position || shape.x + shape.width === line.position + line.thickness));
        const touchesHorizontalLine = lines.some(line => line.orientation === 'horizontal' && 
            (shape.y === line.position || shape.y + shape.height === line.position + line.thickness));
    
        return touchesVerticalLine && touchesHorizontalLine;
    }
    
    function generateRandomSizeShape(maxWidth, maxHeight) {
        const minSize = 50; // Fixed minimum size to avoid very small shapes
        let width = Math.random() * (maxWidth / 4 - minSize) + minSize;
        let height = Math.random() * (maxHeight / 4 - minSize) + minSize;
        let x = Math.random() * (maxWidth - width);
        let y = Math.random() * (maxHeight - height);
    
        return { x, y, width, height };
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
    function drawShapes(shapes, ctx) {
        shapes.forEach(shape => {
            ctx.fillStyle = shape.color; // Use the color assigned in the assignColorsToShapes function
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height); // Draw the rectangle
        });
    }
    
}

    function placebuttons(shapes) {
        // Select five random shapes to place the buttons on
        const selectedShapes = [];
        for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * shapes.length);
        selectedShapes.push(shapes[randomIndex]);
        }
    
        // Create a button for each selected shape
        selectedShapes.forEach((shape) => {
        const button = document.createElement('button');
        button.className = 'shape-button';
        button.style.position = 'absolute';
        button.style.left = `${shape.x + shape.width / 2}px`;
        button.style.top = `${shape.y + shape.height / 2}px`;
    
        // Add the button to the DOM
        document.body.appendChild(button);
        });
    }
  

    window.addEventListener('resize', adjustCanvas);
    adjustCanvas();  // Initial setup
});

// Remove one of the DOMContentLoaded event listeners
document.addEventListener('DOMContentLoaded', () => {
    const galleryModal = document.createElement('div');
    galleryModal.className = 'gallery-modal';
    const galleryContent = document.createElement('div');
    galleryContent.className = 'gallery-content';
    const span = document.createElement('span');
    span.className = 'close-button';
    span.innerHTML = '&times;';
    span.onclick = function() {
        galleryModal.style.display = "none";
    };

    galleryModal.appendChild(galleryContent);
    galleryContent.appendChild(span);

    const img = document.createElement('img');
    img.className = 'fade-in'; // Apply fade-in effect
    img.style.width = '100%';
    // Example image, replace src
    img.src = '/Users/jreback/circes/images/HocOmnia_Logo.png';
    galleryContent.appendChild(img);
    
    document.body.appendChild(galleryModal);

    // Allow multiple images by linking additional next/back navigation, and handling how to update the img's src attribute.
    
    // Example usage from common shape color fill handler onClick.
    shapes.forEach(shape => {
        // Detect click on shape
        document.getElementById(shape.id).addEventListener('click', () => {
            // Show image, update with actual URL or local data
            img.src = '/Users/jreback/circes/images/Firefly promo stills for a futuristic joyful flying cruise-ship Zeppelin, with multiple pools, minig.jpg'; // Adjust SRC on Click or by shape
            galleryModal.style.display = "block";
        });
    });
});

init(); // Call the init function directly
