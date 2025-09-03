"use client";

import { render, screen } from '@testing-library/react';
import { ResponsiveDialog } from './responsive-dialog';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock the useIsMobile hook
jest.mock('@/hooks/use-mobile');

// Mock the UI components
jest.mock('@/components/ui/dialog', () => ({
    Dialog: ({ children, open, onOpenChange }: any) => (
        <div data-testid="dialog" data-open={open} onClick={() => onOpenChange?.(!open)}>
            {children}
        </div>
    ),
    DialogContent: ({ children }: any) => (
        <div data-testid="dialog-content">{children}</div>
    ),
    DialogHeader: ({ children }: any) => (
        <div data-testid="dialog-header">{children}</div>
    ),
    DialogTitle: ({ children }: any) => (
        <h1 data-testid="dialog-title">{children}</h1>
    ),
    DialogDescription: ({ children }: any) => (
        <p data-testid="dialog-description">{children}</p>
    ),
}));

jest.mock('@/components/ui/drawer', () => ({
    Drawer: ({ children, open, onOpenChange }: any) => (
        <div data-testid="drawer" data-open={open} onClick={() => onOpenChange?.(!open)}>
            {children}
        </div>
    ),
    DrawerContent: ({ children }: any) => (
        <div data-testid="drawer-content">{children}</div>
    ),
    DrawerHeader: ({ children }: any) => (
        <div data-testid="drawer-header">{children}</div>
    ),
    DrawerTitle: ({ children }: any) => (
        <h1 data-testid="drawer-title">{children}</h1>
    ),
    DrawerDescription: ({ children }: any) => (
        <p data-testid="drawer-description">{children}</p>
    ),
}));

const mockUseIsMobile = useIsMobile as jest.MockedFunction<typeof useIsMobile>;

