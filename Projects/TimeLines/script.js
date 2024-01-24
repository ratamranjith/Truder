document.addEventListener("DOMContentLoaded", function () {
    const car = document.querySelector(".car");
    const carContainer = document.querySelector(".car-container");
    const leftHeadlight = document.getElementById("leftHeadlight");
    const rightHeadlight = document.getElementById("rightHeadlight");
    const containers = document.querySelectorAll(".container");

    let currentContainerIndex = 0;
    let isScrolling = false;
    let rotate180 = false;

    window.addEventListener("wheel", function (event) {
        event.preventDefault();

        if (!isScrolling) {
            isScrolling = true;

            const scrollDirection = event.deltaY > 0 ? 1 : -1;

            if (scrollDirection === 1 && currentContainerIndex < containers.length - 1) {
                currentContainerIndex++;
                rotate180 = false;
            } else if (scrollDirection === -1 && currentContainerIndex > 0) {
                currentContainerIndex--;
                rotate180 = true;
            }

            const targetContainer = containers[currentContainerIndex];
            const targetPosition = targetContainer.offsetTop;
            animateScroll(targetPosition, rotate180);
            blinkHeadlights(); // Call the function to blink headlights
        }
    });

    function animateScroll(targetPosition, rotate180) {
        const initialPosition = carContainer.getBoundingClientRect().top + window.scrollY;
        const distance = targetPosition - initialPosition;
        const duration = 800; // Adjust the duration as needed
        let startTime;

        function scrollStep(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            carContainer.style.transform = `translateY(${initialPosition + (distance * progress) / duration}px)`;
            if (progress < duration) {
                requestAnimationFrame(scrollStep);
            } else {
                isScrolling = false;
            }
        }

        requestAnimationFrame(scrollStep);
    }

    function blinkHeadlights() {
        // Toggle opacity to create a blinking effect
        let blinkCount = 0;
        const blinkInterval = setInterval(() => {
            leftHeadlight.style.opacity = blinkCount % 2 === 0 ? 0 : 0.3;
            rightHeadlight.style.opacity = blinkCount % 2 === 0 ? 0 : 0.3;
            blinkCount++;

            if (blinkCount === 6) { // Change 6 to adjust the number of blinks
                clearInterval(blinkInterval);
                leftHeadlight.style.opacity = 0.3; // Reset opacity after blinking
                rightHeadlight.style.opacity = 0.3;
            }
        }, 300); // Change 300 to adjust the blinking speed
    }
});
