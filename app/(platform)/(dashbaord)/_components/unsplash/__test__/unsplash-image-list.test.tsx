import { render, waitFor, screen } from "@testing-library/react";
import { UnsplashImageList } from "../unsplash-image-list";
import { unsplash } from "@/lib/unsplash";
import * as api from "unsplash-js";

type UnsplashImageListProps = {
  id: string;
  setImageData: (data: any) => void;
  fetchedImgSrc: (src: string) => void;
  selected: string | null;
  errors?: Record<string, string[] | undefined>;
};

// Mock the fetch function
jest.mock("unsplash-js");
// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: "mockData" }),
  })
) as jest.Mock;



describe("UnsplashImageList", () => {
  it("should render a loader component when loading is true", async() => {
    // Arrange
    const props: UnsplashImageListProps = {
      id: "test-id",
      setImageData: jest.fn(),
      fetchedImgSrc: jest.fn(),
      selected: null,
      errors: undefined,
    };

    // Act
    render(<UnsplashImageList {...props} />);
    await waitFor(() => expect(unsplash.photos.getRandom).toHaveBeenCalled());

    // Assert
    expect(screen.getByTestId("loader-component")).toBeInTheDocument();
   })
});