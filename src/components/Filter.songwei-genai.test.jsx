import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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

    const filterButton = screen.getByText(/Filter/i);
    fireEvent.click(filterButton); // Open modal

    const modalTitle = screen.getByText(/Tags/i);
    expect(modalTitle).toBeInTheDocument();

    const dogsTag = screen.getByText(/Dogs/i);
    const catsTag = screen.getByText(/Cats/i);
    expect(dogsTag).toBeInTheDocument();
    expect(catsTag).toBeInTheDocument();
  });

  it('updates resource with selected tag', async () => {
    render(<Filter resource={mockResource} setResource={mockSetResource} />);

    fireEvent.click(screen.getByText(/Filter/i)); // Open modal

    const dogsTag = screen.getByText(/Dogs/i);
    fireEvent.click(dogsTag); // Select 'Dogs' tag

    const doneButton = screen.getByText(/Done/i);
    fireEvent.click(doneButton); // Close modal and apply filter

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
