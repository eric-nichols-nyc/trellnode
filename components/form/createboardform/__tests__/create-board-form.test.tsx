// Import necessary dependencies
import React from "react";
import { render, screen } from "@testing-library/react";
import { CreateBoardForm } from "../create-board-form";
it("should render form with image list and title input", () => {
  // Act
  render(<CreateBoardForm close={() => {}} />);

  // Assert
  expect(screen.getByLabelText("Board Title")).toBeInTheDocument();
  expect(screen.getByLabelText("image")).toBeInTheDocument();
});
