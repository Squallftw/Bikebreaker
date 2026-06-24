import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MyBuild } from './MyBuild';

const renderBuild = () =>
  render(
    <MemoryRouter>
      <MyBuild />
    </MemoryRouter>,
  );

beforeEach(() => {
  localStorage.clear();
  useStore.setState({ ownedPartId: 'canyon-cfr', build: [], navOpen: true });
});

describe('MyBuild', () => {
  it('is Compatible with just the owned part', () => {
    renderBuild();
    expect(screen.getByRole('heading', { name: 'Compatible' })).toBeInTheDocument();
  });

  it('flags a holistic conflict between two added parts', () => {
    // Ultegra (24mm) crank + SRAM DUB (28.99) BB both fit the Canyon frame,
    // but conflict with EACH OTHER on bore — the holistic check must catch it.
    useStore.setState({ build: ['shimano-fc-r8100', 'sram-dub-bsa'] });
    renderBuild();
    expect(screen.getByRole('heading', { name: 'Conflict' })).toBeInTheDocument();
    expect(screen.getAllByText(/Spindle mismatch/i).length).toBeGreaterThan(0);
  });
});
