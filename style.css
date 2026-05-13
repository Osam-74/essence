/* ===========================================================
   SCENT & SOUL — app.js
   Firebase · T9 Keypad · Carousel · Sales · Chart · PWA
   =========================================================== */

// ─── FIREBASE CONFIG ─────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAEe5kMU-hLtgLRgM8PTHPqr3deTtGbCcw",
  authDomain: "essence-c7eda.firebaseapp.com",
  projectId: "essence-c7eda",
  storageBucket: "essence-c7eda.firebasestorage.app",
  messagingSenderId: "146684282226",
  appId: "1:146684282226:web:c72ca354f2cd017f66c9eb",
  measurementId: "G-E77F6EJE30"
};

firebase.initializeApp(firebaseConfig);
const db      = firebase.firestore();
const storage = firebase.storage();

// Firestore collections
const COL_PRODUCTS = 'products';
const COL_SALES    = 'sales';
const COL_SETTINGS = 'settings';
const SETTINGS_DOC = 'main';

// ─── T9 KEYPAD STATE ──────────────────────────────────────────
/*
  Password: ohtun03ola
  T9 layout:
    1      | 2=ABC | 3=DEF
    4=GHI  | 5=JKL | 6=MNO
    7=PQRS | 8=TUV | 9=WXYZ
    CLR    | 0=+   | ⌫

  To type "o": press 6 three times  → m,n,o  → o (3rd)
  To type "h": press 4 twice        → g,h    → h (2nd)
  To type "t": press 8 once         → t      → t (1st)
  To type "u": press 8 twice        → t,u    → u (2nd)
  To type "n": press 6 twice        → m,n    → n (2nd)
  To type "0": press 0 once         → 0
  To type "3": press 3 four times   → d,e,f,3 → 3 (4th)
  To type "o": press 6 three times  → o
  To type "l": press 5 three times  → j,k,l  → l (3rd)
  To type "a": press 2 once         → a      → a (1st)
*/
const T9_MAP = {
  '1': ['1'],
  '2': ['a','b','c','2'],
  '3': ['d','e','f','3'],
  '4': ['g','h','i','4'],
  '5': ['j','k','l','5'],
  '6': ['m','n','o','6'],
  '7': ['p','q','r','s','7'],
  '8': ['t','u','v','8'],
  '9': ['w','x','y','z','9'],
  '0': ['0','+'],
};

const PASSWORD = 'ohtun03ola'; // target string
let t9Typed     = [];   // confirmed characters
let t9PendingKey = null; // which key is being multi-tapped
let t9PendingIdx = 0;   // current cycle index within that key
let t9Timer      = null; // timeout to commit pending char

const T9_DELAY = 900; // ms idle before confirming character

function t9Press(key) {
  clearTimeout(t9Timer);

  const chars = T9_MAP[key];
  if (!chars) return;

  if (t9PendingKey === key) {
    // Same key: cycle to next character
    t9PendingIdx = (t9PendingIdx + 1) % chars.length;
  } else {
    // Different key: commit pending first
    if (t9PendingKey !== null) {
      commitPending();
    }
    t9PendingKey = key;
    t9PendingIdx = 0;
  }

  // Highlight the active key button
  document.querySelectorAll('.key-btn').forEach(b => b.classList.remove('t9-active'));
  const keyEl = document.getElementById(`key${key}`);
  if (keyEl) keyEl.classList.add('t9-active');

  updateT9Display();

  // Auto-commit after idle delay
  t9Timer = setTimeout(() => {
    commitPending();
    updateT9Display();
  }, T9_DELAY);
}

function commitPending() {
  if (t9PendingKey === null) return;
  const chars = T9_MAP[t9PendingKey];
  t9Typed.push(chars[t9PendingIdx]);
  t9PendingKey = null;
  t9PendingIdx = 0;
  document.querySelectorAll('.key-btn').forEach(b => b.classList.remove('t9-active'));

  // Auto-check password once length matches
  if (t9Typed.length >= PASSWORD.length) {
    setTimeout(checkT9Password, 100);
  }
}

function t9Delete() {
  clearTimeout(t9Timer);
  if (t9PendingKey !== null) {
    t9PendingKey = null;
    t9PendingIdx = 0;
    document.querySelectorAll('.key-btn').forEach(b => b.classList.remove('t9-active'));
  } else {
    t9Typed.pop();
  }
  document.getElementById('loginError').textContent = '';
  updateT9Display();
}

function t9Clear() {
  clearTimeout(t9Timer);
  t9Typed = [];
  t9PendingKey = null;
  t9PendingIdx = 0;
  document.querySelectorAll('.key-btn').forEach(b => b.classList.remove('t9-active'));
  document.getElementById('loginError').textContent = '';
  updateT9Display();
}

