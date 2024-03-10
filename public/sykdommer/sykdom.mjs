document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.getElementById('closeButton');
    const image = document.getElementById('mainImage');

    closeButton.addEventListener('click', function() {
        window.location.href = '../meny.html';
    });

    image.addEventListener('click', function() {
        if (image.style.width === '300px') {
            image.style.width = '100%';
        } else {
            image.style.width = '300px';
        }
    });
});
