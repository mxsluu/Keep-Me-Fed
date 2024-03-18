import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';; 
import Home from './HomePage'; 

// Mock the SessionProvider and provide a mock session context
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ status: 'authenticated', data: { user: { email: 'test@example.com' } } })),
  SessionProvider: ({ children }) => <>{children}</>, // Mock SessionProvider
}));

describe('Home method', () => {
  it('renders correctly when authenticated', () => {
    const { getByText } = render(<Home />);
    
    // Check if the component renders the welcome message and account button
    expect(getByText((content, element) => {
      return element.tagName.toLowerCase() === 'button' && content.includes('Account');
    })).toBeInTheDocument();
    expect(getByText((content, element) => {
      return element.tagName.toLowerCase() === 'button' && content.includes('Find Food');
    })).toBeInTheDocument();
  });

  it('renders correctly when not authenticated', () => {
    jest.mock('next-auth/react', () => ({
      useSession: jest.fn(() => ({ status: 'unauthenticated', data: null })),
      SessionProvider: ({ children }) => <>{children}</>, // Mock SessionProvider
    }));

    const { getByText } = render(Home());
    
    // Check if the component renders the signup and login buttons
    expect(getByText((content, element) => {
      return element.tagName.toLowerCase() === 'button' && content.includes('Find Food');
    })).toBeInTheDocument();
  });
});
