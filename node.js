console.log("Node.js is running!");

// Share modal
function openApp() {
  if (!document.getElementById('share-modal')) {
    const modal = document.createElement('div');
    modal.id = 'share-modal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7); z-index: 9999;
      display: flex; align-items: center; justify-content: center;
    `;

    const siteUrl = 'https://fakegamer114.github.io/devsheet/';
    const siteText = 'Check out DevSheet — cheatsheets for all programming languages! 🚀';

    modal.innerHTML = `
      <div style="
        background: #1d1d1d; border: 1px solid rgba(255,255,255,0.2);
        border-radius: 16px; padding: 30px; width: 320px; text-align: center;
      ">
        <h3 style="color:#fff; margin-bottom: 6px;">Share DevSheet 🚀</h3>
        <p style="color:#636363; font-size:13px; margin-bottom: 20px;">Help others discover DevSheet!</p>

        <div style="display:flex; flex-direction:column; gap:10px;">

          <button onclick="window.open('https://www.reddit.com/submit?url=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent(siteText)}','_blank')"
            style="background:#ff4500; color:#fff; border:none; padding:10px; border-radius:8px; cursor:pointer; font-size:14px;">
            <i class="fa-brands fa-reddit-alien"></i> Share on Reddit
          </button>

          <button onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(siteText)}&url=${encodeURIComponent(siteUrl)}','_blank')"
            style="background:#000; color:#fff; border:none; padding:10px; border-radius:8px; cursor:pointer; font-size:14px;">
            <i class="fa-brands fa-x-twitter"></i> Share on X
          </button>

          <button onclick="navigator.clipboard.writeText('${siteUrl}').then(()=>{ this.innerHTML='<i class=\\'fa-solid fa-check\\'></i> Copied!'; setTimeout(()=>{ this.innerHTML='<i class=\\'fa-regular fa-copy\\'></i> Copy Link'; },2000); })"
            style="background:#0d7377; color:#fff; border:none; padding:10px; border-radius:8px; cursor:pointer; font-size:14px;">
            <i class="fa-regular fa-copy"></i> Copy Link
          </button>

        </div>

        <button onclick="document.getElementById('share-modal').remove()"
          style="margin-top:16px; background:transparent; color:#636363;
          border:1px solid rgba(255,255,255,0.2); padding:8px 20px;
          border-radius:8px; cursor:pointer; font-size:13px;">
          Close
        </button>
      </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });
  }
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

// Load favorites + setup cards in one go
document.addEventListener('DOMContentLoaded', function() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
  const cards = document.querySelectorAll('.card');

  // خريطة أسماء اللغات
  const languageMap = {
    'c++': 'cpp',
    'c#': 'csharp',
    'javascript': 'javascript',
    'python': 'python',
    'java': 'java',
    'html': 'html',
    'css': 'css',
    'c': 'c',
    'assembly': 'assembly'
  };
  const titleParts = document.title.split(' - ');
  const rawLanguage = titleParts[1]
    ? titleParts[1].replace(' Cheatsheet', '').toLowerCase().trim()
    : 'unknown';
  const language = languageMap[rawLanguage] || rawLanguage;

  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.trim();
    const code = card.querySelector('code').textContent.trim();

    card.setAttribute('data-language', language);
    card.setAttribute('data-title', title);

    // إضافة badge اللغة إذا لم تكن موجودة
    if (!card.querySelector('.card-lang-badge')) {
      const badge = document.createElement('span');
      badge.className = 'card-lang-badge';
      badge.textContent = language;
      card.insertBefore(badge, card.firstChild);
    }

    // ترتيب الـ footer (copy + favorite) إذا لم يكن موجوداً
    let footer = card.querySelector('.card-footer');
    if (!footer) {
      footer = document.createElement('div');
      footer.className = 'card-footer';
      const copyBtn = card.querySelector('.copy-btn');
      if (copyBtn) footer.appendChild(copyBtn);
      const favoriteBtn = document.createElement('button');
      favoriteBtn.className = 'favorite-btn';
      favoriteBtn.textContent = '♡';
      favoriteBtn.addEventListener('click', function() {
        toggleFavorite(this, language, title, code);
      });
      footer.appendChild(favoriteBtn);
      card.appendChild(footer);
    }

    // تحقق هل هذه البطاقة في المفضلة وأظهر القلب المفعّل
    const favoriteBtn = card.querySelector('.favorite-btn');
    if (favorites[language]) {
      const isFavorited = favorites[language].some(fav => fav.title === title);
      if (isFavorited) {
        favoriteBtn.textContent = '♥';
        favoriteBtn.classList.add('favorited');
      }
    }
  });
});