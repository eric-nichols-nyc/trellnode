import {render, screen} from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { TitleForm } from '../title-form';

describe('TitleForm', () => {

    // Renders a Button component with the title as text when isEditing is false
    it('should render a Button component with the title as text when isEditing is false', () => {
      render(<TitleForm title="Test Title" id="1" update={() => {}} />);
      const buttonElement = screen.getByText('Test Title');
      expect(buttonElement).toBeInTheDocument();
    });

    // Renders a form with an Input component when isEditing is true
    it('should render a form with an Input component when isEditing is true', () => {
      render(<TitleForm title="Test Title" id="1" update={() => {}} />);
      const buttonElement = screen.getByText('Test Title');
      fireEvent.click(buttonElement);
      const inputElement = screen.getByRole('textbox');
      expect(inputElement).toBeInTheDocument();
    });

    // Enables editing mode when the Button component is clicked
    it('should enable editing mode when the Button component is clicked', () => {
      render(<TitleForm title="Test Title" id="1" update={() => {}} />);
      const buttonElement = screen.getByText('Test Title');
      fireEvent.click(buttonElement);
      const inputElement = screen.getByRole('textbox');
      expect(inputElement).toBeInTheDocument();
    });

    // Does not throw errors when rendered with valid props
    it('should not throw errors when rendered with valid props', () => {
      expect(() => {
        render(<TitleForm title="Test Title" id="1" update={() => {}} />);
      }).not.toThrow();
    });

    // Does not submit the form or call the update function when the Input component loses focus and the form has not been submitted
    it('should not submit the form or call the update function when the Input component loses focus and the form has not been submitted', () => {
      const updateMock = jest.fn();
      render(<TitleForm title="Test Title" id="1" update={updateMock} />);
      const buttonElement = screen.getByText('Test Title');
      fireEvent.click(buttonElement);
      const inputElement = screen.getByRole('textbox');
      fireEvent.blur(inputElement);
      expect(updateMock).not.toHaveBeenCalled();
    });

    // Does not submit the form or call the update function when the Input component loses focus and its value has not changed
    it('should not submit the form or call the update function when the Input component loses focus and its value has not changed', () => {
      const updateMock = jest.fn();
      render(<TitleForm title="Test Title" id="1" update={updateMock} />);
      const buttonElement = screen.getByText('Test Title');
      fireEvent.click(buttonElement);
      const inputElement = screen.getByRole('textbox');
      fireEvent.blur(inputElement);
      expect(updateMock).not.toHaveBeenCalled();
    });
});
