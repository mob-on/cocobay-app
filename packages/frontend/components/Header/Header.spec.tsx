import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";

import Header from "./Header";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Header Component", () => {
  let routerMock: Partial<Router>;

  beforeEach(() => {
    routerMock = {
      back: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(routerMock);
  });

  it("should render the header component correctly", () => {
    render(<Header />);

    const headerElement = screen.getByRole("banner");
    expect(headerElement).toBeInTheDocument();

    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", expect.anything());
  });

  it("should call router.back when the back button is clicked", () => {
    render(<Header />);

    const backButton = screen.getByRole("button");
    fireEvent.click(backButton);

    expect(routerMock.back).toHaveBeenCalledTimes(1);
  });
});
