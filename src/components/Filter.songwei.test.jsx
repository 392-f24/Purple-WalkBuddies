import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Filter from './Filter';
import { useAuthState } from '../firebase';
import { filterData } from '../utils';

vi.mock('../firebase', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('../utils', () => ({
  filterData: vi.fn(),
}));

describe('Filter Component', () => {
  const mockUser = { uid: '12345' };
  const mockSetResource = vi.fn();
  const mockResource = [{ key: 'test_walker_1', value: { name: 'Test Walker' } }];

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthState.mockReturnValue({ user: mockUser });
    filterData.mockResolvedValue(mockResource);
  });

  it('opens the modal and displays filter tags', () => {
    render(<Filter resource={mockResource} setResource={mockSetResource} />);

    fireEvent.click(screen.getByText(/Filter/i));
    
    screen.getByText(/Tags/i);

    
    screen.getByText(/^Dogs$/); 
    screen.getByText(/^Cats$/); 
    screen.getByText(/^Small Pets$/); 
  });

  
  it('updates resource when the "Dogs" tag is selected and Done is clicked', async () => {
    render(<Filter resource={mockResource} setResource={mockSetResource} />);

    fireEvent.click(screen.getByText(/Filter/i));

    const dogsTag = screen.getAllByRole('button', { name: /^Dogs$/ })[0];
    fireEvent.click(dogsTag);

    fireEvent.click(screen.getByText(/Done/i));

    await waitFor(() => {
      expect(filterData).toHaveBeenCalledWith(
        mockResource,
        mockUser,
        expect.arrayContaining([{ key: 'Dogs', value: true }])
      );
      expect(mockSetResource).toHaveBeenCalledWith(mockResource);
    });
  });
});

