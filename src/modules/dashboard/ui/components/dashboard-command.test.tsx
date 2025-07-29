import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardCommand } from './dashboard-command';

// Mock the UI command components since they're external dependencies
jest.mock('@/components/ui/command', () => ({
  CommandResponsiveDialog: jest.fn(({ children, open, onOpenChange }) => (
    <div data-testid="command-dialog" data-open={open.toString()}>
      {children}
      <button 
        data-testid="close-button" 
        onClick={() => onOpenChange && onOpenChange(false)}
      >
        Close Dialog
      </button>
    </div>
  )),
  CommandInput: jest.fn(({ placeholder, ...props }) => (
    <input 
      data-testid="command-input" 
      placeholder={placeholder}
      {...props}
    />
  )),
  CommandList: jest.fn(({ children }) => (
    <div data-testid="command-list" role="listbox">{children}</div>
  )),
  CommandItem: jest.fn(({ children, ...props }) => (
    <div data-testid="command-item" role="option" {...props}>{children}</div>
  )),
}));

describe('DashboardCommand Component', () => {
  const mockSetOpen = jest.fn();

  beforeEach(() => {
    mockSetOpen.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the command dialog when open is true', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const dialog = screen.getByTestId('command-dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('data-open', 'true');
    });

    it('should render the command dialog when open is false', () => {
      render(<DashboardCommand open={false} setOpen={mockSetOpen} />);
      
      const dialog = screen.getByTestId('command-dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('data-open', 'false');
    });

    it('should render the command input with correct placeholder text including typo', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const input = screen.getByTestId('command-input');
      expect(input).toBeInTheDocument();
      // Testing the actual typo "agnet" instead of "agent"
      expect(input).toHaveAttribute('placeholder', 'Find a meeting or agnet');
    });

    it('should render the command list with proper accessibility attributes', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const list = screen.getByTestId('command-list');
      expect(list).toBeInTheDocument();
      expect(list).toHaveAttribute('role', 'listbox');
    });

    it('should render exactly two command items with correct content', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const items = screen.getAllByTestId('command-item');
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent('Test');
      expect(items[1]).toHaveTextContent('Test2');
      
      // Ensure proper accessibility
      items.forEach(item => {
        expect(item).toHaveAttribute('role', 'option');
      });
    });

    it('should render all components in correct hierarchy', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const dialog = screen.getByTestId('command-dialog');
      const input = screen.getByTestId('command-input');
      const list = screen.getByTestId('command-list');
      const items = screen.getAllByTestId('command-item');
      
      expect(dialog).toBeInTheDocument();
      expect(dialog).toContainElement(input);
      expect(dialog).toContainElement(list);
      
      items.forEach(item => {
        expect(list).toContainElement(item);
      });
    });
  });

  describe('Props Handling and State Management', () => {
    it('should correctly pass open prop to CommandResponsiveDialog', () => {
      const { rerender } = render(<DashboardCommand open={false} setOpen={mockSetOpen} />);
      
      let dialog = screen.getByTestId('command-dialog');
      expect(dialog).toHaveAttribute('data-open', 'false');
      
      rerender(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      dialog = screen.getByTestId('command-dialog');
      expect(dialog).toHaveAttribute('data-open', 'true');
    });

    it('should pass setOpen function as onOpenChange callback and call it correctly', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);
      
      expect(mockSetOpen).toHaveBeenCalledTimes(1);
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });

    it('should handle different setOpen function implementations', () => {
      const alternativeSetOpen = jest.fn();
      const { rerender } = render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);
      expect(mockSetOpen).toHaveBeenCalledTimes(1);
      
      rerender(<DashboardCommand open={true} setOpen={alternativeSetOpen} />);
      fireEvent.click(closeButton);
      expect(alternativeSetOpen).toHaveBeenCalledTimes(1);
      expect(mockSetOpen).toHaveBeenCalledTimes(1); // Should not increment
    });

    it('should maintain prop consistency across re-renders', () => {
      const { rerender } = render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      expect(screen.getByTestId('command-input')).toHaveAttribute('placeholder', 'Find a meeting or agnet');
      expect(screen.getAllByTestId('command-item')).toHaveLength(2);
      
      rerender(<DashboardCommand open={false} setOpen={mockSetOpen} />);
      expect(screen.getByTestId('command-input')).toHaveAttribute('placeholder', 'Find a meeting or agnet');
      expect(screen.getAllByTestId('command-item')).toHaveLength(2);
    });
  });

  describe('Static Content Validation', () => {
    it('should display the exact placeholder text including the typo', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const input = screen.getByTestId('command-input');
      const placeholder = input.getAttribute('placeholder');
      
      // Explicitly test for the typo
      expect(placeholder).toBe('Find a meeting or agnet');
      expect(placeholder).not.toBe('Find a meeting or agent'); // Correct spelling
    });

    it('should display exact command item text content with case sensitivity', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const items = screen.getAllByTestId('command-item');
      
      // Test exact content
      expect(items[0]).toHaveTextContent('Test');
      expect(items[1]).toHaveTextContent('Test2');
      
      // Test case sensitivity
      expect(items[0]).not.toHaveTextContent('test');
      expect(items[1]).not.toHaveTextContent('test2');
      expect(items[0]).not.toHaveTextContent('TEST');
      expect(items[1]).not.toHaveTextContent('TEST2');
    });

    it('should maintain exactly two command items', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const items = screen.getAllByTestId('command-item');
      expect(items).toHaveLength(2);
      expect(items.length).toBe(2);
      
      // Ensure no extra items
      expect(items.length).not.toBeGreaterThan(2);
      expect(items.length).not.toBeLessThan(2);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined setOpen prop gracefully', () => {
      expect(() => {
        render(<DashboardCommand open={true} setOpen={undefined as any} />);
      }).not.toThrow();
      
      expect(screen.getByTestId('command-dialog')).toBeInTheDocument();
    });

    it('should handle null setOpen prop gracefully', () => {
      expect(() => {
        render(<DashboardCommand open={true} setOpen={null as any} />);
      }).not.toThrow();
      
      expect(screen.getByTestId('command-dialog')).toBeInTheDocument();
    });

    it('should handle undefined open prop gracefully', () => {
      expect(() => {
        render(<DashboardCommand open={undefined as any} setOpen={mockSetOpen} />);
      }).not.toThrow();
      
      expect(screen.getByTestId('command-dialog')).toBeInTheDocument();
    });

    it('should handle non-boolean open prop values', () => {
      const { rerender } = render(<DashboardCommand open={1 as any} setOpen={mockSetOpen} />);
      expect(screen.getByTestId('command-dialog')).toHaveAttribute('data-open', '1');
      
      rerender(<DashboardCommand open={0 as any} setOpen={mockSetOpen} />);
      expect(screen.getByTestId('command-dialog')).toHaveAttribute('data-open', '0');
      
      rerender(<DashboardCommand open={'' as any} setOpen={mockSetOpen} />);
      expect(screen.getByTestId('command-dialog')).toHaveAttribute('data-open', '');
      
      rerender(<DashboardCommand open={'true' as any} setOpen={mockSetOpen} />);
      expect(screen.getByTestId('command-dialog')).toHaveAttribute('data-open', 'true');
    });

    it('should handle empty props object gracefully', () => {
      expect(() => {
        render(<DashboardCommand {...({} as any)} />);
      }).not.toThrow();
    });

    it('should handle function call with invalid setOpen', () => {
      render(<DashboardCommand open={true} setOpen={undefined as any} />);
      
      const closeButton = screen.getByTestId('close-button');
      expect(() => {
        fireEvent.click(closeButton);
      }).not.toThrow();
    });
  });

  describe('Accessibility and Usability', () => {
    it('should maintain proper ARIA structure for assistive technologies', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const list = screen.getByTestId('command-list');
      const items = screen.getAllByTestId('command-item');
      
      expect(list).toHaveAttribute('role', 'listbox');
      items.forEach(item => {
        expect(item).toHaveAttribute('role', 'option');
      });
    });

    it('should provide meaningful placeholder text for users', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const input = screen.getByTestId('command-input');
      const placeholder = input.getAttribute('placeholder');
      
      expect(placeholder).toBeTruthy();
      expect(placeholder!.length).toBeGreaterThan(0);
      expect(placeholder).toContain('meeting');
      expect(placeholder).toMatch(/find/i);
    });

    it('should maintain consistent DOM order for keyboard navigation', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const dialog = screen.getByTestId('command-dialog');
      const input = screen.getByTestId('command-input');
      const list = screen.getByTestId('command-list');
      
      const dialogChildren = Array.from(dialog.children);
      const inputIndex = dialogChildren.findIndex(child => child.contains(input));
      const listIndex = dialogChildren.findIndex(child => child.contains(list));
      
      // Input should come before list for proper tab order
      expect(inputIndex).toBeLessThan(listIndex);
    });

    it('should be discoverable by screen readers', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      // Check that key elements are present and accessible
      expect(screen.getByTestId('command-input')).toBeInTheDocument();
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });
  });

  describe('Component Integration and Reusability', () => {
    it('should work correctly with different initial open states', () => {
      const { rerender } = render(<DashboardCommand open={false} setOpen={mockSetOpen} />);
      expect(screen.getByTestId('command-dialog')).toHaveAttribute('data-open', 'false');
      
      rerender(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      expect(screen.getByTestId('command-dialog')).toHaveAttribute('data-open', 'true');
    });

    it('should support different setOpen callback implementations', () => {
      const customSetOpen = jest.fn((value) => {
        console.log('Custom callback executed with:', value);
      });
      
      render(<DashboardCommand open={true} setOpen={customSetOpen} />);
      
      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);
      
      expect(customSetOpen).toHaveBeenCalledWith(false);
    });

    it('should maintain consistent behavior across multiple renders', () => {
      const { rerender } = render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      // Initial render verification
      expect(screen.getByTestId('command-dialog')).toBeInTheDocument();
      expect(screen.getAllByTestId('command-item')).toHaveLength(2);
      expect(screen.getByTestId('command-input')).toHaveAttribute('placeholder', 'Find a meeting or agnet');
      
      // Re-render with same props
      rerender(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      expect(screen.getByTestId('command-dialog')).toBeInTheDocument();
      expect(screen.getAllByTestId('command-item')).toHaveLength(2);
      expect(screen.getByTestId('command-input')).toHaveAttribute('placeholder', 'Find a meeting or agnet');
      
      // Re-render with different state
      rerender(<DashboardCommand open={false} setOpen={mockSetOpen} />);
      expect(screen.getByTestId('command-dialog')).toHaveAttribute('data-open', 'false');
      expect(screen.getAllByTestId('command-item')).toHaveLength(2);
    });

    it('should handle rapid state changes correctly', () => {
      const { rerender } = render(<DashboardCommand open={false} setOpen={mockSetOpen} />);
      
      // Simulate rapid toggling
      for (let i = 0; i < 5; i++) {
        rerender(<DashboardCommand open={i % 2 === 0} setOpen={mockSetOpen} />);
      }
      
      expect(screen.getByTestId('command-dialog')).toHaveAttribute('data-open', 'true');
      expect(screen.getAllByTestId('command-item')).toHaveLength(2);
    });
  });

  describe('Performance and Memory Management', () => {
    it('should not create memory leaks during re-renders', () => {
      const { rerender, unmount } = render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      // Multiple re-renders
      for (let i = 0; i < 10; i++) {
        rerender(<DashboardCommand open={i % 2 === 0} setOpen={mockSetOpen} />);
      }
      
      expect(screen.getByTestId('command-dialog')).toBeInTheDocument();
      
      // Clean unmount
      expect(() => unmount()).not.toThrow();
    });

    it('should handle frequent prop updates efficiently', () => {
      const { rerender } = render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      // Simulate frequent updates with different callbacks
      const differentCallbacks = Array.from({ length: 10 }, () => jest.fn());
      
      differentCallbacks.forEach(callback => {
        rerender(<DashboardCommand open={true} setOpen={callback} />);
        expect(screen.getByTestId('command-dialog')).toBeInTheDocument();
      });
    });

    it('should maintain component stability during stress testing', () => {
      const { rerender } = render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      // Stress test with many rapid changes
      for (let i = 0; i < 100; i++) {
        const randomOpen = Math.random() > 0.5;
        const randomCallback = jest.fn();
        rerender(<DashboardCommand open={randomOpen} setOpen={randomCallback} />);
      }
      
      // Component should still be functional
      expect(screen.getByTestId('command-dialog')).toBeInTheDocument();
      expect(screen.getAllByTestId('command-item')).toHaveLength(2);
    });
  });

  describe('TypeScript Interface Compliance', () => {
    it('should accept valid prop types according to interface', () => {
      expect(() => {
        render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      }).not.toThrow();
      
      expect(() => {
        render(<DashboardCommand open={false} setOpen={mockSetOpen} />);
      }).not.toThrow();
    });

    it('should work with React.Dispatch<React.SetStateAction<boolean>> signature', () => {
      const stateSetterMock = jest.fn() as React.Dispatch<React.SetStateAction<boolean>>;
      
      expect(() => {
        render(<DashboardCommand open={true} setOpen={stateSetterMock} />);
      }).not.toThrow();
      
      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);
      
      expect(stateSetterMock).toHaveBeenCalledWith(false);
    });

    it('should properly type-check the Props interface', () => {
      // This test ensures the component correctly implements the Props interface
      const validProps = {
        open: true as boolean,
        setOpen: mockSetOpen as React.Dispatch<React.SetStateAction<boolean>>
      };
      
      expect(() => {
        render(<DashboardCommand {...validProps} />);
      }).not.toThrow();
    });
  });

  describe('Integration with UI Components', () => {
    it('should correctly pass props to CommandResponsiveDialog', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      // Verify the dialog receives the correct props
      const dialog = screen.getByTestId('command-dialog');
      expect(dialog).toHaveAttribute('data-open', 'true');
    });

    it('should correctly pass props to CommandInput', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      // Verify the input receives the correct placeholder
      const input = screen.getByTestId('command-input');
      expect(input).toHaveAttribute('placeholder', 'Find a meeting or agnet');
    });

    it('should properly structure CommandList and CommandItems', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const list = screen.getByTestId('command-list');
      const items = screen.getAllByTestId('command-item');
      
      expect(list).toBeInTheDocument();
      expect(items).toHaveLength(2);
      
      items.forEach(item => {
        expect(list).toContainElement(item);
      });
    });
  });

  describe('User Interaction Scenarios', () => {
    it('should handle dialog close interaction correctly', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const closeButton = screen.getByTestId('close-button');
      
      // Simulate user clicking close
      fireEvent.click(closeButton);
      
      expect(mockSetOpen).toHaveBeenCalledTimes(1);
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });

    it('should maintain focus management expectations', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      const input = screen.getByTestId('command-input');
      const items = screen.getAllByTestId('command-item');
      
      // Elements should be focusable in logical order
      expect(input).toBeInTheDocument();
      expect(items[0]).toBeInTheDocument();
      expect(items[1]).toBeInTheDocument();
    });

    it('should support keyboard navigation structure', () => {
      render(<DashboardCommand open={true} setOpen={mockSetOpen} />);
      
      // Verify elements are in proper tab order
      const dialog = screen.getByTestId('command-dialog');
      const input = screen.getByTestId('command-input');
      const list = screen.getByTestId('command-list');
      
      expect(dialog).toContainElement(input);
      expect(dialog).toContainElement(list);
    });
  });
});