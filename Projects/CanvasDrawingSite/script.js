window.onload = function() {
    const canvas = document.getElementById('drawingCanvas');
    const context = canvas.getContext('2d');
  

  // Event listeners for drawing
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  


  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    minX = Math.min(minX, lastX);
    minY = Math.min(minY, lastY);
    maxX = Math.max(maxX, lastX);
    maxY = Math.max(maxY, lastY);
  }

  function draw(e) {
    if (!isDrawing) return;
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(e.offsetX, e.offsetY);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
    minX = Math.min(minX, lastX);
    minY = Math.min(minY, lastY);
    maxX = Math.max(maxX, lastX);
    maxY = Math.max(maxY, lastY);
  }

  function stopDrawing() {
    isDrawing = false;
  }



  function convertAndDisplaySVG() {
    const extractedWidth = maxX - minX;
    const extractedHeight = maxY - minY;
  
    const extractedCanvas = document.createElement('canvas');
    extractedCanvas.width = extractedWidth;
    extractedCanvas.height = extractedHeight;
  
    const extractedContext = extractedCanvas.getContext('2d');
    extractedContext.drawImage(
      canvas,
      minX,
      minY,
      extractedWidth,
      extractedHeight,
      0,
      0,
      extractedWidth,
      extractedHeight
    );
  
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = extractedWidth;
    tempCanvas.height = extractedHeight;
    const tempContext = tempCanvas.getContext('2d');
    tempContext.stroke(new Path2D(extractedContext.getImageData(0, 0, extractedWidth, extractedHeight)));
  
    const svgString = tempCanvas.toDataURL("image/svg+xml");
  
    const textarea = document.getElementById('svgTextArea');
    textarea.value = svgString;
  }
  
  
    // Assign the convertAndDisplaySVG function to a button click event
    const convertButton = document.getElementById('convertButton');
    convertButton.addEventListener('click', convertAndDisplaySVG);
  };