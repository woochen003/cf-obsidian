let currentFile = null;

async function loadTree() {
  const res = await fetch('/api/tree');
  const data = await res.json();
  const treeEl = document.getElementById('tree');
  treeEl.innerHTML = '';

  data.folders.forEach(folder => {
    const fEl = document.createElement('div');
    fEl.textContent = folder.name;
    treeEl.appendChild(fEl);

    data.files.filter(f => f.folder_id === folder.id).forEach(file => {
      const fileEl = document.createElement('div');
      fileEl.textContent = '  ' + file.name;
      fileEl.onclick = async () => {
        currentFile = file;
        const fileRes = await fetch(`/api/file/${file.id}`);
        const content = await fileRes.json();
        document.getElementById('text').value = content.content || '';
      };
      treeEl.appendChild(fileEl);
    });
  });
}

async function save() {
  if(!currentFile) return;
  await fetch('/api/file', {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: currentFile.id, content: document.getElementById('text').value })
  });
}

loadTree();
