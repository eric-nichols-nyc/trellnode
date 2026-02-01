import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Signin } from "../signin";
import * as nextAuthReact from "next-auth/react";
jest.mock("next-auth/react");
jest.mock("sonner", () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock("../../../../actions/signup-action", () => ({ signUp: jest.fn() }));
const nextAuthReactMocked = nextAuthReact as jest.Mocked<typeof nextAuthReact>;

describe("Signin", () => {
  beforeEach(() => {
    nextAuthReactMocked.signIn.mockReset();
  });

  it("should render email, password inputs and Sign in button", () => {
    render(<Signin />);
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("should show name field when Create an account is clicked", () => {
    render(<Signin />);
    fireEvent.click(screen.getByText("Create an account"));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it("should call signIn with credentials when form is submitted with valid email and password", async () => {
    nextAuthReactMocked.signIn.mockResolvedValue({
      error: undefined,
      status: 200,
      ok: true,
      url: null,
    });
    render(<Signin />);
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    await waitFor(() => expect(nextAuthReactMocked.signIn).toHaveBeenCalled());
    expect(nextAuthReactMocked.signIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({
        email: "test@example.com",
        password: "password123",
        redirect: false,
      })
    );
    expect(nextAuthReactMocked.signIn.mock.calls[0][1].callbackUrl).toMatch(/\/boards$/);
  });

  it("should show validation errors and not call signIn when email is empty", async () => {
    render(<Signin />);
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    fireEvent.submit(screen.getByTestId("signin-form"));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(nextAuthReactMocked.signIn).not.toHaveBeenCalled();
  });

  it("should show validation error when email is invalid", async () => {
    render(<Signin />);
    await userEvent.type(screen.getByLabelText(/email/i), "not-an-email");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    fireEvent.submit(screen.getByTestId("signin-form"));
    expect(await screen.findByText("Please enter a valid email")).toBeInTheDocument();
    expect(nextAuthReactMocked.signIn).not.toHaveBeenCalled();
  });

  it("should show validation error when password is empty", async () => {
    render(<Signin />);
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    fireEvent.submit(screen.getByTestId("signin-form"));
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
    expect(nextAuthReactMocked.signIn).not.toHaveBeenCalled();
  });

  it("should show validation error for short password on sign up", async () => {
    render(<Signin />);
    await userEvent.click(screen.getByText("Create an account"));
    await userEvent.type(screen.getByLabelText(/name/i), "Test User");
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "short");
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
    expect(nextAuthReactMocked.signIn).not.toHaveBeenCalled();
  });

  it("should show Create account button when Create an account is clicked", () => {
    render(<Signin />);
    fireEvent.click(screen.getByText("Create an account"));
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });
});
