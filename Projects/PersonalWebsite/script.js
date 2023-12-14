document.addEventListener('DOMContentLoaded', function () {
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});

function animateOnScroll() {
    const elements = document.querySelectorAll('.animate');

    elements.forEach((element) => {
        const position = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (position < windowHeight * 0.75) {
            element.classList.add('show');
        }
    });
}
