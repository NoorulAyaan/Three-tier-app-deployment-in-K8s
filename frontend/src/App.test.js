import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login page", () => {
  render(<App />); // ✅ No extra BrowserRouter
  const loginText = screen.getByText(/login/i); // Adjust this based on your Login component
  expect(loginText).toBeInTheDocument();
});





// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
