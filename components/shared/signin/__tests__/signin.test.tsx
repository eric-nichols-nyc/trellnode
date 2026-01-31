import { fireEvent, render, screen } from "@testing-library/react";
import { Signin } from "../signin";
import * as nextAuthReact from "next-auth/react";
jest.mock("next-auth/react");
jest.mock("../../../../actions/signup-action", () => ({ signUp: jest.fn() }));
const nextAuthReactMocked = nextAuthReact as jest.Mocked<typeof nextAuthReact>;

describe("Signin", () => {
  it("should render name, email, password inputs and Sign in button", () => {
    render(<Signin />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("should call signIn with credentials when form is submitted", async () => {
    nextAuthReactMocked.signIn.mockResolvedValue({
      error: undefined,
      status: 200,
      ok: true,
      url: "/boards",
    });
    render(<Signin />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await screen.findByText("Please wait…");
    expect(nextAuthReactMocked.signIn).toHaveBeenCalledWith("credentials", {
      email: "test@example.com",
      password: "password123",
      callbackUrl: "/boards",
      redirect: false,
    });
  });

  it("should show Create account button when Create an account is clicked", () => {
    render(<Signin />);
    fireEvent.click(screen.getByText("Create an account"));
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });
});
