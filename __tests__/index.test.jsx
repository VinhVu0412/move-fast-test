/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../pages/index'

describe('Home', () => {
  const collectBoxColors = () => {
    let colors = [];
    for (let i = 1; i < 10 ; i++) {
      const box = screen.getAllByText(`${i}`)[0];
      colors.push(box.style.backgroundColor);
    }
    return colors;
  }

  it('renders boxes', () => {
    render(<Home />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()

    // two 7 boxes, 1 for desktop layout, the other for mobile layout
    const sevenBoxes = screen.getAllByText('7');
    expect(sevenBoxes.length).toBe(2);

    expect(sevenBoxes[0].style.backgroundColor).toBe(
      sevenBoxes[1].style.backgroundColor
    );
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

    // two 7 buttons should have the same color
    const sevenBoxes = screen.getAllByText('7');
    expect(sevenBoxes.length).toBe(2);

    expect(sevenBoxes[0].style.backgroundColor).toBe(
      sevenBoxes[1].style.backgroundColor
    );
  });
});
