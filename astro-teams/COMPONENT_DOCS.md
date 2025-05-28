# 🧩 Component Documentation

*Comprehensive guide to all Aurorion Teams components*

## 📋 **Component Architecture Overview**

```
Components/
├── Layouts/
│   └── BaseLayout.astro           # Main application layout
├── Repository Management/
│   ├── RepositoryModal.astro      # Repository creation modal
│   ├── RepositoryCard.astro       # Individual repository display
│   └── RepositoryList.astro       # Repository list with search/filter
└── [Upcoming]/
    ├── AgentRoleSelector.astro    # Agent role selection interface
    ├── TeamMemberForm.astro       # Team member customization
    └── TeamWorkflow.astro         # Visual team workflow display
```

---

## 🏗️ **BaseLayout.astro**

### **Purpose**
Main application layout providing navigation, theme switching, and page structure.

### **Features**
- **Navigation Header**: Brand, title, and theme switcher
- **Theme Management**: Professional ↔ Price is Right toggle
- **Footer**: Attribution and theme indicator
- **Responsive Design**: Mobile-first with adaptive navigation

### **Props**
```typescript
interface Props {
  title: string;           // Page title for <title> tag
  description?: string;    // Meta description for SEO
}
```

### **Usage**
```astro
<BaseLayout 
  title="Aurorion Teams - Dashboard"
  description="Manage your AI agent teams"
>
  <!-- Page content -->
</BaseLayout>
```

### **Key Classes**
- `.nav-header` - Main navigation container
- `.theme-toggle` - Theme switcher component
- `.main-content` - Page content wrapper
- `.app-footer` - Footer container

### **JavaScript API**
```javascript
window.themeManager = {
  getCurrentTheme: () => string,
  setTheme: (theme: string) => void,
  toggleTheme: () => void
}
```

---

## 📝 **RepositoryModal.astro**

### **Purpose**
Modal dialog for creating new repositories with comprehensive form validation.

### **Features**
- **Form Validation**: Real-time validation with error display
- **Character Counting**: Live character limits for name and description
- **Loading States**: Visual feedback during creation process
- **Accessibility**: Full keyboard navigation and screen reader support
- **Theme Integration**: Adapts to current theme styling

### **Props**
```typescript
interface Props {
  isOpen?: boolean;        // Initial open state (default: false)
}
```

### **Form Fields**
- **Repository Name**: Required, 2-50 characters, alphanumeric + spaces/hyphens
- **Description**: Optional, 0-200 characters
- **Template**: Coming soon, placeholder for quick setup options

### **Validation Rules**
```typescript
{
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-_]+$/
  }
}
```

### **JavaScript API**
```javascript
window.repositoryModal = {
  open: () => void,
  close: () => void,
  resetForm: () => void
}
```

### **Events**
- `repositoryCreated` - Fired when repository is successfully created
- `modalClosed` - Fired when modal is closed (with or without creation)

### **Key Classes**
- `.modal-backdrop` - Full-screen overlay
- `.modal-container` - Modal content wrapper
- `.repo-form` - Main form container
- `.form-group` - Individual field containers
- `.form-error` - Error message display

---

## 📊 **RepositoryCard.astro**

### **Purpose**
Individual repository display with metadata, status, and action buttons.

### **Features**
- **Status Indicators**: Visual status badges (Setup, Progress, Active, Mixed)
- **Team Preview**: Member count and role distribution
- **Action Buttons**: View, edit, delete with hover states
- **Recent Updates**: "New" badge for recently modified repositories
- **Responsive Layout**: Adapts to grid and mobile layouts

### **Props**
```typescript
interface Props {
  repository: Repository;  // Complete repository object
}
```

### **Repository Status Logic**
```typescript
function getRepositoryStatus(repository: Repository) {
  const teamSize = repository.team.length;
  const activeMembers = repository.team.filter(m => m.status === 'active').length;
  const pendingMembers = repository.team.filter(m => m.status === 'pending').length;
  
  if (teamSize === 0) return { text: 'Setup Required', class: 'setup' };
  if (pendingMembers > 0) return { text: 'In Progress', class: 'progress' };
  if (activeMembers === teamSize) return { text: 'Active', class: 'active' };
  return { text: 'Mixed Status', class: 'mixed' };
}
```

### **Key Sections**
- **Card Header**: Repository name, metadata, and quick actions
- **Card Content**: Description and team composition preview
- **Card Footer**: Creation/update dates and primary action button

### **Action Types**
- `view` - Navigate to repository detail page
- `edit` - Open repository edit modal
- `delete` - Show confirmation dialog and delete

### **CSS Classes**
- `.repo-card` - Main card container
- `.repo-status.{setup|progress|active|mixed}` - Status-specific styling
- `.recent-badge` - Recently updated indicator
- `.team-preview` - Team composition section
- `.role-pill` - Individual agent role indicators

---

