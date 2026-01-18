// notes.js - Secure Notes (Encrypted)

function renderNotes() {
  return `
      <div class="animate-fade-in">
          <div class="dark-card" style="background: var(--bg-card-darker);">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                   <h2 style="color: var(--brand-primary); font-size: 1.5rem;">SECURE VAULT</h2>
                   <div style="font-size: 1.2rem;">🔒</div>
              </div>
              <p style="color: var(--text-muted-on-dark); font-size: 0.8rem; margin-top: 0.5rem;">AES-256 Encrypted. Only you hold the keys.</p>
          </div>
  
          <div id="notes-list" style="margin-top: 2rem;"></div>
  
          <button class="btn-primary" id="new-note-btn" style="position: fixed; bottom: 2rem; right: 2rem; width: 56px; height: 56px; border-radius: 50%; box-shadow: var(--shadow-lg); font-size: 1.5rem; display: flex; align-items: center; justify-content: center;">+</button>
          
          <!-- Editor Modal (Simplified inline) -->
          <div id="note-editor" class="hidden" style="position: fixed; inset: 0; background: white; z-index: 60; padding: 2rem; display: flex; flex-direction: column;">
               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                   <h3 style="font-size: 1.2rem; font-weight: 700;">New Secure Note</h3>
                   <button id="close-note" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
               </div>
               
               <input type="text" id="note-title" placeholder="Title" style="font-size: 1.5rem; font-weight: 700; border: none; outline: none; width: 100%; margin-bottom: 1rem;">
               <textarea id="note-content" placeholder="Start typing... (Encrypted)" style="flex: 1; border: none; outline: none; resize: none; font-size: 1rem; line-height: 1.6;"></textarea>
               
               <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                   <input type="password" id="note-key" placeholder="Encryption Key (Birthdate)" class="dark-input" style="flex: 1;">
                   <button class="btn-primary" id="save-note" style="width: auto;">Encrypt & Save</button>
               </div>
          </div>
      </div>
    `;
}

async function initNotes() {
  const btn = document.getElementById('new-note-btn');
  const editor = document.getElementById('note-editor');
  const close = document.getElementById('close-note');
  const save = document.getElementById('save-note');

  btn.addEventListener('click', () => editor.classList.remove('hidden'));
  close.addEventListener('click', () => editor.classList.add('hidden'));

  save.addEventListener('click', async () => {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const key = document.getElementById('note-key').value;

    if (!title || !content || !key) return alert('Key required for encryption');

    const encrypted = await cryptoManager.encrypt(content, key);
    await storage.put('notes', { id: Date.now(), title, content: encrypted });

    editor.classList.add('hidden');
    renderNoteList();
  });

  renderNoteList();
}

async function renderNoteList() {
  const notes = await storage.getAll('notes');
  document.getElementById('notes-list').innerHTML = notes.map(n => `
          <div class="light-card" style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700;">${n.title}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">🔒 Encrypted</span>
          </div>
      `).join('');
}
