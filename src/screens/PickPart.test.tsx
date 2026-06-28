import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { PickPart } from './PickPart';
import { Results } from './Results';

function Harness() {
  return (
    <MemoryRouter initialEntries={['/pick']}>
      <Routes>
        <Route path="/pick" element={<PickPart />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  useStore.setState({ ownedPartId: 'canyon-cfr', build: [], navOpen: true, hasChosen: false });
});

describe('Pick a part', () => {
  it('picking a part tile sets it as owned and routes to results', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: /Tarmac SL8 Frameset/i }));
    expect(useStore.getState().ownedPartId).toBe('spec-sl8');
    expect(useStore.getState().hasChosen).toBe(true);
    expect(
      screen.getByRole('heading', { name: /Cranksets that fit this frame/i }),
    ).toBeInTheDocument();
  });

  it('the Groupset category filter shows groupset tiles', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Groupset' }));
    expect(screen.getByRole('button', { name: /Dura-Ace R9200 Di2/i })).toBeInTheDocument();
  });

  it('searching and pressing Enter selects the part and routes to results', () => {
    render(<Harness />);
    const input = screen.getByRole('combobox', { name: /search parts/i });
    fireEvent.change(input, { target: { value: 'R9200 Di2' } });
    // The listbox shows the single matching groupset.
    const list = screen.getByRole('listbox');
    expect(within(list).getByText(/Dura-Ace R9200 Di2/i)).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(useStore.getState().ownedPartId).toBe('shimano-gs-r9200');
    expect(
      screen.getByRole('heading', { name: /Frames that fit this groupset/i }),
    ).toBeInTheDocument();
  });
});
