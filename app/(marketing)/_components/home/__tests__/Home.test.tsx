import {render, screen} from '@testing-library/react';
import {Home} from '../home';

it('should render the home page', () => {
    render(<Home />);
    const heading = screen.getByText(/Trellnode brings all your tasks, teammates, and tools together/i);
    expect(heading).toBeInTheDocument();
});