import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useStore } from './store/useStore';
import App from './App';

const renderApp = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );

beforeEach(() => {
  localStorage.clear();
  useStore.setState({ ownedPartId: 'canyon-cfr', build: [], navOpen: true, hasChosen: false });
});

describe('App routing', () => {
  it('first run (no part chosen) lands on the picker', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { name: 'Your part' })).toBeInTheDocument();
    expect(screen.getByText(/browse a category and tap the part you own/i)).toBeInTheDocument();
  });

  it('returning user (part chosen) lands on What fits', () => {
    useStore.setState({ hasChosen: true });
    renderApp('/');
    expect(screen.getByRole('heading', { name: 'What fits' })).toBeInTheDocument();
  });

  it('navigates to Your build via the sidebar', () => {
    renderApp('/results');
    fireEvent.click(screen.getByRole('link', { name: /Your build/i }));
    expect(screen.getByRole('heading', { name: 'Your build' })).toBeInTheDocument();
  });

  it('shows the persistent owned-part anchor once a part is chosen', () => {
    useStore.setState({ hasChosen: true });
    renderApp('/results');
    expect(screen.getByText('You have')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change' })).toBeInTheDocument();
  });
});
