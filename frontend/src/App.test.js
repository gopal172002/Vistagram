import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Vistagram app', () => {
  render(<App />);
  const linkElement = screen.getByText(/Vistagram/i);
  expect(linkElement).toBeInTheDocument();
});