describe('ResponsiveDialog', () => {
    const defaultProps = {
        title: 'Test Title',
        description: 'Test Description',
        children: <div data-testid="dialog-children">Dialog Content</div>,
        open: true,
        onOpenChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Desktop Behavior', () => {
        beforeEach(() => {
            mockUseIsMobile.mockReturnValue(false);
        });

        it('should render Dialog component when not on mobile', () => {
            render(<ResponsiveDialog {...defaultProps} />);
            
            expect(screen.getByTestId('dialog')).toBeInTheDocument();
            expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
        });

        it('should render Dialog with correct props when open is true', () => {
            render(<ResponsiveDialog {...defaultProps} open={true} />);
            
            const dialog = screen.getByTestId('dialog');
            expect(dialog).toHaveAttribute('data-open', 'true');
        });

        it('should render Dialog with correct props when open is false', () => {
            render(<ResponsiveDialog {...defaultProps} open={false} />);
            
            const dialog = screen.getByTestId('dialog');
            expect(dialog).toHaveAttribute('data-open', 'false');
        });

        it('should render Dialog content with title and description', () => {
            render(<ResponsiveDialog {...defaultProps} />);
            
            expect(screen.getByTestId('dialog-title')).toHaveTextContent('Test Title');
            expect(screen.getByTestId('dialog-description')).toHaveTextContent('Test Description');
            expect(screen.getByTestId('dialog-children')).toBeInTheDocument();
        });

        it('should render DialogHeader inside DialogContent', () => {
            render(<ResponsiveDialog {...defaultProps} />);
            
            expect(screen.getByTestId('dialog-header')).toBeInTheDocument();
            expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
        });

        it('should call onOpenChange when dialog interaction occurs', () => {
            const onOpenChange = jest.fn();
            render(<ResponsiveDialog {...defaultProps} onOpenChange={onOpenChange} open={true} />);
            
            const dialog = screen.getByTestId('dialog');
            dialog.click();
            
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    describe('Mobile Behavior', () => {
        beforeEach(() => {
            mockUseIsMobile.mockReturnValue(true);
        });

        it('should render Drawer component when on mobile', () => {
            render(<ResponsiveDialog {...defaultProps} />);
            
            expect(screen.getByTestId('drawer')).toBeInTheDocument();
            expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
        });

        it('should render Drawer with correct props when open is true', () => {
            render(<ResponsiveDialog {...defaultProps} open={true} />);
            
            const drawer = screen.getByTestId('drawer');
            expect(drawer).toHaveAttribute('data-open', 'true');
        });

        it('should render Drawer with correct props when open is false', () => {
            render(<ResponsiveDialog {...defaultProps} open={false} />);
            
            const drawer = screen.getByTestId('drawer');
            expect(drawer).toHaveAttribute('data-open', 'false');
        });

        it('should render Drawer content with title and description', () => {
            render(<ResponsiveDialog {...defaultProps} />);
            
            expect(screen.getByTestId('drawer-title')).toHaveTextContent('Test Title');
            expect(screen.getByTestId('drawer-description')).toHaveTextContent('Test Description');
            expect(screen.getByTestId('dialog-children')).toBeInTheDocument();
        });

        it('should render DrawerHeader inside DrawerContent', () => {
            render(<ResponsiveDialog {...defaultProps} />);
            
            expect(screen.getByTestId('drawer-header')).toBeInTheDocument();
            expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
        });

        it('should render children inside a div with p-4 className in mobile view', () => {
            render(<ResponsiveDialog {...defaultProps} />);
            
            const contentContainer = screen.getByTestId('drawer-content');
            const paddingDiv = contentContainer.querySelector('.p-4');
            
            expect(paddingDiv).toBeInTheDocument();
            expect(paddingDiv).toContainElement(screen.getByTestId('dialog-children'));
        });

        it('should call onOpenChange when drawer interaction occurs', () => {
            const onOpenChange = jest.fn();
            render(<ResponsiveDialog {...defaultProps} onOpenChange={onOpenChange} open={true} />);
            
            const drawer = screen.getByTestId('drawer');
            drawer.click();
            
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    describe('Props Handling', () => {
        beforeEach(() => {
            mockUseIsMobile.mockReturnValue(false);
        });

        it('should handle empty title gracefully', () => {
            render(<ResponsiveDialog {...defaultProps} title="" />);
            
            const title = screen.getByTestId('dialog-title');
            expect(title).toHaveTextContent('');
        });

        it('should handle empty description gracefully', () => {
            render(<ResponsiveDialog {...defaultProps} description="" />);
            
            const description = screen.getByTestId('dialog-description');
            expect(description).toHaveTextContent('');
        });

        it('should handle special characters in title and description', () => {
            const specialTitle = 'Title with <>&"\'';
            const specialDescription = 'Description with <>&"\'';
            
            render(
                <ResponsiveDialog 
                    {...defaultProps} 
                    title={specialTitle}
                    description={specialDescription}
                />
            );
            
            expect(screen.getByTestId('dialog-title')).toHaveTextContent(specialTitle);
            expect(screen.getByTestId('dialog-description')).toHaveTextContent(specialDescription);
        });

        it('should handle long title and description strings', () => {
            const longTitle = 'A'.repeat(1000);
            const longDescription = 'B'.repeat(2000);
            
            render(
                <ResponsiveDialog 
                    {...defaultProps} 
                    title={longTitle}
                    description={longDescription}
                />
            );
            
            expect(screen.getByTestId('dialog-title')).toHaveTextContent(longTitle);
            expect(screen.getByTestId('dialog-description')).toHaveTextContent(longDescription);
        });

        it('should handle null children gracefully', () => {
            render(<ResponsiveDialog {...defaultProps}>{null}</ResponsiveDialog>);
            
            expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
        });

        it('should handle multiple children elements', () => {
            const multipleChildren = (
                <>
                    <div data-testid="child-1">First Child</div>
                    <div data-testid="child-2">Second Child</div>
                    <span data-testid="child-3">Third Child</span>
                </>
            );
            
            render(<ResponsiveDialog {...defaultProps}>{multipleChildren}</ResponsiveDialog>);
            
            expect(screen.getByTestId('child-1')).toBeInTheDocument();
            expect(screen.getByTestId('child-2')).toBeInTheDocument();
            expect(screen.getByTestId('child-3')).toBeInTheDocument();
        });

        it('should handle complex React nodes as children', () => {
            const complexChildren = (
                <div>
                    <button onClick={() => console.log('clicked')}>Button</button>
                    <input type="text" placeholder="Input field" />
                    <ul>
                        <li>List item 1</li>
                        <li>List item 2</li>
                    </ul>
                </div>
            );
            
            render(<ResponsiveDialog {...defaultProps}>{complexChildren}</ResponsiveDialog>);
            
            expect(screen.getByRole('button')).toHaveTextContent('Button');
            expect(screen.getByPlaceholderText('Input field')).toBeInTheDocument();
            expect(screen.getByText('List item 1')).toBeInTheDocument();
            expect(screen.getByText('List item 2')).toBeInTheDocument();
        });
    });

    describe('Hook Integration', () => {
        it('should switch from Dialog to Drawer when useIsMobile changes to true', () => {
            mockUseIsMobile.mockReturnValue(false);
            const { rerender } = render(<ResponsiveDialog {...defaultProps} />);
            
            expect(screen.getByTestId('dialog')).toBeInTheDocument();
            expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
            
            mockUseIsMobile.mockReturnValue(true);
            rerender(<ResponsiveDialog {...defaultProps} />);
            
            expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
            expect(screen.getByTestId('drawer')).toBeInTheDocument();
        });

        it('should switch from Drawer to Dialog when useIsMobile changes to false', () => {
            mockUseIsMobile.mockReturnValue(true);
            const { rerender } = render(<ResponsiveDialog {...defaultProps} />);
            
            expect(screen.getByTestId('drawer')).toBeInTheDocument();
            expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
            
            mockUseIsMobile.mockReturnValue(false);
            rerender(<ResponsiveDialog {...defaultProps} />);
            
            expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
            expect(screen.getByTestId('dialog')).toBeInTheDocument();
        });

        it('should call useIsMobile hook on every render', () => {
            mockUseIsMobile.mockReturnValue(false);
            const { rerender } = render(<ResponsiveDialog {...defaultProps} />);
            
            expect(mockUseIsMobile).toHaveBeenCalledTimes(1);
            
            rerender(<ResponsiveDialog {...defaultProps} open={false} />);
            
            expect(mockUseIsMobile).toHaveBeenCalledTimes(2);
        });
    });

    describe('Callback Handling', () => {
        it('should not throw error if onOpenChange is undefined', () => {
            mockUseIsMobile.mockReturnValue(false);
            
            expect(() => {
                render(<ResponsiveDialog {...defaultProps} onOpenChange={undefined as any} />);
            }).not.toThrow();
        });

        it('should handle onOpenChange callback errors gracefully', () => {
            const faultyCallback = jest.fn(() => {
                throw new Error('Callback error');
            });
            
            mockUseIsMobile.mockReturnValue(false);
            render(<ResponsiveDialog {...defaultProps} onOpenChange={faultyCallback} />);
            
            const dialog = screen.getByTestId('dialog');
            
            expect(() => {
                dialog.click();
            }).toThrow('Callback error');
            
            expect(faultyCallback).toHaveBeenCalledWith(false);
        });
    });

    describe('Accessibility', () => {
        beforeEach(() => {
            mockUseIsMobile.mockReturnValue(false);
        });

        it('should render title as h1 element for screen readers', () => {
            render(<ResponsiveDialog {...defaultProps} />);
            
            const title = screen.getByRole('heading', { level: 1 });
            expect(title).toHaveTextContent('Test Title');
        });

        it('should render description with proper semantic element', () => {
            render(<ResponsiveDialog {...defaultProps} />);
            
            const description = screen.getByTestId('dialog-description');
            expect(description.tagName.toLowerCase()).toBe('p');
        });
    });

    describe('Mobile-specific Features', () => {
        beforeEach(() => {
            mockUseIsMobile.mockReturnValue(true);
        });

        it('should apply p-4 padding class only in mobile drawer view', () => {
            render(<ResponsiveDialog {...defaultProps} />);
            
            const drawerContent = screen.getByTestId('drawer-content');
            const paddingDiv = drawerContent.querySelector('.p-4');
            
            expect(paddingDiv).toBeInTheDocument();
            expect(paddingDiv).toHaveClass('p-4');
        });

        it('should render title as h1 in mobile drawer for consistency', () => {
            render(<ResponsiveDialog {...defaultProps} />);
            
            const title = screen.getByRole('heading', { level: 1 });
            expect(title).toHaveTextContent('Test Title');
            expect(title).toHaveAttribute('data-testid', 'drawer-title');
        });
    });
});