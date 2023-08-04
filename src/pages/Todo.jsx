/** @jsxImportSource @emotion/react */
import * as todoStyle from '../style/todoStyle';
import { useEffect, useRef } from 'react';
import { createTodo, getTodo } from '../api/Fetcher';
import TodoItem from '../components/TodoItem';
import { useRecoilState } from 'recoil';
import { todoListState } from '../recoil/todoListState';
import { authState } from '../recoil/authState';
import { useNavigate } from 'react-router-dom';

export default function Todo() {
  const navigate = useNavigate();

  const [todoList, setTodoList] = useRecoilState(todoListState);
  const [isLoggedIn] = useRecoilState(authState);
  const todoRef = useRef();

  const getTodoData = async () => {
    const todoData = await getTodo();
    setTodoList(todoData);
  };
  // Read Todo
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/signin');
      return;
    }
    getTodoData();
  }, []);

  // Create Todo
  const handleTodoSubmit = async (e) => {
    e.preventDefault();
    const todoData = {
      todo: todoRef.current.value,
    };
    const newTodo = await createTodo(todoData);
    todoRef.current.value = '';
    setTodoList([...todoList, newTodo]);
  };

  return (
    <main role="main" css={todoStyle.main}>
      <section css={todoStyle.imgSection}>
        <img
          css={todoStyle.mainImg}
          src="https://source.unsplash.com/random/?grayscale"
          alt="메인 비주얼 이미지"
        />
      </section>
      <section css={todoStyle.todoSection}>
        <ul css={todoStyle.todoListUl}>
          <li className="listTitle">To-do list</li>
          {todoList.length > 0 && <TodoItem />}
        </ul>
        <form css={todoStyle.createForm} onSubmit={handleTodoSubmit}>
          <input
            className="createInput"
            type="text"
            placeholder="+ Add to-do"
            ref={todoRef}
            data-testid="new-todo-input"
            required
          />
          <button className="createButton" data-testid="new-todo-add-button">
            Add
          </button>
        </form>
      </section>
    </main>
  );
}
