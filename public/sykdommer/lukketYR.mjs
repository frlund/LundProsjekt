document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.getElementById('closeButton');

    closeButton.addEventListener('click', function() {
        window.location.href = '../meny.html';
    });

    // Større bilde!
    const image = document.getElementById('image');
    let isExpanded = false; 

    image.addEventListener('click', function() {
        if (!isExpanded) {           
            image.style.width = '400px'; 
            image.style.height = 'auto'; 
            isExpanded = true;
        } else {            
            image.style.width = '200px'; 
            image.style.height = 'auto';
            isExpanded = false; 
        }
    });
});
