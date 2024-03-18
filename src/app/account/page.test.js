global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ 
      id: 123,
      budget: 100,
      location: 0,
      busyblocks: [{ startTime: '2024-03-19T09:00:00', endTime: '2024-03-19T12:00:00' }]
     }),
  })
);

import { render, fireEvent, waitFor } from '@testing-library/react';
import Account from './page';

// Mocking next-auth/react useSession hook
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mocking next/navigation useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Account component', () => {
  it('renders without crashing when authenticated', () => {
    // Mocking useSession hook to return authenticated status with a user
    const useSessionMock = {
      data: { user: { id: '123', email: 'test@example.com' } },
      status: 'authenticated',
    };
    require('next-auth/react').useSession.mockReturnValue(useSessionMock);

    render(<Account />);

    // Check if elements are rendered properly
    expect(screen.getByText('Account Page')).toBeInTheDocument();
    expect(screen.getByText('Budget')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter Weekly Budget:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enter' })).toBeInTheDocument();
    expect(screen.getByLabelText('Enter Location:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update Location' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get Current Location' })).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  it('redirects to login page when not authenticated', () => {
    // Mocking useSession hook to return unauthenticated status
    const useSessionMock = {
      data: null,
      status: 'unauthenticated',
    };
    require('next-auth/react').useSession.mockReturnValue(useSessionMock);

    const useRouterMock = require('next/navigation').useRouter;

    render(<Account />);

    // Check if router.push is called with the login page URL
    expect(useRouterMock().push).toHaveBeenCalledWith('/');
  });

  // Add more tests as needed to cover other functionalities of the component
});

/*
import ToDos from '../page';
import { render, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { enableFetchMocks } from 'jest-fetch-mock'

describe('todos page', () => {

  beforeEach(() => {
    enableFetchMocks();
  })

  afterEach(() => {
    fetch.resetMocks();
  })

  let idx = 0;

  buildTodo = function(done, value) {
    return {
      id: idx++, 
      done, 
      value
    }
  };

  testNumberOfTodos = function(todos, length) {
    // the plus one here is because we also have the add todos which is always there
    expect(todos.container.querySelectorAll('li')).toHaveLength(length+1);
  }

  it('should render with an empty list of todos', async () => {
    fetch.once(JSON.stringify([]));
    let todos; 
    await act(() => { 
      todos = render(<ToDos/>); 
    });
    testNumberOfTodos(todos, 0);
  });

  it('should render each todo', async () => {
    fetch.once(JSON.stringify([buildTodo(true, 'todo 1'), buildTodo(false, 'todo 2')]));
  
    let todos; 
    await act(() => { 
      todos = render(<ToDos/>); 
    });
    testNumberOfTodos(todos, 2);
  });

  it('should add a new todo', async () => {
    fetch.once(JSON.stringify([]))
         .once(JSON.stringify([buildTodo(true, 'New ToDo Item')]))
    let todos;
    await act(() => {
      todos = render(<ToDos/>);
    });
    const input = todos.getByLabelText('New ToDo Item');
    fireEvent.change(input, { target: { value: 'new todo for test' }});
    const add = todos.getByRole('button', { name: 'add button'});
    fireEvent.click(add);
    expect(fetch).toBeCalledWith('/api/todos', {method: 'post', body: "{\"value\":\"new todo for test\",\"done\":false}"});
    expect(fetch).toBeCalledWith('/api/todos', {method: 'get'});
  });
  
  it('should mark a todo item done', async () => {
    const item = buildTodo(false, 'New ToDo Item');
    fetch.once(JSON.stringify([item]))
         .once(JSON.stringify([{...item, done: true}]));
    let todos;
    await act(() => {
      todos = render(<ToDos/>);
    });
    expect(todos.container.querySelectorAll('li')).toHaveLength(2);
    const toggle = todos.getByLabelText('toggle done');
    const toggleInput = toggle.querySelector('input');
    toggleInput.click();
    expect(fetch.mock.calls.length).toEqual(2);
    expect(fetch.mock.calls[1][1]).toEqual({method: 'put', body: JSON.stringify({...item, done: true})});
  });

  it('should try to delete an item', async () => {
    const item = buildTodo(false, 'New ToDo Item');
    fetch.once(JSON.stringify([item]))
         .once(JSON.stringify(item));
    let todos;
    await act(() => {
      todos = render(<ToDos/>);
    });
    const deleteTodo = todos.getByLabelText('delete todo');
    deleteTodo.click();
    expect(fetch.mock.calls.length).toEqual(2);
    expect(fetch.mock.calls[1][0]).toEqual("/api/todos/"+item.id);
    expect(fetch.mock.calls[1][1]).toEqual({method: 'delete'});
  });
})
*/