function updateT9Display() {
  const typedEl   = document.getElementById('passcodeTyped');
  const pendingEl = document.getElementById('passcodePending');
  if (!typedEl) return;

  // Show typed chars as dots for security, but reveal pending char
  typedEl.textContent = t9Typed.map(() => '•').join('');

  if (t9PendingKey !== null) {
    const chars = T9_MAP[t9PendingKey];
    pendingEl.textContent = chars[t9PendingIdx];
  } else {
    pendingEl.textContent = '';
  }
}

function checkT9Password() {
  // Commit any pending character first
  if (t9PendingKey !== null) {
    clearTimeout(t9Timer);
    commitPending();
    updateT9Display();
  }

  const entered = t9Typed.join('');
  if (entered === PASSWORD) {
    closeLoginModal();
    openManagerPanel();
  } else {
    document.getElementById('loginError').textContent = 'Incorrect passcode. Try again.';
    const row = document.querySelector('.passcode-input-row');
    if (row) {
      row.classList.remove('shake');
      void row.offsetWidth;
      row.classList.add('shake');
    }
    setTimeout(() => {
      t9Typed = [];
      t9PendingKey = null;
      updateT9Display();
      document.getElementById('loginError').textContent = '';
    }, 1200);
  }
}

// ─── LOGIN MODAL ─────────────────────────────────────────────
function openLoginModal() {
  t9Typed = []; t9PendingKey = null; t9PendingIdx = 0;
  clearTimeout(t9Timer);
  document.querySelectorAll('.key-btn').forEach(b => b.classList.remove('t9-active'));
  document.getElementById('loginError').textContent = '';
  updateT9Display();
  document.getElementById('loginModal').classList.add('open');
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('open');
  clearTimeout(t9Timer);
  t9Typed = []; t9PendingKey = null;
  updateT9Display();
}

// ─── CAROUSEL STATE ──────────────────────────────────────────
let currentIndex = 0;
let products     = [];
let touchStartX  = 0;
let touchEndX    = 0;

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Dynamic year
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW:', e));
  }

  // PWA install prompt
  setupInstallPrompt();

  // Load settings, then products
  await loadSettingsFromFirebase();
  await loadProductsFromFirebase();
  setupTouchSwipe();
  scheduleReminders();
});

// ─── FIREBASE: SETTINGS ──────────────────────────────────────
async function loadSettingsFromFirebase() {
  try {
    const doc = await db.collection(COL_SETTINGS).doc(SETTINGS_DOC).get();
    if (doc.exists) {
      const s = doc.data();
      applySettings(s);
    }
  } catch (e) {
    // offline fallback to localStorage
    const s = JSON.parse(localStorage.getItem('ss_settings') || '{}');
    applySettings(s);
  }
}

function applySettings(s) {
  if (s.storeName) {
    document.getElementById('navStoreName').textContent  = s.storeName;
    document.getElementById('footerStoreName').textContent = s.storeName;
  }
}

async function getSettingsData() {
  try {
    const doc = await db.collection(COL_SETTINGS).doc(SETTINGS_DOC).get();
    return doc.exists ? doc.data() : {};
  } catch {
    return JSON.parse(localStorage.getItem('ss_settings') || '{}');
  }
}

// ─── FIREBASE: PRODUCTS ──────────────────────────────────────
async function loadProductsFromFirebase() {
  try {
    const snap = await db.collection(COL_PRODUCTS).orderBy('createdAt', 'asc').get();
    products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    // Fallback to localStorage if offline
    products = JSON.parse(localStorage.getItem('ss_products') || '[]');
  }
  renderCarousel();
}

