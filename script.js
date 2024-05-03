document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mondrianCanvas');
    const ctx = canvas.getContext('2d');
    let lines = [];
    let shapes = [];

    function adjustCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 100; // Account for banner
        init();
    }

    function init() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines = drawRandomLines();
        shapes = generateShapes(canvas.width, canvas.height, 5, 10, lines);
        assignColorsToShapes(shapes);
        drawShapes(shapes, ctx);
        placebuttons(shapes);
        setupGalleryModal(shapes); // Adjusted to call a setup function
    }

    function drawRandomLines() {
        let lines = [];
        const numLines = Math.floor(Math.random() * 10) + 5;
        for (let i = 0; i < numLines; i++) {
            let lineOrientation = Math.random() < 0.5 ? 'vertical' : 'horizontal';
            let lineThickness = Math.floor(Math.random() * 7 + 1) * 2;
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
            
            lines.push({orientation: lineOrientation, position, thickness: lineThickness});
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
                newShape.id = `shape-${shapes.length}`; // Assign an ID to the shape for easy access
                shapes.push(newShape);
            }
        }
        return shapes;
    }
    
    function isValidShape(shape, lines) {
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
    
        const touchesVerticalLine = lines.some(line => line.orientation === 'vertical' && 
            (shape.x === line.position || shape.x + shape.width === line.position + line.thickness));
        const touchesHorizontalLine = lines.some(line => line.orientation === 'horizontal' && 
            (shape.y === line.position || shape.y + shape.height === line.position + line.thickness));
    
        return touchesVerticalLine && touchesHorizontalLine;
    }
    
    function generateRandomSizeShape(maxWidth, maxHeight) {
        const minSize = 10; // Set a minimum size to avoid very small shapes
        let width = Math.random() * (maxWidth / 4 - minSize) + minSize;
        let height = Math.random() * (maxHeight / 4 - minSize) + minSize;
        let x = Math.random() * (maxWidth - width);
        let y = Math.random() * (maxHeight - height);
    
        return { x, y, width, height };
    }
    
    function assignColorsToShapes(shapes) {
        const colors = [
            {color: '#FF4136', probability: 0.3}, // Firehouse Red
            {color: '#FFD700', probability: 0.3}, // Pure Yellow
            {color: '#0074D9', probability: 0.3}, // Blue
            {color: '#2ECC40', probability: 0.1}  // Green
        ];
    
        let cumulativeProbability = 0;
        let cumulativeProbArray = colors.map(color => {
            cumulativeProbability += color.probability;
            return cumulativeProbability;
        });
    
        shapes.forEach(shape => {
            let randomProb = Math.random();
            let chosenColor = colors[cumulativeProbArray.findIndex(prob => randomProb <= prob)].color;
            shape.color = chosenColor; // Assign the color directly to the shape object
        });
    }
    
    function drawShapes(shapes, ctx) {
        shapes.forEach(shape => {
            ctx.fillStyle = shape.color; // Use the assigned color
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height); // Draw the rectangle
        });
    }
    
    function setupGalleryModal() {
        const galleryModal = document.createElement('div');
        galleryModal.className = 'gallery-modal';
        const galleryContent = document.createElement('div');
        galleryContent.className = 'gallery-content';
        const span = document.createElement('span');
        span.className = 'close-button';
        span.innerHTML = '&times;';
        span.onclick = function() { galleryModal.style.display = "none"; };
        galleryModal.appendChild(galleryContent);
        galleryContent.appendChild(span);
    
        document.body.appendChild(galleryModal);
    
        // Listen for clicks on the canvas, and open the gallery if a shape is clicked
        canvas.addEventListener('click', function(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
    
            shapes.forEach(shape => {
                if (x > shape.x && x < shape.x + shape.width && y > shape.y && y < shape.y + shape.height) {
                    const img = document.createElement('img');
                    img.className = 'fade-in';
                    img.style.width = '100%';
                    img.src = 'images/Firefly_promo.jpg'; // Adjusted path
                    galleryContent.appendChild(img);
                    galleryModal.style.display = "block";
                    galleryContent.replaceChild(img, galleryContent.firstChild.nextSibling); // Replace the existing image if one exists
                }
            });
        });
    }
    
    window.addEventListener('resize', adjustCanvas);
    adjustCanvas();

    window.addEventListener('load', () => {
        const canvas = document.getElementById('mondrianCanvas');
        canvas.classList.add('animate__animated', 'animate__fadeIn'); // Fades in the canvas on load
      });     
});
