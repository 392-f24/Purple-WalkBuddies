import {describe, expect, test} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import App from './App';

describe('counter tests', () => {

  test("Counter should be 0 at the start", async () => {
    render(<App />);
    expect(await screen.findByText('Welcome to WalkBuddies')).toBeDefined();
  });

});