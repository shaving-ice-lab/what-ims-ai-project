import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../test/utils";
import STable, { type STableColumn } from "../ui/STable";

interface TestRecord {
  key: string;
  name: string;
  age: number;
  address: string;
}

const mockColumns: STableColumn<TestRecord>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "Address", dataIndex: "address", key: "address" },
];

const mockData: TestRecord[] = [
  { key: "1", name: "John", age: 32, address: "New York" },
  { key: "2", name: "Jane", age: 28, address: "London" },
  { key: "3", name: "Bob", age: 35, address: "Tokyo" },
];

describe("STable Component", () => {
  it("renders table with data", () => {
    render(
      <STable columns={mockColumns} dataSource={mockData} rowKey="key" />
    );
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders table with column headers", () => {
    render(
      <STable columns={mockColumns} dataSource={mockData} rowKey="key" />
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
  });

  it("shows index column when showIndex is true", () => {
    render(
      <STable
        columns={mockColumns}
        dataSource={mockData}
        rowKey="key"
        showIndex
      />
    );
    expect(screen.getByText("序号")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("uses custom index title when provided", () => {
    render(
      <STable
        columns={mockColumns}
        dataSource={mockData}
        rowKey="key"
        showIndex
        indexTitle="No."
      />
    );
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders empty text when no data", () => {
    render(
      <STable columns={mockColumns} dataSource={[]} rowKey="key" />
    );
    expect(screen.getByText("暂无数据")).toBeInTheDocument();
  });

  it("renders pagination when provided", () => {
    render(
      <STable
        columns={mockColumns}
        dataSource={mockData}
        rowKey="key"
        pagination={{ current: 1, pageSize: 10, total: 3 }}
      />
    );
    expect(screen.getByText("共 3 条")).toBeInTheDocument();
  });

  it("calls onChange when clicking next page", () => {
    const onChange = vi.fn();
    render(
      <STable
        columns={mockColumns}
        dataSource={mockData}
        rowKey="key"
        pagination={{ current: 1, pageSize: 10, total: 30, onChange }}
      />
    );

    fireEvent.click(screen.getByLabelText("下一页"));
    expect(onChange).toHaveBeenCalledWith(2, 10);
  });

  it("does not render pagination when disabled", () => {
    render(
      <STable
        columns={mockColumns}
        dataSource={mockData}
        rowKey="key"
        pagination={false}
      />
    );

    expect(screen.queryByText(/共 \d+ 条/)).not.toBeInTheDocument();
  });

  it("renders with row selection", () => {
    const onSelectChange = vi.fn();
    render(
      <STable
        columns={mockColumns}
        dataSource={mockData}
        rowKey="key"
        rowSelection={{
          selectedRowKeys: [],
          onChange: onSelectChange,
        }}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it("maintains index numbers across pages", () => {
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
        rowKey="key"
        pagination={{ current: 2, pageSize: 10, total: 15 }}
        showIndex
      />
    );

    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("User 11")).toBeInTheDocument();
  });
});
