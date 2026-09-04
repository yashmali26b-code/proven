import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('lenis', () => {
  return jest.fn().mockImplementation(() => ({
    raf: jest.fn(),
    scrollTo: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    destroy: jest.fn()
  }));
});

jest.mock('./firebase/firebase', () => ({
  app: {},
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn((cb) => {
      cb(null);
      return jest.fn();
    })
  },
  analytics: null,
  googleProvider: {},
  appleProvider: {},
  signInWithPopup: jest.fn(),
  signOut: jest.fn()
}));

test('renders PROVEN application interface without crashing', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/PROVEN/i);
  expect(brandElements.length).toBeGreaterThan(0);
});
