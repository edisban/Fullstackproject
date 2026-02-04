import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NotificationSnackbar from '../../components/NotificationSnackbar';
import { SnackbarProvider, useSnackbarContext } from '../../context/SnackbarContext';
import Dashboard from '../../pages/Dashboard';
import { useProjects } from '../../hooks/useProjects';

// Mocking τα hooks
vi.mock('../../hooks/useProjects');
vi.mock('react-router', () => ({
  ...vi.importActual('react-router'),
  useNavigate: () => vi.fn(),
}));

const SnackbarConsumer = () => {
  const { open, message, severity, handleClose } = useSnackbarContext();
  return (
    <NotificationSnackbar
      open={open}
      message={message}
      severity={severity}
      onClose={handleClose}
    />
  );
};

describe('Dashboard Error Handling', () => {
  it('displays an error message when the delete API call fails', async () => {
    
    const mockHandleDelete = vi.fn().mockRejectedValue(new Error('Server Error'));
    
    (useProjects as any).mockReturnValue({
      projects: [{ id: 1, name: 'Critical Project', description: 'Test Desc' }],
      loading: false, 
      handleDeleteProject: mockHandleDelete,
      handleCreateProject: vi.fn(),
      handleUpdateProject: vi.fn(),
    });

   
    render(
      <BrowserRouter>
        <SnackbarProvider>
          <SnackbarConsumer />
          <Dashboard />
        </SnackbarProvider>
      </BrowserRouter>
    );

    
    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);
    
    
    const confirmBtn = await screen.findByRole('button', { name: /^delete$/i });
    fireEvent.click(confirmBtn);

    
    await waitFor(() => {
      expect(screen.getByText(/Failed to delete project/i)).toBeInTheDocument();
    });
    
    
    expect(screen.getByText('Critical Project')).toBeInTheDocument();
  });
});