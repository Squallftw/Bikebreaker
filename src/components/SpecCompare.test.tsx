import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpecCompare } from './SpecCompare';

describe('SpecCompare', () => {
  it('renders each dimension with your / their values', () => {
    render(
      <SpecCompare
        detail={[{ label: 'Shell', you: 'BSA threaded', them: 'T47 threaded', ok: false }]}
      />,
    );
    expect(screen.getByText('Shell')).toBeInTheDocument();
    expect(screen.getByText('BSA threaded')).toBeInTheDocument();
    expect(screen.getByText('T47 threaded')).toBeInTheDocument();
  });

  it('shows an empty state when there is nothing to compare', () => {
    render(<SpecCompare detail={[]} />);
    expect(screen.getByText(/no shared mechanical interface/i)).toBeInTheDocument();
  });
});
