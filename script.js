document.addEventListener('DOMContentLoaded', function() {
    // All Indian e-commerce sites with search URLs
    const SOURCES = [
        { 
            name: "Amazon India", 
            category: "General Shopping", 
            url: "https://www.amazon.in/s?k=", 
            icon: "A",
            color: "#FF9900"
        },
        { 
            name: "Flipkart", 
            category: "General Shopping", 
            url: "https://www.flipkart.com/search?q=", 
            icon: "F",
            color: "#2874F0"
        },
        { 
            name: "Nykaa", 
            category: "Beauty & Cosmetics", 
            url: "https://www.nykaa.com/search/result/?q=", 
            icon: "N",
            color: "#BF0054"
        },
        { 
            name: "PharmEasy", 
            category: "Medicines & Health", 
            url: "https://pharmeasy.in/search/all?name=", 
            icon: "P",
            color: "#00C896"
        },
        { 
            name: "1mg", 
            category: "Medicines & Health", 
            url: "https://www.1mg.com/search/all?name=", 
            icon: "1",
            color: "#4A90E2"
        },
        { 
            name: "Ajio", 
            category: "Fashion & Apparel", 
            url: "https://www.ajio.com/search/?query=", 
            icon: "A",
            color: "#000000"
        },
        { 
            name: "Myntra", 
            category: "Fashion & Apparel", 
            url: "https://www.myntra.com/search?p%5B0%5D=brand%3A&sortBy=popularity&searchQuery=", 
            icon: "M",
            color: "#F24B62"
        },
        { 
            name: "Netmeds", 
            category: "Medicines & Health", 
            url: "https://www.netmeds.com/catalogsearch/result?q=", 
            icon: "N",
            color: "#009639"
        },
        { 
            name: "Tata CLiQ", 
            category: "General Shopping", 
            url: "https://www.tatacliq.com/search/?q=", 
            icon: "T",
            color: "#E71D36"
        },
        { 
            name: "Snapdeal", 
            category: "General Shopping", 
            url: "https://www.snapdeal.com/search?keyword=", 
            icon: "S",
            color: "#FF5252"
        },
        { 
            name: "Croma", 
            category: "Electronics", 
            url: "https://www.croma.com/search?q=", 
            icon: "C",
            color: "#0047AB"
        },
        { 
            name: "Reliance Digital", 
            category: "Electronics", 
            url: "https://www.reliancedigital.in/search?text=", 
            icon: "R",
            color: "#D4AF37"
        },
        { 
            name: "Purplle", 
            category: "Beauty & Cosmetics", 
            url: "https://www.purplle.com/search?searchQuery=", 
            icon: "P",
            color: "#6A1B9A"
        },
        { 
            name: "BigBasket", 
            category: "Grocery & Essentials", 
            url: "https://www.bigbasket.com/search/?q=", 
            icon: "B",
            color: "#008000"
        },
        { 
            name: "JioMart", 
            category: "General Shopping", 
            url: "https://www.jiomart.com/search?query=", 
            icon: "J",
            color: "#0078D7"
        }
    ];

    // DOM Elements
    const sourcesGrid = document.getElementById('sources-grid');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const searchHistory = document.getElementById('search-history');
    const toast = document.getElementById('toast');

    // Selected sources storage
    let selectedSources = new Set();
    const MAX_HISTORY_ITEMS = 8;

    // Initialize the app
    function initApp() {
        renderSources();
        loadSearchHistory();
        setupEventListeners();
        preselectPopularSources();
    }

    // Render all source cards
    function renderSources() {
        sourcesGrid.innerHTML = '';
        
        SOURCES.forEach((source, index) => {
            const card = document.createElement('div');
            card.className = 'source-card';
            card.dataset.name = source.name;
            card.style.setProperty('--i', index);
            
            card.innerHTML = `
                <div class="source-icon" style="background: linear-gradient(45deg, ${source.color}, ${shadeColor(source.color, -20)});">
                    ${source.icon}
                </div>
                <div class="source-info">
                    <div class="source-name">${source.name}</div>
                    <div class="source-category">${source.category}</div>
                </div>
                <div class="checkbox-wrapper">
                    <div class="custom-checkbox"></div>
                </div>
            `;
            
            card.addEventListener('click', () => toggleSource(source.name, card));
            sourcesGrid.appendChild(card);
        });
    }

    // Toggle source selection
    function toggleSource(sourceName, card) {
        const checkbox = card.querySelector('.custom-checkbox');
        const isSelected = selectedSources.has(sourceName);
        
        if (isSelected) {
            selectedSources.delete(sourceName);
            checkbox.classList.remove('checked');
            card.classList.remove('selected');
        } else {
            selectedSources.add(sourceName);
            checkbox.classList.add('checked');
            card.classList.add('selected');
        }
    }

    // Select/Deselect all sources
    function selectAllSources() {
        selectedSources.clear();
        SOURCES.forEach(source => selectedSources.add(source.name));
        document.querySelectorAll('.source-card').forEach(card => {
            const checkbox = card.querySelector('.custom-checkbox');
            checkbox.classList.add('checked');
            card.classList.add('selected');
        });
        showToast('✅ All sources selected!', 'success');
    }

    function deselectAllSources() {
        selectedSources.clear();
        document.querySelectorAll('.source-card').forEach(card => {
            const checkbox = card.querySelector('.custom-checkbox');
            checkbox.classList.remove('checked');
            card.classList.remove('selected');
        });
        showToast('❌ All sources deselected!', 'info');
    }

    // Preselect popular sources
    function preselectPopularSources() {
        const popularSources = ['Amazon India', 'Flipkart', 'Nykaa', 'PharmEasy', '1mg'];
        document.querySelectorAll('.source-card').forEach(card => {
            const sourceName = card.dataset.name;
            if (popularSources.includes(sourceName)) {
                const checkbox = card.querySelector('.custom-checkbox');
                checkbox.classList.add('checked');
                card.classList.add('selected');
                selectedSources.add(sourceName);
            }
        });
    }

    // Perform search and open tabs
    function performSearch() {
        const query = searchInput.value.trim();
        
        if (!query) {
            showToast('⚠️ Please enter a search term!', 'error');
            return;
        }

        if (selectedSources.size === 0) {
            showToast('⚠️ Please select at least one source!', 'error');
            return;
        }

        // Save to history
        saveToHistory(query);

        // Open tabs with delay to avoid browser blocking
        let delay = 0;
        const tabsToOpen = [];
        
        selectedSources.forEach(sourceName => {
            const source = SOURCES.find(s => s.name === sourceName);
            if (source) {
                const encodedQuery = encodeURIComponent(query);
                const url = `${source.url}${encodedQuery}`;
                tabsToOpen.push({ url, name: source.name });
            }
        });

        showToast(`🚀 Opening ${tabsToOpen.length} tabs for "${query}"...`, 'success');

        // Open tabs with delay
        tabsToOpen.forEach((tab, index) => {
            setTimeout(() => {
                window.open(tab.url, '_blank');
            }, delay + (index * 300));
        });

        // Clear search after opening tabs
        setTimeout(() => {
            searchInput.value = '';
            searchInput.focus();
        }, 1000);
    }

    // History management
    function saveToHistory(query) {
        let history = JSON.parse(localStorage.getItem('pricehop_history') || '[]');
        
        // Remove if already exists
        history = history.filter(item => item !== query);
        
        // Add to beginning
        history.unshift(query);
        
        // Limit history size
        if (history.length > MAX_HISTORY_ITEMS) {
            history = history.slice(0, MAX_HISTORY_ITEMS);
        }
        
        localStorage.setItem('pricehop_history', JSON.stringify(history));
        updateHistoryDisplay();
    }

    function loadSearchHistory() {
        updateHistoryDisplay();
    }

    function updateHistoryDisplay() {
        const history = JSON.parse(localStorage.getItem('pricehop_history') || '[]');
        searchHistory.innerHTML = '';
        
        if (history.length === 0) {
            searchHistory.innerHTML = '<div style="color: #a0a0c0; font-style: italic;">No recent searches yet</div>';
            return;
        }
        
        history.forEach(query => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.textContent = query;
            item.title = `Search for "${query}"`;
            
            item.addEventListener('click', () => {
                searchInput.value = query;
                searchInput.focus();
                performSearch();
            });
            
            searchHistory.appendChild(item);
        });
    }

    // Toast notifications
    function showToast(message, type = 'info') {
        toast.textContent = message;
        
        // Set color based on type
        const colors = {
            success: 'linear-gradient(45deg, #4CAF50, #45a049)',
            error: 'linear-gradient(45deg, #f44336, #da190b)',
            info: 'linear-gradient(45deg, #2196F3, #1976D2)'
        };
        
        toast.style.background = colors[type] || colors.info;
        toast.style.borderColor = '#2196F3';
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Utility function to shade color
    function shadeColor(color, percent) {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);
        
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
        
        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;
        
        R = Math.max(0, R).toString(16).padStart(2, '0');
        G = Math.max(0, G).toString(16).padStart(2, '0');
        B = Math.max(0, B).toString(16).padStart(2, '0');
        
        return `#${R}${G}${B}`;
    }

    // Setup event listeners
    function setupEventListeners() {
        searchBtn.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        selectAllBtn.addEventListener('click', selectAllSources);
        deselectAllBtn.addEventListener('click', deselectAllSources);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Initialize the app
    initApp();
});