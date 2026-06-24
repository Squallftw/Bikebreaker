import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders the label for each tone', () => {
    const { rerender } = render(<StatusBadge tone="fits" />);
    expect(screen.getByText('Fits')).toBeInTheDocument();
    rerender(<StatusBadge tone="conflict" />);
    expect(screen.getByText('Conflict')).toBeInTheDocument();
    rerender(<StatusBadge tone="unrelated" />);
    expect(screen.getByText('Unrelated')).toBeInTheDocument();
  });
});
