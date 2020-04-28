import './assets/css/style.css';

const ul = document.querySelector('ul');
const form = document.querySelector('form');
const inputAjout = document.querySelector('form > input');
const buttonAjout = document.querySelector('form > button');
let simpleClick = false;
let currentEdit = false;
const todosList = [
    {
        text: 'Je suis une tache',
        done: false,
        editMode: true
    },
    {
        text: 'Faire du JS',
        done: true,
        editMode: false
    }
]


/* 
    Parcourt la liste de taches
        Appelle les fonctions pour créer les lement html pour chaque tache
    Ajouter les elements html dans ul
*/ 
const displayTodo = () => {
    const todoNode = todosList.map((todo, index) => {
        if (todo.editMode) {
            return createTodoEditElement(todo, index);
        } else {
            return  createTodoElem(todo, index);
        }
    });
    ul.innerHTML = '';
    ul.append(...todoNode);
}


/*
    Reçoit une tache dont le mode est false et son index
    Crée les elements html et les eventListener
    Renvoit la tache structurée en li
*/
const createTodoElem = (todo, index) => {
    let li = document.createElement('li');

    const buttonDelete = document.createElement('button');
    buttonDelete.innerHTML = 'Supprimer';
    buttonDelete.classList.add('bg-danger');
    buttonDelete.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteTodo(index);
    });

    const buttonEdit = document.createElement('button');
    buttonEdit.innerHTML = 'Editer'
    buttonEdit.classList.add('bg-primary');
    buttonEdit.addEventListener('click', event => {
        console.log('mon event : ', event);
        event.stopPropagation();
        toggleEditMode(index);
    });

    li.innerHTML = `
        <span class="todo ${ todo.done ? 'done' : '' }"></span>
        <p class="${ todo.done ? 'text-barre' : ''}">${ todo.text }</p>
    `;
    li.append(buttonEdit, buttonDelete);
    li.addEventListener('click', (event) => {
        simpleClick = !simpleClick;
        setTimeout(() =>{
            if (simpleClick) {
                simpleClick = false;
                setDone(index, li);
            } else {
                console.log(currentEdit);
                if (!currentEdit) {
                    currentEdit = true;
                    buttonEdit.dispatchEvent(new Event('click'));
                }
                simpleClick = false;
            }
        }, 400);
        
    });
    return li;
}


/*
    Reçoit un text
    Ajoute une tache à la liste de taches
*/
const addTodo = (text) => {
    todosList.push({
        text,
        done: false
    })
    displayTodo();
}


/*
    Reçoit un index de tache
    Retire la tache correspondante à l'index de la liste de taches
*/
const deleteTodo = (index) => {
    todosList.splice(index, 1);
    displayTodo();
    event.stopPropagation();
}


/*
    Reçoit un index
    Toggle le status done de la tache dont l'index correspond
*/
const setDone = (index, li) => {
    todosList[index].done = !todosList[index].done;
    if (todosList[index].done) {
        li.children[1].classList.add("text-barre");
    } else {
        li.children[1].classList.remove("text-barre");
    }
    displayTodo();
}


/*
    Reçoit une tache dont le mode est true et son index
    Crée les elements html et les eventListener
    Renvoit la tache structurée en li
*/
const createTodoEditElement = (todo, index) => {
    const li = document.createElement('li');
    let input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    
    const buttonCancel = document.createElement('button');
    buttonCancel.innerHTML = 'Annuler';
    buttonCancel.classList.add('bg-danger');
    buttonCancel.addEventListener('click', () => {
        event.stopPropagation();
        toggleEditMode(index);
        currentEdit = false;
    });

    const buttonSave = document.createElement('button');
    buttonSave.innerHTML = 'Enregistrer';
    buttonSave.classList.add('bg-success');
    buttonSave.addEventListener('click', () => {
        event.stopPropagation();
        editTodo(index, input);
        inputAjout.focus();
        currentEdit = false;
    })

    li.append(input, buttonSave, buttonCancel);
    return li;
}


/*
    Recoit l'index d'une tache
    Toggle l'editMode de la tache correspondante à l'index
*/
const toggleEditMode = (index) => {
    todosList[index].editMode = !todosList[index].editMode;
    displayTodo();
}


/*
    Edite le text d'une tache
*/
const editTodo = (index, input) => {
    if (input.value) {
        const text = firstLetterToUpperCase(input.value);
        todosList[index].text = text;
        toggleEditMode(index);
        displayTodo();
    }
}


/*
    Création de nouvelle tache
*/
const newTodo = (value) => {
    if (value) {
        inputAjout.value = '';
        addTodo(value);
        displayTodo();
    }
}



/*
    Ecoute l'event submit et crée une nouvelle tache
*/
buttonAjout.addEventListener('click', (event) => {
    newTodo(inputAjout.value);
    inputAjout.focus();
});


/*
    Ajout eventlistener sur l'input de création
*/
inputAjout.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        newTodo(inputAjout.value);
    }
    if (event.key === 'Escape') {
        inputAjout.value = '';
    }
})


/*
    Reçoit un text en argument
    Met la première lettre en majuscule
    Retourne le texte modifié
*/
const firstLetterToUpperCase = text =>{
    let value = Array.from(text);
    value[0] = value[0].toUpperCase();
    value = value.join('');
    return value;
}

displayTodo();
