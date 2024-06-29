import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
    TASK: 'task',
};

const DraggableTask = ({ task, index, moveTask, deleteTask, completeTask }) => {
    const [, ref] = useDrag({
        type: ItemTypes.TASK,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: ItemTypes.TASK,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveTask(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <li ref={(node) => ref(drop(node))} >
            <span className='text'>{task}</span>
            <button className='delete-btn' onClick={() => deleteTask(index)}>Delete</button>
            <button className='complete-btn' onClick={() => completeTask(index)}>Done!</button>
        </li>
    );
};

function ToDoList() {
    const initialTasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    const initialCompletedTasks = JSON.parse(sessionStorage.getItem('completedTasks')) || [];
    
    const [tasks, setTasks] = useState(initialTasks);
    const [completedTasks, setCompletedTasks] = useState(initialCompletedTasks);
    const [newTask, setNewTask] = useState('');
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);

    useEffect(() => {
        sessionStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        sessionStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }, [completedTasks]);

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function add() {
        if (newTask.trim() !== '') {
            setTasks([...tasks, newTask]);
            setNewTask('');
        }
    }

    function completeTask(index) {
        const completedTask = tasks[index];
        setCompletedTasks([...completedTasks, completedTask]);
        deleteTask(index);
    }

    function deleteTask(index) {
        const recent = tasks.filter((_, i) => i !== index);
        setTasks(recent);
    }

    function toggleCompletedTasks() {
        setShowCompletedTasks(!showCompletedTasks);
    }

    const moveTask = (fromIndex, toIndex) => {
        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(fromIndex, 1);
        updatedTasks.splice(toIndex, 0, movedTask);
        setTasks(updatedTasks);
    };

    return ( 
        <DndProvider backend={HTML5Backend}>
            <div className='to-do'>
                <h1>To-Do List</h1>

                <div>
                    <input type='text' placeholder='What needs to be done?' value={newTask}
                        onChange={handleInputChange} />
                    <button className='add-btn' onClick={add}>
                        Add
                    </button>
                </div>

                <ol>
                    {tasks.map((task, index) => (
                        <DraggableTask
                            key={index}
                            index={index}
                            task={task}
                            moveTask={moveTask}
                            deleteTask={deleteTask}
                            completeTask={completeTask}
                        />
                    ))}
                </ol>

                <div className='toggle-btn' onClick={toggleCompletedTasks}>
                    <div className='dots-container'>
                        <span className='dot'></span>
                        <span className='dot'></span>
                        <span className='dot'></span>
                    </div>
                </div>

                <div className={`side-nav ${showCompletedTasks ? 'open' : ''}`}>
                    <h2>Recently Completed Tasks</h2>
                    <ul>
                        {completedTasks.map((task, index) => (
                            <li key={index}>{task}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </DndProvider>
    );
}

export default ToDoList;
