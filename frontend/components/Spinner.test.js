import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

test('renders Spinner when "on" prop is true', () => {
  const { getByTestId } = render(<Spinner on={true} />);
  const spinnerElement = getByTestId('spinner');
  expect(spinnerElement).toBeInTheDocument();
});

test('does not render Spinner when "on" prop is false', () => {
  const { queryByTestId } = render(<Spinner on={false} />);
  const spinnerElement = queryByTestId('spinner');
  expect(spinnerElement).not.toBeInTheDocument();
});