// ─── CAROUSEL ────────────────────────────────────────────────
function renderCarousel() {
  const track   = document.getElementById('carouselTrack');
  const dots    = document.getElementById('dotsContainer');
  const empty   = document.getElementById('emptyState');
  const section = document.getElementById('carouselSection');
  const hint    = document.getElementById('swipeHint');

  track.innerHTML = '';
  dots.innerHTML  = '';

  if (!products.length) {
    empty.style.display   = 'block';
    section.style.display = 'none';
    if (hint) hint.style.display = 'none';
    return;
  }

  empty.style.display   = 'none';
  section.style.display = 'block';
  if (hint) hint.style.display = products.length > 1 ? 'block' : 'none';

  products.forEach((product, i) => {
    track.appendChild(createCard(product, i));
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

  const images = product.images || [];
  let imgHTML = '';

  if (images.length > 0) {
    const slides = images.map(src =>
      `<img class="card-image-slide" src="${src}" alt="${esc(product.name)}" loading="lazy"/>`
    ).join('');
    const imgDots = images.length > 1
      ? `<div class="card-img-dots">${images.map((_,i) =>
          `<span class="card-img-dot${i===0?' active':''}" onclick="imgSlide(event,${index},${i})"></span>`
        ).join('')}</div>` : '';
    const prev = images.length > 1 ? `<button class="card-img-prev" onclick="imgSlide(event,${index},-1)">&#8249;</button>` : '';
    const next = images.length > 1 ? `<button class="card-img-next" onclick="imgSlide(event,${index},1)">&#8250;</button>` : '';
    imgHTML = `<div class="card-image-slider"><div class="card-image-slides" id="imgSlides${index}">${slides}</div>${prev}${next}${imgDots}</div>`;
  } else {
    imgHTML = `<div class="card-image-slider"><div class="card-image-placeholder">🌸<span>No image yet</span></div></div>`;
  }

  // WA link built async from settings — use a placeholder and update
  const waLink = `#wa-${product.id}`;

  card.innerHTML = `
    ${imgHTML}
    <div class="card-body">
      <h2 class="card-name">${esc(product.name)}</h2>
      ${product.desc ? `<p class="card-desc">${esc(product.desc)}</p>` : ''}
      <p class="card-price">${esc(product.price)}</p>
      <a href="${waLink}" class="card-cta" id="cta-${product.id}" target="_blank" rel="noopener">
        💬 I'm Interested in This
      </a>
    </div>`;

  // Update WA link with settings
  getSettingsData().then(s => {
    const waNumber = s.waNumber || '2348000000000';
    const msg = encodeURIComponent(
      `Hey! I'd love to know more about the *${product.name}* perfume. I'm interested! 🌸`
    );
    const link = card.querySelector(`#cta-${product.id}`);
    if (link) link.href = `https://wa.me/${waNumber}?text=${msg}`;
  });

  card.addEventListener('click', () => {
    const idx = parseInt(card.dataset.index);
    if (idx !== currentIndex) goTo(idx);
  });

  return card;
}

const cardImgIndex = {};

function imgSlide(event, cardIndex, val) {
  event.stopPropagation();
  const product = products[cardIndex];
  const images  = product.images || [];
  if (images.length <= 1) return;
  if (cardImgIndex[cardIndex] === undefined) cardImgIndex[cardIndex] = 0;
  if (val === -1 || val === 1) {
    cardImgIndex[cardIndex] = (cardImgIndex[cardIndex] + val + images.length) % images.length;
  } else {
    cardImgIndex[cardIndex] = val;
  }
  const slides = document.getElementById(`imgSlides${cardIndex}`);
  if (slides) slides.style.transform = `translateX(-${cardImgIndex[cardIndex] * 100}%)`;
  const cardEl = document.querySelector(`.perfume-card[data-index="${cardIndex}"]`);
  if (cardEl) cardEl.querySelectorAll('.card-img-dot').forEach((d,i) => d.classList.toggle('active', i === cardImgIndex[cardIndex]));
}

function positionCarousel(animate = true) {
  const track = document.getElementById('carouselTrack');
  const cards = track.querySelectorAll('.perfume-card');
  if (!cards.length) return;

  const cardWidth = cards[0].offsetWidth;
  const gap = 20;

  cards.forEach((card, i) => {
    card.classList.remove('active', 'adjacent');
    if (i === currentIndex) card.classList.add('active');
    else if (Math.abs(i - currentIndex) === 1) card.classList.add('adjacent');
  });

  const offset = -(currentIndex * (cardWidth + gap));
  if (!animate) track.style.transition = 'none';
  track.style.transform = `translateX(${offset}px)`;
  if (!animate) { track.offsetHeight; track.style.transition = ''; }

  document.querySelectorAll('.dot-item').forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  const left  = document.getElementById('arrowLeft');
  const right = document.getElementById('arrowRight');
  if (left)  left.disabled  = currentIndex === 0;
  if (right) right.disabled = currentIndex === products.length - 1;
}

function slide(dir) {
  const ni = currentIndex + dir;
  if (ni < 0 || ni >= products.length) return;
  currentIndex = ni;
  positionCarousel();
}

function goTo(index) {
  if (index < 0 || index >= products.length) return;
  currentIndex = index;
  positionCarousel();
}

function setupTouchSwipe() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) slide(diff > 0 ? 1 : -1);
  }, { passive: true });
}

// ─── MANAGER PANEL ───────────────────────────────────────────
function openManagerPanel() {
  document.getElementById('managerPanel').classList.add('open');
  switchTab('add');
}

