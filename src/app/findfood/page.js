'use client'

import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteForever from '@mui/icons-material/DeleteForever';
import AddBox from '@mui/icons-material/AddBox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function ToDos() {

    const [searchInput, setSearchInput] = useState('');
    const [recipes, setRecipes] = useState([]);
    let result = [];

    const handler = async function() {
        const response_recipes = await fetch('/api/recipes');
        const recipeTime = await response_recipes.json();

        setRecipes(recipeTime);
    }


    const recipeList = recipes?.map((recipe, index) => {
        return (
            recipe
        );
    });

    useEffect(() => {
        handler();
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    if (searchInput.length > 0) {
        result = recipeList.filter((recipe) => 
            recipe.name == searchInput);
    }

    console.log(result);
    console.log(recipeList);

    /*
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTodo, setNewTodo] = useState('');

    function inputChangeHandler(e) {
        setNewTodo(e.target.value);
    }

    function addNewTodo() {
        if(newTodo && newTodo.length) {
            fetch("/api/todos", { method: "post", body: JSON.stringify({value: newTodo, done: false}) } ).then((response) => {
                return response.json().then((newTodo) => {
                    setTodos([...todos, newTodo]);
                    setNewTodo('');
                });
            });
        }
    }

    function removeTodo({ index }) {
        const todoItem = todos[index];
        fetch(`/api/todos/${todoItem.id}`, { method: 'delete' }).then((res) => {
            if (res.ok) {
                setTodos(todos.filter((v,idx) => idx!==index));
            }
        });
    }

    function toggleDone({idx, item}) {
        let updatedItem = {...item, done: !item.done};
        fetch(`/api/todos/${item.id}}`, {method: 'put', body: JSON.stringify(updatedItem)}).then((res) => {
            if(res.ok) {
                const updatedTodos = [...todos];
                updatedTodos[idx] = updatedItem;
                setTodos(updatedTodos);
            }
        });
    }

    useEffect(() => {
        fetch("/api/todos", { method: "get" }).then((response) => response.ok && response.json()).then(
            todos => {
                todos && setTodos(todos);
                setIsLoading(false);
            }
        );
    }, []);

    const loadingItems = <CircularProgress/>;

    const toDoItems = isLoading ? loadingItems : todos.map((todo, idx) => {
        return <ListItem key={idx} secondaryAction={
            <IconButton edge="end" onClick={() => removeTodo({index: idx})} aria-label='delete todo'><DeleteForever/></IconButton>   
        }>  
            <ListItemButton>
                <ListItemIcon>
                    <Checkbox checked={todo.done} disableRipple onChange={() => {
                        toggleDone({idx, item: todo})
                    }} aria-label="toggle done"/>
                </ListItemIcon>
                <ListItemText primary={todo.value}/>
            </ListItemButton>
        </ListItem>;
    });
    

    return (
        <>
            <List sx={{ width: '100%', maxWidth: 500 }}>
                { toDoItems }
                {!isLoading && <ListItem key="newItem" secondaryAction={<IconButton edge="end" onClick={addNewTodo} aria-label="add button"><AddBox/></IconButton>}>
                    <TextField label="Search For Food" fullWidth variant="outlined" value={newTodo} onChange={inputChangeHandler}/> 
                </ListItem>}
            </List>
        </>
    );

    */

    return <div>

        <TextField label="Search For Food" fullWidth variant="outlined" value={searchInput} onChange={handleChange}/> 
        {result.map((recipe) => {
        <div>
            <ul>
                <h2>{recipe.name}</h2>
            </ul>
        </div>
        /*
        <input
            type="search"
            placeholder="Search here"
             onChange={handleChange}
            value={searchInput} />


        {result.map((recipe) => {
        <div>
            <tr>
                <td>{recipe.name}</td>
            </tr>
        </div>
        */

        }) }
    </div>
}