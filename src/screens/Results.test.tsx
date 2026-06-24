import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Results } from './Results';

beforeEach(() => {
  localStorage.clear();
  useStore.setState({ ownedPartId: 'canyon-cfr', build: [], navOpen: true });
});

describe('Results', () => {
  it('renders engine-computed relationship groups for the owned frame', () => {
    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: /Cranksets that fit this frame/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Wheelsets that fit this frame/i }),
    ).toBeInTheDocument();
    // Every status is computed — there is at least one compatible result.
    expect(screen.getAllByText('Fits').length).toBeGreaterThan(0);
  });
});
