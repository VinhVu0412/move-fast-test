/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import Box from '../../components/Box'

describe('Box', () => {
  it('renders a button', () => {
    const onClick = jest.fn();
    render(<Box color='red' onClick={onClick} >Text</Box>)

    const button = screen.getByText("Text")

    expect(button).toBeInTheDocument()
    expect(onClick.mock.calls.length).toBe(0);

    fireEvent.click(button)

    expect(onClick.mock.calls.length).toBe(1);
  });
})