function closeManagerPanel() {
  document.getElementById('managerPanel').classList.remove('open');
}

function switchTab(tab) {
  const tabs = ['add','edit','sales','chart','settings'];
  tabs.forEach(t => {
    document.getElementById(`tabContent${cap(t)}`).classList.toggle('hidden', t !== tab);
    document.getElementById(`tab${cap(t)}`).classList.toggle('active', t === tab);
  });
  if (tab === 'edit')     renderEditList();
  if (tab === 'sales')    { populateSalePerfumeSelect(); renderSalesList(); setTodayDate(); }
  if (tab === 'chart')    populateChartYear().then(renderChart);
  if (tab === 'settings') loadSettingsIntoForm();
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function esc(s) { return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ─── ADD PRODUCT ─────────────────────────────────────────────
let newImages = [];

function handleImageUpload(event) {
  const files = Array.from(event.target.files);
  files.slice(0, 5 - newImages.length).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => { newImages.push(e.target.result); renderImagePreviews('imagePreviewRow', newImages, 'add'); };
    reader.readAsDataURL(file);
  });
}

function renderImagePreviews(id, images, mode) {
  document.getElementById(id).innerHTML = images.map((src, i) => `
    <div class="img-preview-wrap">
      <img src="${src}"/>
      <button class="img-remove" onclick="removeImage(${i},'${mode}')">✕</button>
    </div>`).join('');
}

function removeImage(idx, mode) {
  if (mode === 'add') { newImages.splice(idx, 1); renderImagePreviews('imagePreviewRow', newImages, 'add'); }
  else { editImages.splice(idx, 1); renderImagePreviews('editImagePreviewRow', editImages, 'edit'); }
}

