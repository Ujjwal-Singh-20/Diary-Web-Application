document.addEventListener('DOMContentLoaded', function() {
    const entriesContainer = document.getElementById('entries-container');
    const entryFormContainer = document.getElementById('entry-form-container');
    const entryForm = document.getElementById('entry-form');
    const newEntryButton = document.getElementById('new-entry');
    const saveEntryButton = document.getElementById('save-entry');
    const cancelEntryButton = document.getElementById('cancel-entry');
    const searchInput = document.getElementById('search-input');

    let editingEntry = null;

    // Load entries from local storage
    function loadEntries() {
        const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
        entriesContainer.innerHTML = '';
        entries.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'entry';
            entryDiv.innerHTML = `
                <h3>${entry.date}</h3>
                <p>${entry.content}</p>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            `;
            entriesContainer.appendChild(entryDiv);
        });
    }

    // Save entry to local storage
    function saveEntry(date, content) {
        const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
        if (editingEntry !== null) {
            entries[editingEntry] = { date, content };
            editingEntry = null;
        } else {
            entries.push({ date, content });
        }
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        loadEntries();
        entryFormContainer.style.display = 'none';
    }
});