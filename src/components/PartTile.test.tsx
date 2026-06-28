import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useStore } from '../store/useStore';
import { PartTile } from './PartTile';
import type { Part } from '../types';
import type { GroupItem } from '../lib/results';

const frame: Part = {
  id: 'f1',
  type: 'frame',
  brand: 'Canyon',
  name: 'Ultimate CFR',
  spec: 'BSA · disc',
  attrs: { bbShell: 'BSA', axle: '142x12', brake: 'disc', steerer: 'tapered' },
};

beforeEach(() => {
  localStorage.clear();
  useStore.setState({ ownedPartId: 'canyon-cfr', build: [], navOpen: true });
});

describe('PartTile', () => {
  it('pick mode: clicking the tile fires onPick with the id', () => {
    const onPick = vi.fn();
    render(<PartTile mode="pick" part={frame} index={0} onPick={onPick} />);
    fireEvent.click(screen.getByRole('button', { name: /Ultimate CFR/i }));
    expect(onPick).toHaveBeenCalledWith('f1');
  });

  it('result mode: toggling "Why?" reveals the spec comparison', () => {
    const item: GroupItem = {
      part: frame,
      result: {
        tone: 'conflict',
        reason: 'Freehub mismatch',
        detail: [{ label: 'Freehub', you: 'HG cassette', them: 'XDR body', ok: false }],
      },
    };
    render(<PartTile mode="result" item={item} index={0} />);
    expect(screen.queryByText(/XDR body/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /why/i }));
    expect(screen.getByText(/XDR body/)).toBeInTheDocument();
  });
});
