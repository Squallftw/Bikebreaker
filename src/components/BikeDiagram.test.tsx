import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { BikeDiagram } from './BikeDiagram';

describe('BikeDiagram', () => {
  it('calls onSelectType when an active part marker is activated', () => {
    const onSelectType = vi.fn();
    const { container } = render(
      <BikeDiagram selectedType={null} onSelectType={onSelectType} onSelectFaded={() => {}} />,
    );
    const chain = container.querySelector('g[aria-label="Select the chain you own"]');
    expect(chain).not.toBeNull();
    fireEvent.click(chain!);
    expect(onSelectType).toHaveBeenCalledWith('chain');
  });

  it('activates a marker via the keyboard (Enter)', () => {
    const onSelectType = vi.fn();
    const { container } = render(
      <BikeDiagram selectedType={null} onSelectType={onSelectType} onSelectFaded={() => {}} />,
    );
    const frame = container.querySelector('g[aria-label="Select the frame you own"]')!;
    fireEvent.keyDown(frame, { key: 'Enter' });
    expect(onSelectType).toHaveBeenCalledWith('frame');
  });

  it('calls onSelectFaded for a not-checked part', () => {
    const onSelectFaded = vi.fn();
    const { container } = render(
      <BikeDiagram selectedType={null} onSelectType={() => {}} onSelectFaded={onSelectFaded} />,
    );
    const faded = container.querySelector('circle[fill="#eef0f3"]')!;
    fireEvent.click(faded);
    expect(onSelectFaded).toHaveBeenCalledTimes(1);
    expect(onSelectFaded.mock.calls[0][0]).toMatch(/isn’t checked/i);
  });
});
