# Admin Dashboard Documentation

## Overview
A fully responsive admin dashboard with modern UI, animations, and mobile support.

## Components Created

### 1. **Admin Navbar** (`components/admin/admin-navbar.tsx`)
- **Features:**
  - Responsive design (mobile & desktop)
  - Search bar (desktop only)
  - Notifications dropdown with badge
  - User menu dropdown
  - Theme toggle (light/dark mode)
  - Mobile menu toggle button
- **Animations:** Framer Motion hover effects, dropdown animations

### 2. **Admin Sidebar** (`components/admin/admin-sidebar.tsx`)
- **Features:**
  - Collapsible sidebar (desktop)
  - Mobile drawer support
  - Active route highlighting
  - Navigation menu with icons
  - Logout button
- **Menu Items:**
  - Dashboard
  - Users
  - Sellers
  - Products
  - Orders
  - Withdrawals
  - Analytics
  - Reports
  - Permissions
  - Settings
- **Animations:** Smooth collapse/expand, route transitions

### 3. **Admin Footer** (`components/admin/admin-footer.tsx`)
- **Features:**
  - Copyright information
  - Version display
  - Responsive layout
- **Animations:** Fade-in animation

### 4. **Admin Layout** (`app/admin/layout.tsx`)
- **Features:**
  - Integrates navbar, sidebar, and footer
  - Responsive layout structure
  - Mobile drawer support
  - Proper spacing and overflow handling
- **Layout Structure:**
  ```
  ┌─────────────────────────────────┐
  │         Admin Navbar             │
  ├──────────┬──────────────────────┤
  │          │                        │
  │ Sidebar  │    Main Content       │
  │          │    (Scrollable)       │
  │          │                        │
  ├──────────┴──────────────────────┤
  │         Admin Footer              │
  └─────────────────────────────────┘
  ```

### 5. **Admin Dashboard Page** (`app/admin/dashboard/page.tsx`)
- **Features:**
  - Statistics cards (4 main metrics)
  - Pending actions cards (3 items)
  - Quick actions grid (4 items)
  - Recent activity section
  - Loading state with spinner
- **Animations:**
  - Staggered card animations
  - Hover effects (scale & lift)
  - Smooth transitions
  - Loading spinner rotation

## Responsive Design

### Mobile (< 1024px)
- Sidebar hidden by default
- Mobile drawer opens from left
- Navbar shows hamburger menu
- Cards stack vertically
- Search bar hidden

### Desktop (≥ 1024px)
- Sidebar always visible (collapsible)
- Full navigation visible
- Search bar visible
- Grid layouts optimized
- Hover effects enabled

## Framer Motion Animations

### Page Load
- **Container:** Stagger children animation
- **Items:** Fade in + slide up
- **Duration:** 0.5s per item

### Hover Effects
- **Cards:** Scale (1.02) + lift (-4px)
- **Buttons:** Scale (1.1/0.9)
- **Smooth transitions**

### Dropdowns
- **Notifications:** Fade + slide down
- **User Menu:** Fade + slide down
- **AnimatePresence** for smooth exit

### Sidebar
- **Collapse:** Width transition (0.3s)
- **Mobile:** Slide in/out animation
- **Menu items:** Staggered fade-in

## Color Scheme

### Light Mode
- Background: `bg-gray-50`
- Cards: `bg-white`
- Borders: `border-gray-200`
- Text: `text-gray-900`

### Dark Mode
- Background: `bg-gray-950`
- Cards: `bg-gray-900`
- Borders: `border-gray-800`
- Text: `text-white`

## Usage

### Access Dashboard
```
http://localhost:3000/admin/dashboard
```

### Navigation
- Click sidebar items to navigate
- Mobile: Tap hamburger menu to open sidebar
- Desktop: Click collapse button to minimize sidebar

### Features
1. **Stats Cards:** Display key metrics
2. **Pending Actions:** Quick access to items needing attention
3. **Quick Actions:** Fast navigation to main sections
4. **Notifications:** Click bell icon for notifications
5. **User Menu:** Click user avatar for profile/logout

## Customization

### Add New Menu Item
Edit `components/admin/admin-sidebar.tsx`:
```typescript
const menuItems = [
  // ... existing items
  { icon: YourIcon, label: 'New Page', href: '/admin/new-page' },
];
```

### Modify Stats Cards
Edit `app/admin/dashboard/page.tsx`:
```typescript
const statCards = [
  // ... existing cards
  {
    title: 'New Metric',
    value: newValue,
    icon: YourIcon,
    color: 'indigo',
    // ... other properties
  },
];
```

## Performance

- **Lazy Loading:** Components load on demand
- **Optimized Animations:** GPU-accelerated transforms
- **Responsive Images:** Optimized for mobile/desktop
- **Code Splitting:** Next.js automatic code splitting

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Real-time notifications via Socket.IO
- [ ] Advanced search functionality
- [ ] Data visualization charts
- [ ] Export reports functionality
- [ ] Keyboard shortcuts
- [ ] Multi-language support

