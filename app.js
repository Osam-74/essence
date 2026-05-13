/* ==============================================
   SCENT & SOUL — app.js
   All logic: carousel, login, manager panel,
   WhatsApp integration, localStorage data
   ============================================== */

// ─── PASSWORD ─────────────────────────────────
// The keypad maps digits AND letters.
// Password: ohtun03ola
// On a phone keypad: o=6,h=4,t=8,u=8,n=6,0=0,3=3,o=6,l=5,a=2
// So numeric equivalent: 6488603652
// But we accept the *typed characters* matched directly.
// We store as a sequence entered via the key labels.
const PASSWORD_MAP = {
  '1': '1',
  '2': '2', 'a': '2', 'b': '2', 'c': '2',
  '3': '3', 'd': '3', 'e': '3', 'f': '3',
  '4': '4', 'g': '4', 'h': '4', 'i': '4',
  '5': '5', 'j': '5', 'k': '5', 'l': '5',
  '6': '6', 'm': '6', 'n': '6', 'o': '6',
  '7': '7', 'p': '7', 'q': '7', 'r': '7', 's': '7',
  '8': '8', 't': '8', 'u': '8', 'v': '8',
  '9': '9', 'w': '9', 'x': '9', 'y': '9', 'z': '9',
  '0': '0', '+': '0',
  '*': '*'
};

// Password "ohtun03ola" → each letter mapped to its keypad digit
// o=6, h=4, t=8, u=8, n=6, 0=0, 3=3, o=6, l=5, a=2
const CORRECT_SEQUENCE = ['6','4','8','8','6','0','3','6','5','2'];

let enteredSequence = [];

// ─── DATA STORAGE ──────────────────────────────
function getProducts() {
  try {
    return JSON.parse(localStorage.getItem('ss_products') || '[]');
  } catch { return []; }
}

function saveProducts(products) {
  localStorage.setItem('ss_products', JSON.stringify(products));
}

function getSettings() {
  try {
    return JSON.parse(localStorage.getItem('ss_settings') || '{}');
  } catch { return {}; }
}

function saveSettingsData(settings) {
  localStorage.setItem('ss_settings', JSON.stringify(settings));
}

// ─── CAROUSEL STATE ────────────────────────────
let currentIndex = 0;
let products = [];
let touchStartX = 0;
let touchEndX = 0;

// ─── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  products = getProducts();
  renderCarousel();
  loadSettingsIntoForm();
  setupTouchSwipe();
});

// ─── CAROUSEL ──────────────────────────────────
function renderCarousel() {
  const track = document.getElementById('carouselTrack');
  const dots  = document.getElementById('dotsContainer');
  const empty = document.getElementById('emptyState');
  const section = document.querySelector('.carousel-section');

  track.innerHTML = '';
  dots.innerHTML  = '';

  if (products.length === 0) {
    empty.style.display  = 'block';
    section.style.display = 'none';
    return;
  }

  empty.style.display   = 'none';
  section.style.display = 'block';

  products.forEach((product, i) => {
    const card = createCard(product, i);
    track.appendChild(card);

    const dot = document.createElement('span');
    dot.className = 'dot-item' + (i === currentIndex ? ' active' : '');
    dot.onclick = () => goTo(i);
    dots.appendChild(dot);
  });

  positionCarousel(false);
}

