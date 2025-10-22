import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

// Componente de ejemplo
const Button = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
);

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText(/click me/i);
    expect(button).toBeInTheDocument();
  });

  it('button is clickable', () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByText(/click me/i);
    button.click();
    expect(clicked).toBe(true);
  });
});