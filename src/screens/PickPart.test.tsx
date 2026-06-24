import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
  it('bike mode: tapping a part opens its product panel', () => {
    const { container } = render(<Harness />);
    fireEvent.click(container.querySelector('g[aria-label="Select the wheelset you own"]')!);
    expect(screen.getByText(/Wheelset — which one\?/)).toBeInTheDocument();
  });

  it('list mode: picking a part sets it as owned and routes to results', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'list' }));
    fireEvent.click(screen.getByRole('button', { name: /Tarmac SL8 Frameset/i }));
    expect(useStore.getState().ownedPartId).toBe('spec-sl8');
    expect(useStore.getState().hasChosen).toBe(true);
    // Now on the results route, which renders the computed groups for the frame.
    expect(
      screen.getByRole('heading', { name: /Cranksets that fit this frame/i }),
    ).toBeInTheDocument();
  });
});