async function addProduct() {
  const name  = document.getElementById('addName').value.trim();
  const price = document.getElementById('addPrice').value.trim();
  const desc  = document.getElementById('addDesc').value.trim();
  const msg   = document.getElementById('addMsg');

  if (!name || !price) { showMsg('addMsg', 'Please enter at least a name and price.', 'error'); return; }

  showMsg('addMsg', 'Saving…', 'info');
  try {
    // Upload images to Firebase Storage
    const uploadedUrls = await uploadImagesToStorage(newImages, `products/${Date.now()}`);

    const docRef = await db.collection(COL_PRODUCTS).add({
      name, price, desc,
      images: uploadedUrls,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    products.push({ id: docRef.id, name, price, desc, images: uploadedUrls });
    renderCarousel();

    document.getElementById('addName').value = '';
    document.getElementById('addPrice').value = '';
    document.getElementById('addDesc').value = '';
    document.getElementById('imagePreviewRow').innerHTML = '';
    document.getElementById('addImages').value = '';
    newImages = [];
    showMsg('addMsg', `✦ ${name} added!`, 'success');
  } catch (e) {
    showMsg('addMsg', 'Error saving product. Check connection.', 'error');
    console.error(e);
  }
}

// Upload base64 images to Firebase Storage, returns array of download URLs
async function uploadImagesToStorage(base64Arr, pathPrefix) {
  if (!base64Arr.length) return [];
  const urls = [];
  for (let i = 0; i < base64Arr.length; i++) {
    try {
      const b64 = base64Arr[i];
      const mimeMatch = b64.match(/data:([^;]+);base64,/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const blob = await (await fetch(b64)).blob();
      const ref = storage.ref(`${pathPrefix}_${i}.jpg`);
      await ref.put(blob, { contentType: mime });
      const url = await ref.getDownloadURL();
      urls.push(url);
    } catch (e) {
      // If storage fails (e.g. rules), fall back to keeping the base64
      urls.push(base64Arr[i]);
    }
  }
  return urls;
}

// ─── EDIT/DELETE PRODUCTS ────────────────────────────────────
async function renderEditList() {
  const list = document.getElementById('editProductList');
  if (!products.length) {
    list.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-style:italic;padding:24px 0;">No products yet.</p>';
    return;
  }
  list.innerHTML = products.map(p => {
    const thumb = p.images && p.images[0]
      ? `<div class="product-list-thumb"><img src="${p.images[0]}"/></div>`
      : `<div class="product-list-thumb">🌸</div>`;
    return `<div class="product-list-item">${thumb}
      <div class="product-list-info">
        <div class="product-list-name">${esc(p.name)}</div>
        <div class="product-list-price">${esc(p.price)}</div>
      </div>
      <div class="product-list-actions">
        <button class="edit-btn" onclick="openEditModal('${p.id}')">✎</button>
        <button class="delete-btn" onclick="deleteProduct('${p.id}')">🗑</button>
      </div></div>`;
  }).join('');
}

async function deleteProduct(id) {
  if (!confirm('Delete this perfume? This cannot be undone.')) return;
  try {
    await db.collection(COL_PRODUCTS).doc(id).delete();
    products = products.filter(p => p.id !== id);
    if (currentIndex >= products.length) currentIndex = Math.max(0, products.length - 1);
    renderCarousel();
    renderEditList();
  } catch (e) { alert('Error deleting. Check connection.'); }
}

let editImages = [];

function openEditModal(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  document.getElementById('editId').value    = product.id;
  document.getElementById('editName').value  = product.name;
  document.getElementById('editPrice').value = product.price;
  document.getElementById('editDesc').value  = product.desc || '';
  editImages = [...(product.images || [])];
  renderImagePreviews('editImagePreviewRow', editImages, 'edit');
  document.getElementById('editMsg').textContent = '';
  document.getElementById('editProductModal').classList.add('open');
}

function closeEditModal() { document.getElementById('editProductModal').classList.remove('open'); }

function handleEditImageUpload(event) {
  const files = Array.from(event.target.files);
  files.slice(0, 5 - editImages.length).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => { editImages.push(e.target.result); renderImagePreviews('editImagePreviewRow', editImages, 'edit'); };
    reader.readAsDataURL(file);
  });
}

async function saveEdit() {
  const id    = document.getElementById('editId').value;
  const name  = document.getElementById('editName').value.trim();
  const price = document.getElementById('editPrice').value.trim();
  const desc  = document.getElementById('editDesc').value.trim();

  if (!name || !price) { showMsg('editMsg', 'Name and price are required.', 'error'); return; }
  showMsg('editMsg', 'Saving…', 'info');

  try {
    // Upload any new base64 images (existing URLs stay as-is)
    const processedImages = [];
    for (let i = 0; i < editImages.length; i++) {
      if (editImages[i].startsWith('data:')) {
        const urls = await uploadImagesToStorage([editImages[i]], `products/${id}_edit_${i}`);
        processedImages.push(urls[0]);
      } else {
        processedImages.push(editImages[i]);
      }
    }

    await db.collection(COL_PRODUCTS).doc(id).update({ name, price, desc, images: processedImages });
    products = products.map(p => p.id === id ? { ...p, name, price, desc, images: processedImages } : p);
    renderCarousel();
    renderEditList();
    closeEditModal();
  } catch (e) { showMsg('editMsg', 'Error saving. Check connection.', 'error'); console.error(e); }
}

// ─── SETTINGS ────────────────────────────────────────────────
async function loadSettingsIntoForm() {
  const s = await getSettingsData();
  if (document.getElementById('waNumber'))  document.getElementById('waNumber').value  = s.waNumber  || '';
  if (document.getElementById('storeName')) document.getElementById('storeName').value = s.storeName || '';
}

async function saveSettings() {
  const waNumber  = document.getElementById('waNumber').value.trim().replace(/\D/g, '');
  const storeName = document.getElementById('storeName').value.trim();
  if (!waNumber) { showMsg('settingsMsg', 'Please enter a valid WhatsApp number.', 'error'); return; }

  try {
    await db.collection(COL_SETTINGS).doc(SETTINGS_DOC).set({ waNumber, storeName }, { merge: true });
    // localStorage fallback
    localStorage.setItem('ss_settings', JSON.stringify({ waNumber, storeName }));
    applySettings({ waNumber, storeName });
    renderCarousel();
    showMsg('settingsMsg', '✦ Settings saved!', 'success');
  } catch (e) {
    // Save locally if offline
    localStorage.setItem('ss_settings', JSON.stringify({ waNumber, storeName }));
    applySettings({ waNumber, storeName });
    showMsg('settingsMsg', '✦ Saved locally (offline).', 'success');
  }
}

// ─── SALES RECORDING ─────────────────────────────────────────
function setTodayDate() {
  const d = document.getElementById('saleDate');
  if (d && !d.value) d.value = new Date().toISOString().split('T')[0];
}

function populateSalePerfumeSelect() {
  const sel = document.getElementById('salePerfume');
  const cur = sel.value;
  sel.innerHTML = '<option value="">— Select a perfume —</option>';
  products.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    sel.appendChild(opt);
  });
  sel.value = cur;
}

function toggleCredit(show) {
  document.getElementById('creditSection').style.display = show ? 'block' : 'none';
}

function calcBalance() {
  const selling = parseFloat(document.getElementById('saleSelling').value) || 0;
  const paid    = parseFloat(document.getElementById('saleAmtPaid').value) || 0;
  document.getElementById('saleBalance').value = Math.max(0, selling - paid);
}

