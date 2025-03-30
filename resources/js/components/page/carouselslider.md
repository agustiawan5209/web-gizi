# Carousel Slider Component Documentation

## Overview
This React component provides a carousel-style navigation system with smooth transitions between pages/sections. It's built with TypeScript, Framer Motion for animations, and Tailwind CSS for styling.

## Features
- Smooth horizontal transitions between pages
- Direction-aware animations (slides left/right based on navigation direction)
- Responsive design
- Type-safe implementation
- Customizable pages and navigation

## Installation
1. Install dependencies:
```bash
npm install framer-motion
```

2. Import the component:
```tsx
import CarouselSlider from './components/CarouselSlider';
```

## Usage

### Basic Implementation
```tsx
const pages = [
  { id: 'home', title: 'Home', component: <HomePage /> },
  { id: 'about', title: 'About', component: <AboutPage /> },
  { id: 'contact', title: 'Contact', component: <ContactPage /> },
];

function App() {
  return <CarouselSlider pages={pages} initialPageId="home" />;
}
```

### Required Props
| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `pages` | `Page[]` | Array of page objects | Yes |
| `initialPageId` | `string` | ID of the initially active page | No |

### Page Object Structure
```typescript
type Page = {
  id: string;       // Unique identifier for the page
  title: string;    // Text to display in navigation
  component: ReactNode; // React component to render
};
```

## How It Works

### 1. State Management
The component maintains two key state variables:
- `currentPageId`: Tracks which page is currently active
- `direction`: Tracks navigation direction ('left' or 'right') for animations

### 2. Navigation Logic
When a nav button is clicked:
1. The component calculates the new page's index
2. Determines navigation direction by comparing current and new indices
3. Updates state to trigger re-render with new page

### 3. Animation System
The animation workflow uses Framer Motion's `AnimatePresence` and `motion` components:

1. **AnimatePresence**: Handles exit animations when components unmount
2. **Page Variants**: Defines three animation states:
   - `enter`: Page enters from off-screen (right or left)
   - `center`: Page is fully visible
   - `exit`: Page exits to opposite side

### 4. Transition Behavior
- New pages enter from the right when navigating forward
- New pages enter from the left when navigating backward
- Current page exits in the opposite direction
- Animation duration: 0.5 seconds with ease-in-out timing

## Customization Options

### Styling
Override default styles by adding Tailwind classes:
```tsx
<CarouselSlider 
  pages={pages}
  className="your-custom-class" 
  navClassName="custom-nav-style"
  contentClassName="custom-content-style"
/>
```

### Animation
Modify animation by changing the `pageVariants` object:
```typescript
const pageVariants = {
  enter: (direction: string) => ({
    x: direction === 'right' ? '100%' : '-100%',
    opacity: 0,
    scale: 0.9
  }),
  // ... rest of variants
};
```

## Performance Considerations
1. Uses CSS transforms for hardware acceleration
2. Only renders the current page (not all pages simultaneously)
3. Lightweight animation system with minimal re-renders

## Accessibility
- Uses `aria-current` for active page indication
- Keyboard navigation support (Tab to navigate buttons)
- Focus management during page transitions

## Example Implementations

### With Custom Pages
```tsx
const CustomPage = () => (
  <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
    <h1>Custom Page</h1>
  </div>
);

const pages = [
  { id: 'custom', title: 'Custom', component: <CustomPage /> },
  // ... other pages
];
```

### With Dynamic Content
```tsx
const DynamicPage = ({ content }: { content: string }) => (
  <div>{content}</div>
);

const pages = [
  { 
    id: 'dynamic', 
    title: 'Dynamic', 
    component: <DynamicPage content="Hello World" /> 
  },
];
```

## Troubleshooting

### Common Issues
1. **Pages not animating**: Ensure you've wrapped with `AnimatePresence`
2. **Navigation not working**: Verify page IDs are unique
3. **Content overflow**: Add `overflow-auto` to content container

## License
MIT License - Free to use and modify