## 📋 **RepositoryList.astro**

### **Purpose**
Complete repository management interface with search, filtering, and sorting.

### **Features**
- **Search Functionality**: Debounced search across name and description
- **Status Filtering**: Filter by repository status
- **Sorting Options**: Sort by date, name, or team size
- **State Management**: Loading, error, empty, and populated states
- **Real-time Updates**: Responds to repository creation/deletion events

### **Search & Filter**
```typescript
// Search Implementation
const searchTerm = input.value.toLowerCase().trim();
const filtered = repositories.filter(repo => 
  repo.name.toLowerCase().includes(searchTerm) ||
  repo.description.toLowerCase().includes(searchTerm)
);

// Filter by Status
const statusFilter = select.value;
const filtered = repositories.filter(repo => {
  const status = getRepositoryStatus(repo);
  return status.class === statusFilter;
});

// Sorting Options
const sortOptions = {
  'updated': (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  'created': (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  'name': (a, b) => a.name.localeCompare(b.name),
  'team-size': (a, b) => b.team.length - a.team.length
};
```

### **State Management**
- **Loading State**: Skeleton screen during data loading
- **Error State**: Error message with retry button
- **Empty State**: No repositories message with create button
- **Empty Search State**: No results message with clear filters button

### **JavaScript API**
```javascript
window.repositoryListManager = {
  loadRepositories: () => Promise<void>,
  applyFilters: () => void,
  clearFilters: () => void
}
```

### **Events Handled**
- `repositoryCreated` - Refresh list when new repository created
- `repositoryDeleted` - Remove repository from list
- `input` events - Debounced search functionality
- `change` events - Filter and sort updates

### **Performance Optimizations**
- **Debounced Search**: 300ms delay to prevent excessive filtering
- **Event Delegation**: Single event listener for all repository cards
- **Virtual Scrolling**: Ready for large repository lists
- **Lazy Loading**: Dynamic repository card creation

---

## 🎨 **Styling System**

### **CSS Custom Properties**
```css
:root {
  /* Colors */
  --primary-color: #2563eb;
  --primary-dark: #1d4ed8;
  --text-color: #1e293b;
  --text-muted: #64748b;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Layout */
  --border-radius: 8px;
  --border-radius-lg: 12px;
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### **Theme Classes**
- `.professional` - Applied to body for professional theme
- `.price-is-right` - Applied to body for fun theme

### **Utility Classes**
- `.btn`, `.btn-primary`, `.btn-secondary` - Button variants
- `.sr-only` - Screen reader only content
- `.loading` - Loading state styling
- `.error` - Error state styling

---

## ♿ **Accessibility Guidelines**

### **ARIA Labels**
- All interactive elements have descriptive `aria-label` attributes
- Form fields have `aria-describedby` for error messages
- Loading states use `aria-live` regions

### **Keyboard Navigation**
- Tab order follows logical flow
- All interactive elements are keyboard accessible
- Modal focus management with focus trapping
- Escape key closes modals and dialogs

### **Screen Reader Support**
- Semantic HTML structure with proper headings
- Form labels properly associated with inputs
- Status updates announced via live regions
- Alternative text for decorative elements

### **Motion Preferences**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🔧 **Development Guidelines**

### **Component Creation Checklist**
- [ ] TypeScript interfaces for all props
- [ ] Comprehensive JSDoc documentation
- [ ] Error handling and loading states
- [ ] Responsive design implementation
- [ ] Accessibility compliance (ARIA, keyboard nav)
- [ ] Theme support (professional and Price is Right)
- [ ] Unit tests for complex logic
- [ ] Performance optimizations

### **Naming Conventions**
- **Components**: PascalCase (e.g., `RepositoryModal.astro`)
- **CSS Classes**: kebab-case with BEM methodology
- **JavaScript Variables**: camelCase
- **Event Names**: camelCase with descriptive suffixes

### **Code Organization**
```typescript
// 1. Imports and type definitions
// 2. Props interface and destructuring
// 3. Component logic and calculations
// 4. HTML template
// 5. Scoped styles
// 6. Component JavaScript/TypeScript
```

### **Testing Strategy**
- **Unit Tests**: Complex functions and calculations
- **Integration Tests**: Component interactions and data flow
- **E2E Tests**: Complete user workflows
- **Accessibility Tests**: Automated a11y testing

---

## 📈 **Performance Considerations**

### **Loading Optimization**
- Components lazy-load heavy dependencies
- Search debouncing prevents excessive operations
- Event delegation reduces memory usage
- Efficient DOM manipulation with minimal reflows

### **Bundle Size**
- Dynamic imports for optional features
- Tree shaking of unused utilities
- Optimized third-party dependencies
- Code splitting by route

### **Runtime Performance**
- Hardware-accelerated animations (transform, opacity)
- Efficient state management with minimal re-renders
- Optimized search algorithms
- Memory leak prevention with proper cleanup