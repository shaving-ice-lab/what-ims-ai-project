import { Button } from 'antd';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../test/utils';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled button', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled').closest('button')).toBeDisabled();
  });

  it('renders loading button', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('Loading').closest('button')).toHaveClass('ant-btn-loading');
  });

  it('renders primary button', () => {
    render(<Button type="primary">Primary</Button>);
    expect(screen.getByText('Primary').closest('button')).toHaveClass('ant-btn-primary');
  });

  it('renders danger button', () => {
    render(<Button danger>Danger</Button>);
    expect(screen.getByText('Danger').closest('button')).toHaveClass('ant-btn-dangerous');
  });
});
