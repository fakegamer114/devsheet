console.log("Node.js is running!");

// sanding message warning when taping on the button that given by id="openAppBtn" onclick="openApp()"
function openApp() {
  alert("This button is not functional yet. Please check back later!");
  console.log("Open App button was clicked, but it's not functional yet.");
}

// with function <button class="back-btn" onclick="window.history.back()">
function goBack() {
  window.history.back();
  console.log("Back button was clicked, navigating to the previous page.");
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('search-bar').addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const content = card.querySelector('p').textContent.toLowerCase();
      if (query === '' || title.includes(query) || content.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    // Show a brief success message
    const notification = document.createElement('div');
    notification.textContent = 'Copied to clipboard!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #0d7377;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
      margin-top: 70px;
    `;
    document.body.appendChild(notification);
    
    // Remove the notification after 2 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
    
    console.log("Text copied to clipboard: " + text);
  }).catch(function(err) {
    console.error('Failed to copy text: ', err);
    alert('Failed to copy to clipboard. Please try again.');
  });
}

// Favorites functionality
function toggleFavorite(btn, language, title, code) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
  
  if (!favorites[language]) {
    favorites[language] = [];
  }
  
  const favorite = { title, code };
  const favoriteStr = JSON.stringify(favorite);
  const index = favorites[language].findIndex(fav => JSON.stringify(fav) === favoriteStr);
  
  if (index > -1) {
    // Remove favorite
    favorites[language].splice(index, 1);
    btn.textContent = '♡';
    btn.classList.remove('favorited');
  } else {
    // Add favorite
    favorites[language].push(favorite);
    btn.textContent = '♥';
    btn.classList.add('favorited');
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  console.log("Favorites updated for " + language);
}

// Load favorites on page load
document.addEventListener('DOMContentLoaded', function() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    const language = card.getAttribute('data-language');
    const title = card.getAttribute('data-title');
    const btn = card.querySelector('.favorite-btn');
    
    if (btn && favorites[language]) {
      const isFavorited = favorites[language].some(fav => fav.title === title);
      if (isFavorited) {
        btn.textContent = '♥';
        btn.classList.add('favorited');
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');
  
  // نأخذ اسم اللغة من عنوان الصفحة
  // مثلاً "DevSheet - JavaScript Cheatsheet" نأخذ "javascript"
  const titleParts = document.title.split(' - ');
  const language = titleParts[1]
    ? titleParts[1].replace(' Cheatsheet', '').toLowerCase().trim()
    : 'unknown';

  cards.forEach(card => {
  const title = card.querySelector('h3').textContent.trim();
  const code = card.querySelector('code').textContent.trim();
  
  card.setAttribute('data-language', language);
  card.setAttribute('data-title', title);

  // تحقق هل الزر موجود مسبقاً
  if (!card.querySelector('.favorite-btn')) {
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite-btn';
    favoriteBtn.textContent = '♡';
    favoriteBtn.addEventListener('click', function() {
      toggleFavorite(this, language, title, code);
    });
    card.appendChild(favoriteBtn);
  }
});
});