function createCard(product, index) {
  const card = document.createElement('div');
  card.className = 'perfume-card';
  card.dataset.index = index;

  // Image slider
  const images = product.images || [];
  let imgSliderHTML = '';

  if (images.length > 0) {
    const slides = images.map(src =>
      `<img class="card-image-slide" src="${src}" alt="${product.name}" loading="lazy" />`
    ).join('');
    const imgDots = images.length > 1
      ? `<div class="card-img-dots">${images.map((_,i) =>
          `<span class="card-img-dot${i===0?' active':''}" onclick="imgSlide(event,${index},${i})"></span>`
        ).join('')}</div>` : '';

    const prevBtn = images.length > 1 ? `<button class="card-img-prev" onclick="imgSlide(event,${index},-1)">&#8249;</button>` : '';
    const nextBtn = images.length > 1 ? `<button class="card-img-next" onclick="imgSlide(event,${index},1)">&#8250;</button>` : '';

    imgSliderHTML = `
      <div class="card-image-slider">
        <div class="card-image-slides" id="imgSlides${index}">${slides}</div>
        ${prevBtn}${nextBtn}${imgDots}
      </div>`;
  } else {
    imgSliderHTML = `
      <div class="card-image-slider">
        <div class="card-image-placeholder">🌸<span>No image yet</span></div>
      </div>`;
  }

  const settings = getSettings();
  const waNumber  = settings.waNumber || '2348000000000';
  const message   = encodeURIComponent(
    `Hey! I'd love to know more about the *${product.name}* perfume. I'm interested! 🌸`
  );
  const waLink = `https://wa.me/${waNumber}?text=${message}`;

  card.innerHTML = `
    ${imgSliderHTML}
    <div class="card-body">
      <h2 class="card-name">${product.name}</h2>
      ${product.desc ? `<p class="card-desc">${product.desc}</p>` : ''}
      <p class="card-price">${product.price}</p>
      <a href="${waLink}" target="_blank" rel="noopener" class="card-cta">
        💬 I'm Interested in This
      </a>
    </div>`;

  // Click inactive card to navigate
  card.addEventListener('click', () => {
    if (parseInt(card.dataset.index) !== currentIndex) {
      goTo(parseInt(card.dataset.index));
    }
  });

  return card;
}

// Per-card image slide state
const cardImgIndex = {};

function imgSlide(event, cardIndex, val) {
  event.stopPropagation();
  const product = products[cardIndex];
  const images  = product.images || [];
  if (images.length <= 1) return;

  if (!cardImgIndex[cardIndex]) cardImgIndex[cardIndex] = 0;

  if (val === -1 || val === 1) {
    cardImgIndex[cardIndex] = (cardImgIndex[cardIndex] + val + images.length) % images.length;
  } else {
    cardImgIndex[cardIndex] = val;
  }

  const slides = document.getElementById(`imgSlides${cardIndex}`);
  if (slides) {
    slides.style.transform = `translateX(-${cardImgIndex[cardIndex] * 100}%)`;
  }

  // Update dots inside card
  const cardEl = document.querySelector(`.perfume-card[data-index="${cardIndex}"]`);
  if (cardEl) {
    cardEl.querySelectorAll('.card-img-dot').forEach((d, i) => {
      d.classList.toggle('active', i === cardImgIndex[cardIndex]);
    });
  }
}

function positionCarousel(animate = true) {
  const track = document.getElementById('carouselTrack');
  const cards  = track.querySelectorAll('.perfume-card');
  if (!cards.length) return;

  const cardWidth = cards[0].offsetWidth;
  const gap = 20;

  cards.forEach((card, i) => {
    card.classList.remove('active', 'adjacent');
    if (i === currentIndex) {
      card.classList.add('active');
    } else if (Math.abs(i - currentIndex) === 1) {
      card.classList.add('adjacent');
    }
  });

  const offset = -(currentIndex * (cardWidth + gap));
  if (!animate) track.style.transition = 'none';
  track.style.transform = `translateX(${offset}px)`;
  if (!animate) {
    track.offsetHeight; // force reflow
    track.style.transition = '';
  }

  // Update dots
  document.querySelectorAll('.dot-item').forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex);
  });

  // Update arrows
  const left  = document.getElementById('arrowLeft');
  const right = document.getElementById('arrowRight');
  if (left)  left.disabled  = currentIndex === 0;
  if (right) right.disabled = currentIndex === products.length - 1;
}

function slide(dir) {
  const newIndex = currentIndex + dir;
  if (newIndex < 0 || newIndex >= products.length) return;
  currentIndex = newIndex;
  positionCarousel();
}

function goTo(index) {
  if (index < 0 || index >= products.length) return;
  currentIndex = index;
  positionCarousel();
}

// ─── TOUCH SWIPE ───────────────────────────────
function setupTouchSwipe() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) slide(diff > 0 ? 1 : -1);
  }, { passive: true });
}

// ─── LOGIN KEYPAD ──────────────────────────────
function openLoginModal() {
  enteredSequence = [];
  updateDots();
  document.getElementById('loginError').textContent = '';
  document.getElementById('loginModal').classList.add('open');
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('open');
  enteredSequence = [];
  updateDots();
}

function keyPress(char) {
  if (enteredSequence.length >= CORRECT_SEQUENCE.length) return;

  // Map character to digit
  let digit = PASSWORD_MAP[char.toLowerCase()] || char;
  enteredSequence.push(digit);
  updateDots();

  if (enteredSequence.length === CORRECT_SEQUENCE.length) {
    // Small delay for UX
    setTimeout(checkPassword, 200);
  }
}

