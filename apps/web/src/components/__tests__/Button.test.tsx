import { Button } from "@/components/ui/button";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../test/utils";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders disabled button", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled").closest("button")).toBeDisabled();
  });

  it("renders default variant button", () => {
    render(<Button variant="default">Default</Button>);
    expect(screen.getByText("Default").closest("button")).toBeInTheDocument();
  });

  it("renders destructive variant button", () => {
    render(<Button variant="destructive">Danger</Button>);
    expect(screen.getByText("Danger").closest("button")).toBeInTheDocument();
  });

  it("renders outline variant button", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByText("Outline").closest("button")).toBeInTheDocument();
  });

  it("renders different sizes", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByText("Small").closest("button")).toBeInTheDocument();

    render(<Button size="lg">Large</Button>);
    expect(screen.getByText("Large").closest("button")).toBeInTheDocument();
  });
});
