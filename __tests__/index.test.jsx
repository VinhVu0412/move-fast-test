/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../pages/index'

describe('Home', () => {
  const collectBoxColors = () => {
    return Array.from(Array(9)).map((_, i) => {
      const box = screen.getByText(`${i + 1}`);
      return box.style.backgroundColor;
    });
  };

  it('renders 9 boxes', () => {
    render(<Home />)

    Array.from(Array(9)).forEach((_, i) => {
      expect(screen.getByText(`${i + 1}`)).toBeInTheDocument()
    })
  });

  it('should shuffle box colors when clicking on a box', () => {
    render(<Home />)
    const colors = collectBoxColors();
    expect(colors.length).toBe(9);

    expect(
      Array.from(Array(9)).some((_, i) => {
        fireEvent.click(screen.getAllByText(`${i + 1}`)[0])

        const newColors = collectBoxColors();
        return JSON.stringify(newColors) !== JSON.stringify(colors)
      })
    ).toBe(true);
  });
});
