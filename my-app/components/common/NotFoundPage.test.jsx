import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotFoundPage', () => {
  it('should render 404 heading', () => {
    renderWithRouter(<NotFoundPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('404');
  });

  it('should render "Page not found" message', () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByText('Page not found.')).toBeInTheDocument();
  });

  it('should render "Go Home" link', () => {
    renderWithRouter(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /go home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('should have correct CSS class', () => {
    renderWithRouter(<NotFoundPage />);
    const section = screen.getByText('404').closest('section');
    expect(section).toHaveClass('notfound-page');
  });
});

