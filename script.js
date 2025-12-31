document.addEventListener('DOMContentLoaded', function() {
    // All Indian e-commerce sites with EXACT URLs as provided
    const SOURCES = [
        { 
            name: "Flipkart", 
            category: "General Shopping", 
            url: "https://www.flipkart.com/search?q=", 
            icon: "F",
            color: "#2874F0"
        },
        { 
            name: "Amazon India", 
            category: "General Shopping", 
            url: "https://www.amazon.in/s?k=", 
            icon: "A",
            color: "#FF9900"
        },
        { 
            name: "Wellness Forever", 
            category: "Pharmacy", 
            url: "https://www.wellnessforever.com/search?q=", 
            icon: "WF",
            color: "#009639"
        },
        { 
            name: "Noble Plus", 
            category: "General Shopping", 
            url: "https://nobleplus.in/?s=", 
            icon: "NP",
            color: "#E71D36"
        },
        { 
            name: "1mg", 
            category: "Pharmacy", 
            url: "https://www.1mg.com/search/all?name=", 
            icon: "1mg",
            color: "#4A90E2"
        },
        { 
            name: "Nykaa", 
            category: "Beauty & Cosmetics", 
            url: "https://www.nykaa.com/search/result/?q=", 
            icon: "N",
            color: "#BF0054"
        },
        { 
            name: "Apollo Pharmacy", 
            category: "Pharmacy", 
            url: "https://www.apollopharmacy.in/search-medicines/", 
            icon: "AP",
            color: "#0047AB"
        },
        { 
            name: "PharmEasy", 
            category: "Pharmacy", 
            url: "https://pharmeasy.in/search/all?name=", 
            icon: "PE",
            color: "#00C896"
        },
        { 
            name: "Netmeds", 
            category: "Pharmacy", 
            url: "https://www.netmeds.com/products?q=", 
            icon: "NM",
            color: "#009639"
        },
        { 
            name: "Truemeds", 
            category: "Pharmacy", 
            url: "https://www.truemeds.in/search/", 
            icon: "TM",
            color: "#2196F3"
        },
        { 
            name: "JioMart", 
            category: "General Shopping", 
            url: "https://www.jiomart.com/search/", 
            icon: "JM",
            color: "#0078D7"
        },
        { 
            name: "Zepto", 
            category: "Grocery", 
            url: "https://www.zepto.com/search?query=", 
            icon: "Z",
            color: "#B8002C"
        },
        { 
            name: "Blinkit", 
            category: "Grocery", 
            url: "https://blinkit.com/s/?q=", 
            icon: "B",
            color: "#31AD2E"
        },
        { 
            name: "Swiggy Instamart", 
            category: "Grocery", 
            url: "https://www.swiggy.com/instamart/search?custom_back=true&query=", 
            icon: "SI",
            color: "#F56C4E"
        },
        { 
            name: "DMart", 
            category: "General Shopping", 
            url: "https://www.dmart.in/search?searchTerm=", 
            icon: "D",
            color: "#8B572A"
        },
        { 
            name: "Croma", 
            category: "Electronics", 
            url: "https://www.croma.com/searchB?q=", 
            icon: "C",
            color: "#0047AB"
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

    // Render all source cards with proper icons
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
        const popularSources = ['Amazon India', 'Flipkart', 'Nykaa', 'PharmEasy', '1mg', 'Wellness Forever'];
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

    // Perform search and open tabs - FIXED VERSION
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

        // Create URLs array
        const urlsToOpen = [];
        selectedSources.forEach(sourceName => {
            const source = SOURCES.find(s => s.name === sourceName);
            if (source) {
                const encodedQuery = encodeURIComponent(query);
                const url = `${source.url}${encodedQuery}`;
                urlsToOpen.push({ url, name: source.name });
            }
        });

        showToast(`🚀 Opening ${urlsToOpen.length} tabs for "${query}"...`, 'success');

        // Open tabs with user confirmation for multiple tabs
        if (urlsToOpen.length > 1) {
            const confirmed = confirm(`This will open ${urlsToOpen.length} new tabs. Continue?`);
            if (confirmed) {
                openTabsWithDelay(urlsToOpen);
            }
        } else {
            window.open(urlsToOpen[0].url, '_blank');
        }

        // Clear search after opening tabs
        setTimeout(() => {
            searchInput.value = '';
            searchInput.focus();
        }, 1000);
    }

    // Open tabs with delay to avoid browser blocking
    function openTabsWithDelay(urls) {
        let index = 0;
        
        function openNextTab() {
            if (index >= urls.length) return;
            
            const currentUrl = urls[index];
            const newTab = window.open(currentUrl.url, '_blank');
            
            if (newTab) {
                index++;
                setTimeout(openNextTab, 500);
            } else {
                if (index === 0) {
                    alert('⚠️ Pop-ups are blocked! Please allow pop-ups for this site and try again.');
                }
            }
        }
        
        openNextTab();
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
        if (!color.startsWith('#')) return color;
        
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
    }

    // Initialize the app
    initApp();
});