function keyDelete() {
  if (enteredSequence.length > 0) {
    enteredSequence.pop();
    updateDots();
    document.getElementById('loginError').textContent = '';
  }
}

function updateDots() {
  for (let i = 1; i <= CORRECT_SEQUENCE.length; i++) {
    const dot = document.getElementById(`d${i}`);
    if (dot) dot.classList.toggle('filled', i <= enteredSequence.length);
  }
}

function checkPassword() {
  const isCorrect = enteredSequence.every((v, i) => v === CORRECT_SEQUENCE[i]);
  if (isCorrect) {
    closeLoginModal();
    openManagerPanel();
  } else {
    document.getElementById('loginError').textContent = 'Incorrect passcode. Try again.';
    // Shake the dots
    const display = document.getElementById('passcodeDisplay');
    display.style.animation = 'none';
    display.offsetHeight;
    display.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
      enteredSequence = [];
      updateDots();
      document.getElementById('loginError').textContent = '';
    }, 1200);
  }
}

// Shake animation
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-6px); }
    80%      { transform: translateX(6px); }
  }
`;
document.head.appendChild(styleTag);

// ─── MANAGER PANEL ─────────────────────────────
function openManagerPanel() {
  document.getElementById('managerPanel').classList.add('open');
  switchTab('add');
  renderEditList();
}

function closeManagerPanel() {
  document.getElementById('managerPanel').classList.remove('open');
}

function switchTab(tab) {
  ['add','edit','settings'].forEach(t => {
    document.getElementById(`tabContent${capitalize(t)}`).classList.toggle('hidden', t !== tab);
    document.getElementById(`tab${capitalize(t)}`).classList.toggle('active', t === tab);
  });

  if (tab === 'edit') renderEditList();
  if (tab === 'settings') loadSettingsIntoForm();
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ─── ADD PRODUCT ───────────────────────────────
let newImages = []; // base64 array

function handleImageUpload(event) {
  const files = Array.from(event.target.files);
  const remaining = 5 - newImages.length;
  files.slice(0, remaining).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      newImages.push(e.target.result);
      renderImagePreviews('imagePreviewRow', newImages, 'add');
    };
    reader.readAsDataURL(file);
  });
}

function renderImagePreviews(containerId, images, mode) {
  const row = document.getElementById(containerId);
  row.innerHTML = images.map((src, i) => `
    <div class="img-preview-wrap">
      <img src="${src}" />
      <button class="img-remove" onclick="removeImage(${i}, '${mode}')">✕</button>
    </div>`).join('');
}

function removeImage(index, mode) {
  if (mode === 'add') {
    newImages.splice(index, 1);
    renderImagePreviews('imagePreviewRow', newImages, 'add');
  } else if (mode === 'edit') {
    editImages.splice(index, 1);
    renderImagePreviews('editImagePreviewRow', editImages, 'edit');
  }
}

function addProduct() {
  const name  = document.getElementById('addName').value.trim();
  const price = document.getElementById('addPrice').value.trim();
  const desc  = document.getElementById('addDesc').value.trim();
  const msg   = document.getElementById('addMsg');

  if (!name || !price) {
    msg.style.color = '#e53935';
    msg.textContent = 'Please enter at least a name and price.';
    return;
  }

  const product = {
    id: Date.now().toString(),
    name,
    price,
    desc,
    images: [...newImages]
  };

  products.push(product);
  saveProducts(products);
  renderCarousel();

  // Reset form
  document.getElementById('addName').value = '';
  document.getElementById('addPrice').value = '';
  document.getElementById('addDesc').value = '';
  document.getElementById('imagePreviewRow').innerHTML = '';
  document.getElementById('addImages').value = '';
  newImages = [];

  msg.style.color = 'var(--pink-deep)';
  msg.textContent = `✦ ${name} added successfully!`;
  setTimeout(() => msg.textContent = '', 3000);
}

// ─── EDIT / DELETE ─────────────────────────────
function renderEditList() {
  const list = document.getElementById('editProductList');
  products = getProducts();

  if (products.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-style:italic;padding:24px 0;">No products yet.</p>';
    return;
  }

  list.innerHTML = products.map((p, i) => {
    const thumb = p.images && p.images[0]
      ? `<div class="product-list-thumb"><img src="${p.images[0]}" /></div>`
      : `<div class="product-list-thumb">🌸</div>`;
    return `
      <div class="product-list-item">
        ${thumb}
        <div class="product-list-info">
          <div class="product-list-name">${p.name}</div>
          <div class="product-list-price">${p.price}</div>
        </div>
        <div class="product-list-actions">
          <button class="edit-btn" onclick="openEditModal('${p.id}')">✎</button>
          <button class="delete-btn" onclick="deleteProduct('${p.id}')">🗑</button>
        </div>
      </div>`;
  }).join('');
}

function deleteProduct(id) {
  if (!confirm('Delete this perfume? This cannot be undone.')) return;
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  if (currentIndex >= products.length) currentIndex = Math.max(0, products.length - 1);
  renderCarousel();
  renderEditList();
}

// ─── EDIT MODAL ────────────────────────────────
let editImages = [];

function openEditModal(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById('editId').value   = product.id;
  document.getElementById('editName').value  = product.name;
  document.getElementById('editPrice').value = product.price;
  document.getElementById('editDesc').value  = product.desc || '';
  editImages = [...(product.images || [])];
  renderImagePreviews('editImagePreviewRow', editImages, 'edit');
  document.getElementById('editMsg').textContent = '';
  document.getElementById('editProductModal').classList.add('open');
}

function closeEditModal() {
  document.getElementById('editProductModal').classList.remove('open');
}

function handleEditImageUpload(event) {
  const files = Array.from(event.target.files);
  const remaining = 5 - editImages.length;
  files.slice(0, remaining).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      editImages.push(e.target.result);
      renderImagePreviews('editImagePreviewRow', editImages, 'edit');
    };
    reader.readAsDataURL(file);
  });
}

function saveEdit() {
  const id    = document.getElementById('editId').value;
  const name  = document.getElementById('editName').value.trim();
  const price = document.getElementById('editPrice').value.trim();
  const desc  = document.getElementById('editDesc').value.trim();
  const msg   = document.getElementById('editMsg');

  if (!name || !price) {
    msg.style.color = '#e53935';
    msg.textContent = 'Name and price are required.';
    return;
  }

  products = products.map(p => p.id === id
    ? { ...p, name, price, desc, images: [...editImages] }
    : p
  );
  saveProducts(products);
  renderCarousel();
  renderEditList();
  closeEditModal();

  // Show flash in manager panel
  const editMsg2 = document.getElementById('editMsg');
  if (editMsg2) { editMsg2.textContent = ''; }
}

// ─── SETTINGS ──────────────────────────────────
function loadSettingsIntoForm() {
  const s = getSettings();
  const waInput = document.getElementById('waNumber');
  const nameInput = document.getElementById('storeName');
  if (waInput)   waInput.value   = s.waNumber   || '';
  if (nameInput) nameInput.value = s.storeName  || '';
}

function saveSettings() {
  const waNumber  = document.getElementById('waNumber').value.trim().replace(/\D/g, '');
  const storeName = document.getElementById('storeName').value.trim();
  const msg = document.getElementById('settingsMsg');

  if (!waNumber) {
    msg.style.color = '#e53935';
    msg.textContent = 'Please enter a valid WhatsApp number.';
    return;
  }

  saveSettingsData({ waNumber, storeName });

  // Update store name in UI
  if (storeName) {
    document.querySelectorAll('.logo-text, .footer-brand').forEach(el => {
      el.textContent = storeName;
    });
  }

  // Re-render cards to update WA links
  renderCarousel();

  msg.style.color = 'var(--pink-deep)';
  msg.textContent = '✦ Settings saved!';
  setTimeout(() => msg.textContent = '', 3000);
}

// ─── KEYBOARD SUPPORT ──────────────────────────
document.addEventListener('keydown', e => {
  if (document.getElementById('loginModal').classList.contains('open')) {
    if (e.key >= '0' && e.key <= '9') keyPress(e.key);
    if (e.key === 'Backspace') keyDelete();
    if (e.key === 'Escape') closeLoginModal();
  } else if (document.getElementById('managerPanel').classList.contains('open')) {
    if (e.key === 'Escape') closeManagerPanel();
  } else if (document.getElementById('editProductModal').classList.contains('open')) {
    if (e.key === 'Escape') closeEditModal();
  } else {
    if (e.key === 'ArrowLeft')  slide(-1);
    if (e.key === 'ArrowRight') slide(1);
  }
});
