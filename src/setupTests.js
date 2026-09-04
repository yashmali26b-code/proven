import '@testing-library/jest-dom';

Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
