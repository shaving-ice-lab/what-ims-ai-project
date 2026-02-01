import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '../../test/utils';
import STable from '../ui/STable';

interface TestRecord {
  key: string;
  name: string;
  age: number;
  address: string;
}

const mockColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
];

const mockData: TestRecord[] = [
  { key: '1', name: 'John', age: 32, address: 'New York' },
  { key: '2', name: 'Jane', age: 28, address: 'London' },
  { key: '3', name: 'Bob', age: 35, address: 'Tokyo' },
];

describe('STable Component', () => {
  it('renders table with data', () => {
    render(<STable columns={mockColumns} dataSource={mockData} />);
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders table with column headers', () => {
    render(<STable columns={mockColumns} dataSource={mockData} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('shows index column when showIndex is true', () => {
    render(<STable columns={mockColumns} dataSource={mockData} showIndex />);
    expect(screen.getByText('序号')).toBeInTheDocument();
    // Check that index numbers are rendered
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('uses custom index title when provided', () => {
    render(
      <STable columns={mockColumns} dataSource={mockData} showIndex indexTitle="No." />
    );
    expect(screen.getByText('No.')).toBeInTheDocument();
  });

  it('renders empty table when no data', () => {
    render(<STable columns={mockColumns} dataSource={[]} />);
    // Ant Design shows "No data" or empty state
    expect(screen.queryByText('John')).not.toBeInTheDocument();
  });

  it('handles pagination correctly', () => {
    const longData = Array.from({ length: 25 }, (_, i) => ({
      key: String(i + 1),
      name: `User ${i + 1}`,
      age: 20 + i,
      address: `City ${i + 1}`,
    }));

    render(
      <STable
        columns={mockColumns}
        dataSource={longData}
        pagination={{ pageSize: 10 }}
      />
    );

    // First page should show first 10 items
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 10')).toBeInTheDocument();
    expect(screen.queryByText('User 11')).not.toBeInTheDocument();
  });

  it('calls onChange when pagination changes', async () => {
    const onChange = vi.fn();
    const longData = Array.from({ length: 25 }, (_, i) => ({
      key: String(i + 1),
      name: `User ${i + 1}`,
      age: 20 + i,
      address: `City ${i + 1}`,
    }));

    render(
      <STable
        columns={mockColumns}
        dataSource={longData}
        pagination={{ pageSize: 10 }}
        onChange={onChange}
      />
    );

    // Find and click the next page button
    const pagination = screen.getByRole('list');
    const nextButton = within(pagination).getByTitle('下一页');
    fireEvent.click(nextButton);

    expect(onChange).toHaveBeenCalled();
  });

  it('disables pagination when pagination is false', () => {
    render(
      <STable columns={mockColumns} dataSource={mockData} pagination={false} />
    );

    // Pagination should not be present
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('shows total count in pagination', () => {
    const longData = Array.from({ length: 50 }, (_, i) => ({
      key: String(i + 1),
      name: `User ${i + 1}`,
      age: 20 + i,
      address: `City ${i + 1}`,
    }));

    render(<STable columns={mockColumns} dataSource={longData} />);

    expect(screen.getByText('共 50 条')).toBeInTheDocument();
  });

  it('renders with default pagination config', () => {
    render(
      <STable
        columns={mockColumns}
        dataSource={mockData}
        defaultPagination={{ pageSize: 5 }}
      />
    );

    // Default pagination should be applied
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('renders with row selection', () => {
    const onSelectChange = vi.fn();
    
    render(
      <STable
        columns={mockColumns}
        dataSource={mockData}
        rowSelection={{
          onChange: onSelectChange,
        }}
      />
    );

    // Should have checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('maintains index numbers across pages', () => {
    const longData = Array.from({ length: 15 }, (_, i) => ({
      key: String(i + 1),
      name: `User ${i + 1}`,
      age: 20 + i,
      address: `City ${i + 1}`,
    }));

    render(
      <STable
        columns={mockColumns}
        dataSource={longData}
        pagination={{ pageSize: 10, current: 2 }}
        showIndex
      />
    );

    // On page 2, first index should be 11
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('User 11')).toBeInTheDocument();
  });
});
