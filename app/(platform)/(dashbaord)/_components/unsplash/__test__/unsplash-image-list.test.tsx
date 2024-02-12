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
jest.mock("unsplash-js", () => {
  return {
    createApi: jest.fn(() => ({
      photos: {
        getRandom: jest.fn(),
      },
    })),
  };
})
// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: "mockData" }),
  })
) as jest.Mock;



describe("UnsplashImageList", () => {
  it("should render a list of images from unsplash api", async() => {

    // Arrange
    const props: UnsplashImageListProps = {
      id: "test-id",
      setImageData: jest.fn(),
      fetchedImgSrc: jest.fn(),
      selected: null,
      errors: undefined,
    };


    unsplash.photos.getRandom = jest.fn().mockResolvedValue({
      response: [
        {
          id: "1",
          alt_description:"test",
          urls: {
            thumb: "http://test.com/thumb",
            regular: "http://test.com/regular",
          },
          links: {
            html: "http://test.com/html",
          },
          user: {
            name: "test user",
          },
        },
      ],
    });

    // Act
    render(<UnsplashImageList {...props} />);
    // Assert
    // expect(screen.getByTestId("loader-component")).toBeInTheDocument();

    await waitFor(() => {
      expect(unsplash.photos.getRandom).toHaveBeenCalledTimes(1);
    });
   })

});