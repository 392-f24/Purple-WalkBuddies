import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, RouterProvider } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import MatchesPage from './MatchesPage';

// Mock functions for `useAuthState` and `useDbData`
jest.mock('../firebase', () => ({
  useAuthState: jest.fn(() => ({ Guser: { uid: 'test-user-id' } })),
  useDbData: jest.fn(() => [
    { walker: 'walker1', index: 0, data: { time: '2024-11-19T10:00:00', endTime: '2024-11-19T11:00:00', status: 'pending', id: 'test-match-id' } },
    { walker: 'walker2', index: 1, data: { time: '2024-11-20T12:00:00', endTime: '2024-11-20T13:00:00', status: 'ongoing' } },
  ]),
}));

// Mock functions for `wrapMatch` and `wrapProfile` (if applicable)
// Adjust these mocks based on your actual implementation
jest.mock('../utils', () => ({
  wrapMatch: jest.fn(data => data),
  wrapProfile: jest.fn(data => data),
}));

describe('MatchesPage tests', () => {
  test('should render a title and no matches message if there are no matches', async () => {
    useDbData.mockReturnValueOnce(null);
    render(<MatchesPage />);
    expect(await screen.findByText('PageTitle')).toBeInTheDocument();
    expect(await screen.findByText('No matches so far.')).toBeInTheDocument();
  });

  test('should render pending, ongoing, scheduled, and past match sections with match details', async () => {
    render(<MatchesPage />);

    // Pending Match Section
    expect(await screen.findByText('Pending Requests')).toBeInTheDocument();
    expect(await screen.findByText('walker1')).toBeInTheDocument();
    expect(await screen.findByText('Requested time:')).toBeInTheDocument();
    const pendingTimeDisplay = await screen.findByText(/November 19.*10:00 - 11:00/);
    expect(pendingTimeDisplay).toBeInTheDocument();

    // Ongoing Match Section
    expect(await screen.findByText('Ongoing Matches')).toBeInTheDocument();
    expect(await screen.findByText('walker2')).toBeInTheDocument();
    const ongoingTimeDisplay = await screen.findByText(/November 20.*12:00 - 13:00/);
    expect(ongoingTimeDisplay).toBeInTheDocument();

    // Scheduled Match Section (assuming there are no scheduled matches in your mock data)
    expect(await screen.queryByText('Scheduled Matches')).toBeNull();

    // Past Match Section (assuming there are no past matches in your mock data)
    expect(await screen.queryByText('Past Matches')).toBeNull();
  });

  test('should navigate to match detail page when clicking on a match', async () => {
    const history = createMemoryHistory();
    const router = createMemoryRouter(
      <MatchesPage />,
      { history }
    );

    render(<RouterProvider router={router} />);

    const matchLink = screen.getByText('walker1');
    userEvent.click(matchLink);

    expect(history.location.pathname).toBe('/test-match-id');
  });
});