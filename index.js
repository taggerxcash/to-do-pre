let items = [
  'Сделать проектную работу',
  'Полить цветы',
  'Пройти туториал по Реакту',
  'Сделать фронт для своего проекта',
  'Прогуляться по улице в солнечный день',
  'Помыть посуду'
];

const listElement = document.querySelector('.to-do__list');
const formElement = document.querySelector('.to-do__form');
const inputElement = document.querySelector('.to-do__input');

function loadTasks() {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
    }
  }
  return items;
}

function createItem(item) {
  const template = document.getElementById('to-do__item-template');
  const clone = template.content.querySelector('.to-do__item').cloneNode(true);
  const textElement = clone.querySelector('.to-do__item-text');
  const deleteButton = clone.querySelector('.to-do__item-button_type_delete');
  const duplicateButton = clone.querySelector('.to-do__item-button_type_duplicate');
  const editButton = clone.querySelector('.to-do__item-button_type_edit');

  textElement.textContent = item;

  deleteButton.addEventListener('click', () => {
    clone.remove();
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  duplicateButton.addEventListener('click', () => {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);
    listElement.prepend(newItem);
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  editButton.addEventListener('click', () => {
    textElement.setAttribute('contenteditable', 'true');
    textElement.focus();
  });

  textElement.addEventListener('blur', () => {
    if (textElement.getAttribute('contenteditable') === 'true') {
      textElement.setAttribute('contenteditable', 'false');
      const currentTasks = getTasksFromDOM();
      saveTasks(currentTasks);
    }
  });

  return clone;
}

function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll('.to-do__item-text');
  const tasks = [];
  itemsNamesElements.forEach((el) => {
    tasks.push(el.textContent);
  });
  return tasks;
}

function saveTasks(tasks) {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
  }
}

items = loadTasks();
items.forEach((task) => {
  const listItem = createItem(task);
  listElement.append(listItem);
});

formElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const value = inputElement.value.trim();
  if (!value) {
    return;
  }
  const listItem = createItem(value);
  listElement.prepend(listItem);
  inputElement.value = '';
  items = getTasksFromDOM();
  saveTasks(items);
});