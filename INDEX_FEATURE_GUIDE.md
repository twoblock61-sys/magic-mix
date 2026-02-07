# Document Index Feature Implementation

## Overview
Added a smart document index feature that provides navigation for note headings without reducing editor space.

## Key Features

### 1. **Focus Mode** - Left Sidebar Index Panel
When entering focus mode, a professional index panel appears on the left side:
- Shows hierarchical heading structure (H1, H2, H3)
- Color-coded by level:
  - H1: Full color dot (primary)
  - H2: 70% opacity
  - H3: 40% opacity
- Clicking any heading smoothly scrolls to that section
- Auto-hidden when exiting focus mode
- Full width allocated for optimal UX

### 2. **Normal Mode** - Floating Popover Button
In regular editing mode, the index is accessible via a floating button:
- Appears on the left side as a circular button
- Badge shows total number of sections
- Opens a sleek popover modal on click
- Auto-closes when selecting a heading
- Takes **zero permanent layout space**
- Can be dismissed by clicking the backdrop

## Technical Implementation

### Files Created
1. **`src/hooks/useHeadingIndex.ts`**
   - Extracts headings from note blocks
   - Generates hierarchical index structure
   - Provides `scrollToHeading()` function
   - Uses `data-block-id` attribute to locate elements

2. **`src/components/IndexPanel.tsx`**
   - Left sidebar panel (focus mode only)
   - Shows heading hierarchy with indentation
   - Smooth animations using Framer Motion
   - Stats footer showing total sections

3. **`src/components/IndexPopover.tsx`**
   - Floating button + modal (normal mode)
   - Appears on left side at screen center
   - Badge with section count
   - Beautiful hover states and transitions

### Files Modified
1. **`src/components/NoteEditorFull.tsx`**
   - Integrated useHeadingIndex hook
   - Added IndexPanel (visibility based on focusMode)
   - Added IndexPopover (visibility based on !focusMode)
   - Restructured layout with flex container

2. **`src/components/NotionEditor.tsx`**
   - Added `data-block-id` attribute to block containers
   - Enables scroll-to-heading functionality

## UX Flow

### Creating Content with Index
1. User starts writing with headings:
   - Use "/" command → Select "Heading 1", "Heading 2", or "Heading 3"
   - Type heading content
   - Continue writing

2. **In Normal Mode:**
   - User clicks floating index button (left side)
   - Popover opens showing all headings
   - Click any heading to jump there
   - Popover auto-closes

3. **In Focus Mode:**
   - User clicks focus mode button (top right)
   - Left sidebar panel appears automatically
   - Index always visible for easy navigation
   - Smooth scroll animations when clicking headings
   - Headings get highlighted with ring animation
   - Press Esc or click button to exit focus mode

## Design Highlights

### Index Panel (Focus Mode)
```
┌─────────────────────────────────────────────────┐
│ 📖 Document Index                               │
│ Navigate by sections                            │
├─────────────────────────────────────────────────┤
│ • Main Heading 1                                │
│   ◦ Sub Heading 2                               │
│     ▪ Sub-sub Heading 3                         │
│ • Another Main Heading                          │
│   ◦ Second Level                                │
├─────────────────────────────────────────────────┤
│ 4 sections                                      │
└─────────────────────────────────────────────────┘
```

### Index Popover (Normal Mode)
```
┌─────────────────────────┐
│ 📖 Document Index   [×] │
├─────────────────────────┤
│ ➤ Heading 1             │
│   ➤ Subheading 2        │
│   ➤ Another Subheading  │
│ ➤ Heading 1             │
├─────────────────────────┤
│ 4 sections              │
└─────────────────────────┘
```

## Styling Features

### Colors & Hierarchy
- **H1 (Heading 1):** Largest text, bold, full primary color
- **H2 (Heading 2):** Medium text, medium weight, 70% opacity
- **H3 (Heading 3):** Smallest text, 75% opacity

### Interactions
- **Hover:** 4px right slide animation
- **Click:** Scale down to 0.98
- **Scroll:** Smooth behavior with 1.5s highlight ring
- **Animations:** Framer Motion for all transitions

## How to Use

### For End Users
1. **Create headings** in your note using "/" menu
2. **Normal editing:** Click the floating index button to navigate
3. **Focus reading:** Enter focus mode to see the index panel
4. **Jump to sections:** Click any heading in the index

### For Developers
```tsx
// The index automatically:
1. Extracts all heading blocks from note.blocks
2. Maintains hierarchical structure (indent levels)
3. Listens to block changes via useHeadingIndex hook
4. Provides smooth scroll-to-heading functionality
5. Highlights the target heading when scrolled to
```

## Performance Considerations
- Index is memoized using `useMemo` in useHeadingIndex
- Only updates when blocks change
- Smooth scroll uses native browser API
- Zero impact on editor performance
- Floating button in normal mode uses minimal layout resources

## Browser Compatibility
- Works with all modern browsers supporting:
  - CSS Flexbox
  - CSS Backdrop Filter (gracefully degrades)
  - Element.scrollIntoView() with smooth behavior
  - Data attributes

## Future Enhancements
- [ ] Search within index
- [ ] Pin frequently used sections
- [ ] Keyboard shortcuts for navigation (Ctrl+K)
- [ ] Index export as outline
- [ ] Collapse/expand sections in panel
- [ ] Custom color schemes for headings
- [ ] Line numbering in focus mode
- [ ] Breadcrumb navigation showing current section
