import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { vi } from 'vitest';
import StudentSearchBar from '../StudentSearchBar';

interface RenderOptions {
    onSearch?: (data: { query: string }) => void;
    onReset?: () => void;
    searchMessage?: string;
}

const renderSearchBar = (options: RenderOptions = {}) => {
    const onSearch = options.onSearch ?? vi.fn();
    const onReset = options.onReset ?? vi.fn();

    const Harness = () => {
        const form = useForm<{ query: string }>({ defaultValues: { query: '' } });
        return (
            <StudentSearchBar
                searchForm={form}
                onSearch={onSearch}
                onReset={onReset}
                searchMessage={options.searchMessage}
            />
        );
    };

    return {
        ...render(<Harness />),
        onSearch,
        onReset,
    };
};

describe('StudentSearchBar', () => {
    it('displays the optional search message', () => {
        renderSearchBar({ searchMessage: '3 matches' });

        expect(screen.getByText('3 matches')).toBeInTheDocument();
    });

    it('submits the composed query when the form is submitted', async () => {
        const user = userEvent.setup();
        const { onSearch } = renderSearchBar();

        await user.type(screen.getByPlaceholderText(/123456789/i), 'Alice');
        await user.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => {
            expect(onSearch).toHaveBeenCalledWith({ query: 'Alice' }, expect.anything());
        });
    });

    it('invokes onReset when Show all is clicked', async () => {
        const user = userEvent.setup();
        const { onReset } = renderSearchBar();

        await user.click(screen.getByRole('button', { name: /show all/i }));

        expect(onReset).toHaveBeenCalledTimes(1);
    });
});
