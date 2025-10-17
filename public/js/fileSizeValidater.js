function validateFileSize() {
    const inputFile = document.getElementById('image');
    const file = inputFile.files[0];
    const maxSize = 0.8 * 1024 * 1024;

    const errorMessage = document.getElementById('error-message');

    if(file && file.size > maxSize) {
        errorMessage.style.display = 'block';
        errorMessage.style.fontSize = '0.85rem'
        errorMessage.style.color = '#DC3545'
        errorMessage.style.marginTop = '2px'
        inputFile.setCustomValidity("File size exceeds 800KB");
    } else {
        errorMessage.style.display = 'none';
        inputFile.setCustomValidity("");
    }
}