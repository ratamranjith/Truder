document.addEventListener('DOMContentLoaded', function () {

    const saveImageBtn = document.getElementById('saveImageBtn');
    const uploadInput = document.getElementById('uploadInput');
    const previewImage = document.getElementById('previewImage');
    const progressBar = document.getElementById('progressBar');

    uploadInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadstart = function () {
                progressBar.style.width = '0%';
                saveImageBtn.disabled = true; // Disable the button while loading
            };

            reader.onprogress = function (e) {
                if (e.lengthComputable) {
                    const percentLoaded = (e.loaded / e.total) * 100;
                    progressBar.style.width = percentLoaded + '%';
                }
            };

            reader.onload = function (e) {
                previewImage.src = e.target.result;
                progressBar.style.width = '100%';
                saveImageBtn.disabled = false; // Enable the button after loading
            };

            reader.readAsDataURL(file);
        }
    });

    document.getElementById('uploadInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const previewImage = document.getElementById('previewImage');
        const progressBar = document.getElementById('progressBar');

        if (file) {
            const reader = new FileReader();

            reader.onloadstart = function () {
                progressBar.style.width = '0%';
            };

            reader.onprogress = function (e) {
                if (e.lengthComputable) {
                    const percentLoaded = (e.loaded / e.total) * 100;
                    progressBar.style.width = percentLoaded + '%';
                }
            };

            reader.onload = function (e) {
                previewImage.src = e.target.result;
                progressBar.style.width = '100%';
            };

            reader.readAsDataURL(file);
        }
    });

    // CamanJS -> external framework to make the image effects
    function applyDynamicEffect(effectType, value) {
        const canvas = document.getElementById('canvas');
        const previewImage = document.getElementById('previewImage');
        const ctx = canvas.getContext('2d');

        canvas.width = previewImage.width;
        canvas.height = previewImage.height;

        // Draw the image on the canvas
        ctx.drawImage(previewImage, 0, 0, canvas.width, canvas.height);

        // CamanJS -> external framework to make the image effects
        Caman(canvas, function () {
            this.revert(); // Reset to the original image

            switch (effectType) {
                case 'brightness':
                    this.brightness(value);
                    document.getElementById('brightnessValue').textContent = value;
                    break;
                case 'contrast':
                    this.contrast(value);
                    document.getElementById('contrastValue').textContent = value;
                    break;
                case 'sepia':
                    this.sepia(value);
                    document.getElementById('sepiaValue').textContent = value;
                    break;
                case 'saturation':
                    this.saturation(value);
                    document.getElementById('saturationValue').textContent = value;
                    break;
                default:
                    // Unknown effect type
                    break;
            }

            this.render(function () {
                // Update the preview with the processed image
                previewImage.src = canvas.toDataURL('image/jpeg');
            });
        });
    }

    // Add dynamic effect listeners for each range input
    addDynamicEffectListener('brightnessInput', 'brightness');
    addDynamicEffectListener('contrastInput', 'contrast');
    addDynamicEffectListener('sepiaInput', 'sepia');
    addDynamicEffectListener('saturationInput', 'saturation');

    function addDynamicEffectListener(inputId, effectType) {
        const inputElement = document.getElementById(inputId);

        inputElement.addEventListener('input', function () {
            applyDynamicEffect(effectType, this.value);
        });
    }

    // Save Image Button
    document.getElementById('saveImageBtn').addEventListener('click', function () {
        const canvas = document.getElementById('canvas');
        const dataURL = canvas.toDataURL('image/jpeg');
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'filtered_image.jpg';
        a.click();
    });
});