document.addEventListener('DOMContentLoaded', () => {
  // Wire up balance calc
  setTimeout(() => {
    const inp = document.getElementById('saleSelling');
    if (inp) inp.addEventListener('input', calcBalance);
  }, 500);
});

async function recordSale() {
  const perfumeId  = document.getElementById('salePerfume').value;
  const cost       = parseFloat(document.getElementById('saleCost').value) || 0;
  const selling    = parseFloat(document.getElementById('saleSelling').value) || 0;
  const buyer      = document.getElementById('saleBuyer').value.trim();
  const date       = document.getElementById('saleDate').value;
  const payType    = document.querySelector('input[name="payType"]:checked').value;
  const notes      = document.getElementById('saleNotes').value.trim();

  if (!perfumeId || !selling || !date) {
    showMsg('saleMsg', 'Please fill in: perfume, selling price, and date.', 'error'); return;
  }

  const product = products.find(p => p.id === perfumeId);
  const saleData = {
    perfumeId,
    perfumeName: product ? product.name : 'Unknown',
    cost,
    selling,
    profit: selling - cost,
    buyer,
    date,
    payType,
    notes,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (payType === 'credit') {
    saleData.amtPaid  = parseFloat(document.getElementById('saleAmtPaid').value) || 0;
    saleData.balance  = parseFloat(document.getElementById('saleBalance').value) || 0;
    saleData.dueDate  = document.getElementById('saleDueDate').value;
    saleData.buyerPhone = document.getElementById('saleBuyerPhone').value.trim();
  }

  showMsg('saleMsg', 'Saving…', 'info');
  try {
    await db.collection(COL_SALES).add(saleData);
    showMsg('saleMsg', '✦ Sale recorded!', 'success');
    resetSaleForm();
    renderSalesList();
  } catch (e) {
    showMsg('saleMsg', 'Error saving sale. Check connection.', 'error'); console.error(e);
  }
}

function resetSaleForm() {
  document.getElementById('salePerfume').value = '';
  document.getElementById('saleCost').value    = '';
  document.getElementById('saleSelling').value = '';
  document.getElementById('saleBuyer').value   = '';
  document.getElementById('saleNotes').value   = '';
  document.getElementById('saleAmtPaid').value = '';
  document.getElementById('saleBalance').value = '';
  document.getElementById('saleDueDate').value = '';
  document.getElementById('saleBuyerPhone').value = '';
  document.querySelector('input[name="payType"][value="paid"]').checked = true;
  document.getElementById('creditSection').style.display = 'none';
  setTodayDate();
}

function toggleSalesFilter() {
  const box = document.getElementById('salesFilterBox');
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function clearFilter() {
  document.getElementById('filterFrom').value = '';
  document.getElementById('filterTo').value   = '';
  renderSalesList();
}

async function renderSalesList() {
  const listEl    = document.getElementById('salesList');
  const alertEl   = document.getElementById('creditAlertBox');
  const fromVal   = document.getElementById('filterFrom').value;
  const toVal     = document.getElementById('filterTo').value;

  listEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:12px 0;">Loading…</p>';

  try {
    let query = db.collection(COL_SALES).orderBy('date', 'desc');
    if (fromVal) query = query.where('date', '>=', fromVal);
    if (toVal)   query = query.where('date', '<=', toVal);
    const snap = await query.get();
    const sales = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Credit alerts
    const today = new Date().toISOString().split('T')[0];
    const overdue = sales.filter(s => s.payType === 'credit' && s.balance > 0 && s.dueDate && s.dueDate <= today);
    const upcoming = sales.filter(s => {
      if (s.payType !== 'credit' || s.balance <= 0 || !s.dueDate || s.dueDate <= today) return false;
      const diff = (new Date(s.dueDate) - new Date()) / 86400000;
      return diff <= 3;
    });

    alertEl.innerHTML = '';
    [...overdue, ...upcoming].forEach(s => {
      const isOverdue = s.dueDate <= today;
      alertEl.innerHTML += `<div class="credit-alert-item">
        ⚠️ <div><b>${esc(s.buyer || 'Unknown')}</b> owes ₦${(s.balance||0).toLocaleString()} for <em>${esc(s.perfumeName)}</em>
        — ${isOverdue ? `<span style="color:var(--danger)">OVERDUE</span>` : `due ${s.dueDate}`}</div>
      </div>`;
    });

    if (!sales.length) {
      listEl.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-style:italic;padding:20px 0;">No sales recorded yet.</p>';
      return;
    }

    listEl.innerHTML = sales.map(s => {
      const isPaid    = s.payType === 'paid';
      const isOverdue = !isPaid && s.dueDate && s.dueDate <= today && s.balance > 0;
      const badgeClass = isPaid ? 'badge-paid' : (isOverdue ? 'badge-overdue' : 'badge-credit');
      const badgeText  = isPaid ? 'Paid' : (isOverdue ? 'Overdue' : 'Credit');

      return `<div class="sale-item">
        <div class="sale-item-header">
          <span class="sale-item-name">${esc(s.perfumeName)}</span>
          <span class="sale-item-date">${s.date || ''}</span>
        </div>
        ${s.buyer ? `<div class="sale-item-row"><span>Buyer</span><span>${esc(s.buyer)}</span></div>` : ''}
        <div class="sale-item-row"><span>Cost</span><span>₦${(s.cost||0).toLocaleString()}</span></div>
        <div class="sale-item-row"><span>Sold for</span><span>₦${(s.selling||0).toLocaleString()}</span></div>
        <div class="sale-item-row"><span>Profit</span><span class="sale-item-profit">₦${(s.profit||0).toLocaleString()}</span></div>
        ${!isPaid ? `<div class="sale-item-row"><span>Balance</span><span style="color:var(--warn)">₦${(s.balance||0).toLocaleString()}</span></div>` : ''}
        ${s.dueDate && !isPaid ? `<div class="sale-item-row"><span>Due</span><span>${s.dueDate}</span></div>` : ''}
        ${s.notes ? `<div class="sale-item-row"><span>Notes</span><span>${esc(s.notes)}</span></div>` : ''}
        <span class="sale-badge ${badgeClass}">${badgeText}</span>
        <button class="sale-delete-btn" onclick="deleteSale('${s.id}')">Delete</button>
      </div>`;
    }).join('');
  } catch (e) {
    listEl.innerHTML = '<p style="color:var(--danger);font-size:12px;padding:12px 0;">Could not load sales. Check connection.</p>';
  }
}

async function deleteSale(id) {
  if (!confirm('Delete this sale record?')) return;
  try {
    await db.collection(COL_SALES).doc(id).delete();
    renderSalesList();
  } catch (e) { alert('Error deleting.'); }
}

// ─── CHART ───────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

async function populateChartYear() {
  const sel = document.getElementById('chartYear');
  const thisYear = new Date().getFullYear();
  // Offer last 3 years
  sel.innerHTML = '';
  for (let y = thisYear; y >= thisYear - 2; y--) {
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = y;
    sel.appendChild(opt);
  }
  sel.value = thisYear;
}

async function renderChart() {
  const year   = parseInt(document.getElementById('chartYear').value);
  const metric = document.getElementById('chartMetric').value;
  const canvas  = document.getElementById('salesChart');
  const summaryEl = document.getElementById('chartSummary');

  try {
    const snap = await db.collection(COL_SALES)
      .where('date', '>=', `${year}-01-01`)
      .where('date', '<=', `${year}-12-31`)
      .get();
    const sales = snap.docs.map(d => d.data());

    // Aggregate by month
    const monthData = Array(12).fill(0);
    let totalRevenue = 0, totalProfit = 0, totalUnits = 0;

    sales.forEach(s => {
      const m = parseInt((s.date || '').split('-')[1]) - 1;
      if (m >= 0 && m < 12) {
        monthData[m] += metric === 'revenue' ? (s.selling||0)
                      : metric === 'profit'  ? (s.profit||0)
                      : 1;
      }
      totalRevenue += s.selling || 0;
      totalProfit  += s.profit  || 0;
      totalUnits   ++;
    });

    drawBarChart(canvas, MONTHS, monthData, metric);

    summaryEl.innerHTML = `
      <div class="chart-stat"><div class="chart-stat-label">Revenue</div><div class="chart-stat-value">₦${totalRevenue.toLocaleString()}</div></div>
      <div class="chart-stat"><div class="chart-stat-label">Profit</div><div class="chart-stat-value">₦${totalProfit.toLocaleString()}</div></div>
      <div class="chart-stat"><div class="chart-stat-label">Units</div><div class="chart-stat-value">${totalUnits}</div></div>`;
  } catch (e) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    summaryEl.innerHTML = '<p style="color:var(--danger);font-size:12px;">Could not load chart data.</p>';
  }
}

function drawBarChart(canvas, labels, data, metric) {
  const ctx    = canvas.getContext('2d');
  const W = canvas.width  = canvas.parentElement.clientWidth - 32;
  const H = canvas.height = 200;
  const PAD = { top: 20, right: 10, bottom: 36, left: metric === 'count' ? 36 : 64 };
  const cw = W - PAD.left - PAD.right;
  const ch = H - PAD.top  - PAD.bottom;

  ctx.clearRect(0, 0, W, H);

  const max = Math.max(...data, 1);
  const barW = cw / labels.length * 0.6;
  const gap  = cw / labels.length;

  // Grid lines
  ctx.strokeStyle = 'rgba(233,30,140,0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + ch - (i / 4) * ch;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + cw, y); ctx.stroke();
    ctx.fillStyle = 'rgba(156,100,128,0.6)';
    ctx.font = '9px Jost, sans-serif'; ctx.textAlign = 'right';
    const val = metric === 'count' ? Math.round(max * i / 4) : `₦${Math.round(max * i / 4).toLocaleString()}`;
    ctx.fillText(val, PAD.left - 4, y + 3);
  }

  // Bars
  data.forEach((v, i) => {
    const barH = (v / max) * ch;
    const x    = PAD.left + i * gap + (gap - barW) / 2;
    const y    = PAD.top + ch - barH;

    // Gradient
    const grad = ctx.createLinearGradient(x, y, x, y + barH);
    grad.addColorStop(0, '#e91e8c');
    grad.addColorStop(1, '#f8bbd9');
    ctx.fillStyle = v > 0 ? grad : 'rgba(233,30,140,0.07)';
    ctx.beginPath();
    ctx.roundRect(x, y, barW, Math.max(barH, 2), 4);
    ctx.fill();

    // Label
    ctx.fillStyle = 'rgba(61,26,40,0.7)';
    ctx.font = '9px Jost, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], PAD.left + i * gap + gap / 2, H - 6);
  });
}

