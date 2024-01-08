function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.addEventListener('DOMContentLoaded', function() {
    var sections = document.querySelectorAll('header, main, footer');
    sections.forEach(function(section) {
        section.style.backgroundColor = getRandomColor();
    });
});