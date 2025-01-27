document.addEventListener('DOMContentLoaded', function() {
    const entriesContainer = document.getElementById('entries-container');
    const entryFormContainer = document.getElementById('entry-form-container');
    const entryForm = document.getElementById('entry-form');
    const newEntryButton = document.getElementById('new-entry');
    const saveEntryButton = document.getElementById('save-entry');
    const cancelEntryButton = document.getElementById('cancel-entry');
    const searchInput = document.getElementById('search-input');
    const contentTextarea = document.getElementById('entry-content');
    const charCounter = document.getElementById('char-counter');

    let editingEntry = null;

    // Load entries from local storage
    function loadEntries() {
        const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
        document.getElementById('sort-asc').addEventListener('click', function() {
            sortEntries('asc');
        });
        document.getElementById('sort-desc').addEventListener('click', function() {
            sortEntries('desc');
        });

        function sortEntries(order) {
            const entries = JSON.parse(localStorage.getItem('diaryEntries'));
            entries.sort((a, b) => order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
            loadEntries();
        }
        entriesContainer.innerHTML = '';
        entries.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'entry';
            entryDiv.innerHTML = `
                <h3>${entry.date}</h3>
                <p>${entry.content}</p>
                <p>Tags: ${entry.tags}</p>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            `;
            entriesContainer.appendChild(entryDiv);
        });
    }

    // Save entry to local storage
    function saveEntry(date, content) {
        const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
        const tags = document.getElementById('entry-tags').value;
        if (editingEntry !== null) {
            entries[editingEntry] = { date, content, tags };
            editingEntry = null;
        } else {
            entries.push({ date, content, tags });
        }
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        loadEntries();
        entryFormContainer.style.display = 'none';
    }

    // Handle form submission
    entryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const date = document.getElementById('entry-date').value;
        const content = document.getElementById('entry-content').value;
        saveEntry(date, content);
    });

    // Show the entry form
    newEntryButton.addEventListener('click', function() {
        document.getElementById('form-title').textContent = 'Add New Entry';
        entryForm.reset();
        entryFormContainer.style.display = 'block';
    });

    // Cancel form
    cancelEntryButton.addEventListener('click', function() {
        entryFormContainer.style.display = 'none';
    });

    // Edit entry
    window.editEntry = function(index) {
        const entries = JSON.parse(localStorage.getItem('diaryEntries'));
        const entry = entries[index];
        document.getElementById('entry-date').value = entry.date;
        document.getElementById('entry-content').value = entry.content;
        document.getElementById('form-title').textContent = 'Edit Entry';
        entryFormContainer.style.display = 'block';
        editingEntry = index;
    };

    // Delete entry
    window.deleteEntry = function(index) {
        if (confirm('Are you sure you want to delete this entry?')) {
            const entries = JSON.parse(localStorage.getItem('diaryEntries'));
            entries.splice(index, 1);
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
            loadEntries();
        }
    };

    // Search entries
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const entries = document.querySelectorAll('.entry');
        entries.forEach(entry => {
            const title = entry.querySelector('h3').textContent.toLowerCase();
            const content = entry.querySelector('p').textContent.toLowerCase();
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                entry.style.display = '';
            } else {
                entry.style.display = 'none';
            }
        });
    });

    contentTextarea.addEventListener('input', function() {
        const maxLength = 500;
        const currentLength = contentTextarea.value.length;
        charCounter.textContent = `${currentLength}/${maxLength}`;
        if (currentLength > maxLength) {
            charCounter.style.color = 'red';
        } else {
            charCounter.style.color = 'black';
        }
    });

    // Initial load of entries
    loadEntries();
});
