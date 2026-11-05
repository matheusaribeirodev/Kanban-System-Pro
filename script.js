// --- ESTADO GLOBAL DA APLICAÇÃO ---
const STORAGE_KEY = 'kanban_pro_tasks_v2';

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// --- SELETORES DO DOM ---
const modalBackdrop = document.getElementById('modal-backdrop');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const taskForm = document.getElementById('task-form');
const taskLists = document.querySelectorAll('.task-list');

const searchInput = document.getElementById('search-input');
const filterPriority = document.getElementById('filter-priority');
const quickAddBtns = document.querySelectorAll('.add-quick-btn');

// --- CONTROLE DO MODAL (CRIAR E EDITAR) ---
function openModal(editingTask = null, defaultStatus = 'todo') {
  const modalTitle = document.getElementById('modal-title');
  const taskIdInput = document.getElementById('task-id');
  const targetStatusInput = document.getElementById('task-target-status');

  if (editingTask) {
    modalTitle.textContent = 'Editar Tarefa';
    taskIdInput.value = editingTask.id;
    document.getElementById('task-title').value = editingTask.title;
    document.getElementById('task-desc').value = editingTask.description || '';
    document.getElementById('task-priority').value = editingTask.priority;
    document.getElementById('task-tag').value = editingTask.tag || '';
    targetStatusInput.value = editingTask.status;
  } else {
    modalTitle.textContent = 'Criar Nova Tarefa';
    taskIdInput.value = '';
    taskForm.reset();
    targetStatusInput.value = defaultStatus;
  }

  modalBackdrop.classList.add('active');
  setTimeout(() => document.getElementById('task-title').focus(), 50);
}

function closeModal() {
  modalBackdrop.classList.remove('active');
  taskForm.reset();
}

openModalBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

quickAddBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const status = btn.dataset.status;
    openModal(null, status);
  });
});

// Guardar ou Atualizar Tarefa
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const taskId = document.getElementById('task-id').value;
  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-desc').value.trim();
  const priority = document.getElementById('task-priority').value;
  const tag = document.getElementById('task-tag').value.trim();
  const status = document.getElementById('task-target-status').value || 'todo';

  if (!title) return;

  if (taskId) {
    // Modo Edição
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], title, description, priority, tag };
    }
  } else {
    // Modo Criação
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      tag,
      status,
      createdAt: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
    };
    tasks.push(newTask);
  }

  saveAndRender();
  closeModal();
});

// --- RENDERIZAÇÃO DE TAREFAS ---
function renderTasks() {
  taskLists.forEach(list => list.innerHTML = '');

  const searchTerm = searchInput.value.toLowerCase();
  const priorityTerm = filterPriority.value;

  // Filtragem
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm) || 
                          (task.tag && task.tag.toLowerCase().includes(searchTerm));
    const matchesPriority = priorityTerm === 'all' || task.priority === priorityTerm;
    return matchesSearch && matchesPriority;
  });

  filteredTasks.forEach(task => {
    const card = createTaskCard(task);
    const targetList = document.getElementById(task.status);
    if (targetList) targetList.appendChild(card);
  });

  updateCounters();
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.classList.add('task-card');
  card.setAttribute('draggable', 'true');
  card.dataset.id = task.id;

  const priorityMap = { low: 'Baixa', medium: 'Média', high: 'Alta' };

  card.innerHTML = `
    <div class="card-tags">
      <span class="priority-badge prio-${task.priority}">${priorityMap[task.priority]}</span>
      ${task.tag ? `<span class="category-tag">${escapeHTML(task.tag)}</span>` : ''}
    </div>
    <h3 class="card-title">${escapeHTML(task.title)}</h3>
    ${task.description ? `<p class="card-desc">${escapeHTML(task.description)}</p>` : ''}
    <div class="card-footer">
      <span class="card-date">${task.createdAt || ''}</span>
      <div class="card-actions">
        <button class="action-icon-btn edit-btn" title="Editar">&#9998;</button>
        <button class="action-icon-btn delete-btn delete" title="Eliminar">&times;</button>
      </div>
    </div>
  `;

  // Eventos das Ações do Cartão
  card.querySelector('.edit-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(task);
  });

  card.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  });

  // Drag & Drop
  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);

  return card;
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
}

function updateCounters() {
  const statuses = ['todo', 'in-progress', 'done'];
  statuses.forEach(status => {
    const count = tasks.filter(t => t.status === status).length;
    document.getElementById(`count-${status}`).textContent = count;
  });
}

// --- LÓGICA DRAG AND DROP (NATIVA) ---
let draggedCardId = null;

function handleDragStart(e) {
  draggedCardId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.setData('text/plain', draggedCardId);
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedCardId = null;
  taskLists.forEach(list => list.classList.remove('drag-over'));
}

taskLists.forEach(list => {
  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    list.classList.add('drag-over');
  });

  list.addEventListener('dragleave', (e) => {
    if (e.target === list) list.classList.remove('drag-over');
  });

  list.addEventListener('drop', (e) => {
    e.preventDefault();
    list.classList.remove('drag-over');

    const cardId = e.dataTransfer.getData('text/plain') || draggedCardId;
    const newStatus = list.id;

    const taskIndex = tasks.findIndex(t => t.id === cardId);
    if (taskIndex !== -1 && tasks[taskIndex].status !== newStatus) {
      tasks[taskIndex].status = newStatus;
      saveAndRender();
    }
  });
});

// --- PESQUISA E FILTROS ---
searchInput.addEventListener('input', renderTasks);
filterPriority.addEventListener('change', renderTasks);

// --- PERSISTÊNCIA E UTILITÁRIOS ---
function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  renderTasks();
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Inicializar
renderTasks();