// ─── NOTIFICATIONS / REMINDERS ───────────────────────────────
async function requestNotificationPermission() {
  const btn = document.getElementById('notifBtn');
  if (!('Notification' in window)) {
    showMsg('notifMsg', 'Notifications not supported on this browser.', 'error'); return;
  }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    showMsg('notifMsg', '✦ Notifications enabled!', 'success');
    if (btn) btn.textContent = '🔔 Notifications On';
  } else {
    showMsg('notifMsg', 'Permission denied. Enable in browser settings.', 'error');
  }
}

async function scheduleReminders() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const today = new Date().toISOString().split('T')[0];
    const snap = await db.collection(COL_SALES)
      .where('payType', '==', 'credit')
      .where('dueDate', '<=', today)
      .get();
    const overdues = snap.docs.map(d => d.data()).filter(s => s.balance > 0);
    if (overdues.length) {
      new Notification('💳 Scent & Soul — Payment Reminder', {
        body: `${overdues.length} credit sale(s) have overdue balances. Open the app to review.`,
        icon: 'icons/icon-192.png',
        tag: 'credit-reminder'
      });
    }
  } catch (e) { /* silently fail */ }
}

// ─── PWA INSTALL ─────────────────────────────────────────────
let deferredInstallPrompt = null;

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    // Show banner if not dismissed
    if (!localStorage.getItem('installDismissed')) {
      const banner = document.getElementById('installBanner');
      if (banner) {
        banner.style.display = 'flex';
        document.querySelector('.navbar').classList.add('banner-open');
      }
    }
  });

  window.addEventListener('appinstalled', () => {
    const banner = document.getElementById('installBanner');
    if (banner) banner.style.display = 'none';
    document.querySelector('.navbar').classList.remove('banner-open');
    deferredInstallPrompt = null;
  });
}

function triggerInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(result => {
    if (result.outcome === 'accepted') dismissInstall();
    deferredInstallPrompt = null;
  });
}

function dismissInstall() {
  const banner = document.getElementById('installBanner');
  if (banner) banner.style.display = 'none';
  document.querySelector('.navbar').classList.remove('banner-open');
  localStorage.setItem('installDismissed', '1');
}

// ─── HELPERS ─────────────────────────────────────────────────
function showMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.color = type === 'error' ? '#e53935' : type === 'info' ? 'var(--text-muted)' : 'var(--pink-deep)';
  if (type !== 'info') setTimeout(() => el.textContent = '', 4000);
}

// ─── KEYBOARD NAV ────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (document.getElementById('loginModal').classList.contains('open')) {
    if (e.key === 'Escape') closeLoginModal();
    // Number keys for T9
    if (/^[0-9]$/.test(e.key)) t9Press(e.key);
    if (e.key === 'Backspace') t9Delete();
  } else if (document.getElementById('managerPanel').classList.contains('open')) {
    if (e.key === 'Escape') closeManagerPanel();
  } else if (document.getElementById('editProductModal').classList.contains('open')) {
    if (e.key === 'Escape') closeEditModal();
  } else {
    if (e.key === 'ArrowLeft')  slide(-1);
    if (e.key === 'ArrowRight') slide(1);
  }
});
