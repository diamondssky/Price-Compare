document.addEventListener('DOMContentLoaded', () => {
  // EXACT URLs as provided – no modifications
  const SOURCES = [
    { name: "Flipkart", cat: "🛒 General", url: "https://www.flipkart.com/search?q=", color: "#2874F0" },
    { name: "Amazon India", cat: "🛒 General", url: "https://www.amazon.in/s?k=", color: "#FF9900" },
    { name: "Wellness Forever", cat: "💊 Pharmacy", url: "https://www.wellnessforever.com/search?q=", color: "#10B981" },
    { name: "Noble Plus", cat: "🛒 General", url: "https://nobleplus.in/?s=", color: "#EF4444" },
    { name: "1mg", cat: "💊 Pharmacy", url: "https://www.1mg.com/search/all?name=", color: "#3B82F6" },
    { name: "Nykaa", cat: "💄 Beauty", url: "https://www.nykaa.com/search/result/?q=", color: "#EC4899" },
    { name: "Apollo Pharmacy", cat: "💊 Pharmacy", url: "https://www.apollopharmacy.in/search-medicines/", color: "#0EA5E9" },
    { name: "PharmEasy", cat: "💊 Pharmacy", url: "https://pharmeasy.in/search/all?name=", color: "#00C896" },
    { name: "Netmeds", cat: "💊 Pharmacy", url: "https://www.netmeds.com/products?q=", color: "#10B981" },
    { name: "Truemeds", cat: "💊 Pharmacy", url: "https://www.truemeds.in/search/", color: "#8B5CF6" },
    { name: "JioMart", cat: "🛒 General", url: "https://www.jiomart.com/search/", color: "#0078D7" },
    { name: "Zepto", cat: "🥦 Grocery", url: "https://www.zepto.com/search?query=", color: "#B8002C" },
    { name: "Blinkit", cat: "🥦 Grocery", url: "https://blinkit.com/s/?q=", color: "#31AD2E" },
    { name: "Swiggy Instamart", cat: "🥦 Grocery", url: "https://www.swiggy.com/instamart/search?custom_back=true&query=", color: "#F56C4E" },
    { name: "DMart", cat: "🛒 General", url: "https://www.dmart.in/search?searchTerm=", color: "#8B572A" },
    { name: "Croma", cat: "📱 Electronics", url: "https://www.croma.com/searchB?q=", color: "#0047AB" }
  ];

  const sourcesGrid = document.getElementById('sourcesGrid');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const selectAllBtn = document.getElementById('selectAll');
  const deselectAllBtn = document.getElementById('deselectAll');
  const historyEl = document.getElementById('searchHistory');
  const toast = document.getElementById('toast');

  let selected = new Set();

  // Render sources
  function renderSources() {
    sourcesGrid.innerHTML = '';
    SOURCES.forEach(site => {
      const card = document.createElement('div');
      card.className = 'source-card';
      if (['Amazon India', 'Flipkart', 'Nykaa', 'PharmEasy', '1mg', 'Wellness Forever'].includes(site.name)) {
        selected.add(site.name);
        card.classList.add('selected');
      }

      card.innerHTML = `
        <div class="source-icon" style="background: linear-gradient(135deg, ${site.color}, ${darkenColor(site.color, 20)})">
          ${getInitials(site.name)}
        </div>
        <div class="source-info">
          <div class="source-name">${site.name}</div>
          <div class="source-category">${site.cat}</div>
        </div>
        <div class="checkbox ${selected.has(site.name) ? 'checked' : ''}"></div>
      `;

      card.addEventListener('click', () => {
        const isSelected = selected.has(site.name);
        if (isSelected) {
          selected.delete(site.name);
          card.classList.remove('selected');
          card.querySelector('.checkbox').classList.remove('checked');
        } else {
          selected.add(site.name);
          card.classList.add('selected');
          card.querySelector('.checkbox').classList.add('checked');
        }
      });

      sourcesGrid.appendChild(card);
    });
  }

  function getInitials(name) {
    if (name === '1mg') return '1mg';
    if (name === 'Swiggy Instamart') return 'SI';
    if (name === 'Apollo Pharmacy') return 'AP';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  function darkenColor(hex, percent) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.max(0, r - (255 * percent / 100));
    g = Math.max(0, g - (255 * percent / 100));
    b = Math.max(0, b - (255 * percent / 100));
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }

  // Search logic
  function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return showToast('Enter a product name');

    if (selected.size === 0) return showToast('Select at least one store');

    // Save to history
    let history = JSON.parse(localStorage.getItem('priceHistory') || '[]');
    history = [query, ...history.filter(h => h !== query)].slice(0, 8);
    localStorage.setItem('priceHistory', JSON.stringify(history));
    updateHistory();

    // Open tabs
    showToast(`Opening ${selected.size} tabs...`);
    setTimeout(() => {
      selected.forEach(siteName => {
        const site = SOURCES.find(s => s.name === siteName);
        if (site) {
          const url = site.url + encodeURIComponent(query);
          window.open(url, '_blank');
        }
      });
    }, 300);
  }

  function updateHistory() {
    const history = JSON.parse(localStorage.getItem('priceHistory') || '[]');
    if (history.length === 0) {
      historyEl.innerHTML = '<span class="text-gray-500 italic">No recent searches</span>';
      return;
    }
    historyEl.innerHTML = history.map(q =>
      `<span class="px-3 py-1.5 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">${q}</span>`
    ).join(' ');
    historyEl.querySelectorAll('span').forEach(span => {
      span.addEventListener('click', () => {
        searchInput.value = span.textContent;
        performSearch();
      });
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Event listeners
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && performSearch());
  selectAllBtn.addEventListener('click', () => {
    selected = new Set(SOURCES.map(s => s.name));
    renderSources();
  });
  deselectAllBtn.addEventListener('click', () => {
    selected.clear();
    renderSources();
  });

  // Init
  renderSources();
  updateHistory();
});
