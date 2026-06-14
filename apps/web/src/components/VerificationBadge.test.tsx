import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VerificationBadge } from './VerificationBadge';

describe('VerificationBadge (truth discipline, UXD-001 §B/§F)', () => {
  it('shows verified state in verde voice', () => {
    render(<VerificationBadge status="verified" />);
    expect(screen.getByText(/VERIFICATO/)).toBeInTheDocument();
  });

  it('shows placeholder state as honest caution (never hidden)', () => {
    render(<VerificationBadge status="placeholder_PL" />);
    expect(screen.getByText(/PLACEHOLDER/)).toBeInTheDocument();
  });

  it('treats pending as unverified caution, not verified', () => {
    render(<VerificationBadge status="pending" />);
    expect(screen.queryByText(/VERIFICATO/)).not.toBeInTheDocument();
    expect(screen.getByText(/PLACEHOLDER/)).toBeInTheDocument();
  });
});
