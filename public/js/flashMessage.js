const flashmessage = document.getElementById('flash-message');

if (flashmessage) {
  setTimeout(() => {
    flashmessage.style.opacity = '0';
    setTimeout(() => {
      flashmessage.remove();
    }, 500);
  }, 3500);
}
