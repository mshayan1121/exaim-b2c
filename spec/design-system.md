# ExAIm B2C — Design System

## Design Philosophy
- Clean, modern, slightly gamified
- Professional enough for teachers, engaging enough for students aged 14-18
- Never looks AI generated or like a default shadcn template
- Generous whitespace — especially on exam screens
- Every screen has clear visual hierarchy
- Dark mode supported on all components

---

## Colour Palette

### Brand Colours
```css
--primary: #4F46E5        /* Indigo — main brand colour */
--primary-hover: #4338CA  /* Darker indigo for hover states */
--primary-foreground: #FFFFFF

--accent: #10B981         /* Emerald green — success, XP, gamification */
--accent-hover: #059669
--accent-foreground: #FFFFFF

--warning: #F59E0B        /* Amber — warnings, deadlines */
--warning-foreground: #FFFFFF

--destructive: #EF4444    /* Red — errors, delete actions */
--destructive-foreground: #FFFFFF
```

### Light Mode
```css
--background: #FFFFFF
--surface: #F8FAFC        /* Slightly off-white for cards and panels */
--surface-raised: #FFFFFF /* Cards that sit above surface */
--border: #E2E8F0
--border-subtle: #F1F5F9

--text-primary: #0F172A   /* Near black for headings */
--text-secondary: #475569 /* Muted for body text */
--text-tertiary: #94A3B8  /* Subtle for labels, placeholders */
```

### Dark Mode
```css
--background: #0F172A     /* Deep navy — not pure black */
--surface: #1E293B        /* Slightly lighter for cards */
--surface-raised: #293548
--border: #334155
--border-subtle: #1E293B

--text-primary: #F8FAFC
--text-secondary: #94A3B8
--text-tertiary: #64748B
```

### Gamification Colours
```css
--xp: #F59E0B             /* Gold for XP points */
--streak: #EF4444         /* Red/orange for streaks */
--badge: #8B5CF6          /* Purple for badges */
--level: #10B981          /* Green for level ups */
```

---

## Typography

### Font Family
- **Primary:** Inter (Google Fonts)
- **Math:** KaTeX default font (auto applied by KaTeX)
- **Monospace:** JetBrains Mono (for code if needed)

### Type Scale
```css
--text-xs: 0.75rem      /* 12px — labels, captions */
--text-sm: 0.875rem     /* 14px — secondary text, metadata */
--text-base: 1rem       /* 16px — body text */
--text-lg: 1.125rem     /* 18px — slightly emphasised body */
--text-xl: 1.25rem      /* 20px — card titles */
--text-2xl: 1.5rem      /* 24px — section headings */
--text-3xl: 1.875rem    /* 30px — page headings */
--text-4xl: 2.25rem     /* 36px — hero headings */
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Line Heights
- Body text: 1.6
- Headings: 1.2
- Labels: 1.4

---

## Spacing Scale
Follow Tailwind's default spacing scale strictly.
Key spacings to use consistently:
- **4px (1)** — tight gaps between related elements
- **8px (2)** — inner padding for small components
- **12px (3)** — gaps between list items
- **16px (4)** — standard inner padding
- **24px (6)** — section padding, card padding
- **32px (8)** — between sections
- **48px (12)** — large section gaps
- **64px (16)** — page level spacing

---

## Border Radius
```css
--radius-sm: 6px    /* Small elements — badges, tags */
--radius-md: 10px   /* Cards, inputs, buttons */
--radius-lg: 16px   /* Modals, large cards */
--radius-xl: 24px   /* Feature cards, hero sections */
--radius-full: 9999px /* Pills, avatars, progress bars */
```

---

## Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.05)
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)
--shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.03)
```
Never use heavy shadows. Subtle elevation only.

---

## Component Rules

### Buttons
```
Primary   — bg-primary text-white, hover:bg-primary-hover
Secondary — bg-surface border border-border text-text-primary
Danger    — bg-destructive text-white
Ghost     — transparent, hover:bg-surface
```
- Height: 40px (default), 36px (sm), 48px (lg)
- Border radius: radius-md
- Font weight: font-medium
- Always show loading spinner when async action is in progress
- Always disable during loading

### Cards
- Background: surface-raised
- Border: 1px solid border
- Border radius: radius-lg
- Padding: 24px
- Shadow: shadow-md
- Never use heavy drop shadows

### Inputs
- Height: 40px
- Border: 1px solid border
- Border radius: radius-md
- Focus: 2px ring in primary colour
- Error state: border-destructive with error message below
- Always show label above input, never placeholder as label

### Badges / Tags
- Border radius: radius-full
- Font size: text-xs
- Font weight: font-medium
- Padding: 2px 10px

### Modals
- Max width: 560px (default), 720px (large)
- Border radius: radius-xl
- Backdrop: black/50 blur
- Always include close button top right

### Tables
- Header: bg-surface, font-semibold, text-sm
- Row hover: bg-surface
- Border: border-subtle between rows
- Never use heavy borders

---

## Gamification UI Rules

### XP Bar
- Full width progress bar
- Colour: --xp (gold)
- Border radius: radius-full
- Show current XP / XP to next level
- Animate on XP gain

### Streak Counter
- Flame icon with streak number
- Colour: --streak
- Prominently shown on student dashboard
- Pulse animation when streak is active today

### Badges
- Circular icon with colour background
- Locked badges shown in greyscale
- Tooltip on hover showing badge name and criteria
- Colour: --badge (purple)

### Level Display
- Show level name and number
- Progress bar to next level
- Celebrate level up with subtle animation

---

## Screen Specific Rules

### Exam Taking Interface
- Clean white (light) or deep navy (dark) background
- No sidebar during active exam
- Question number and progress bar at top
- Timer in top right — amber when under 5 mins, red when under 1 min
- Math keyboard accessible via floating button — does not cover question
- Flag for review button per question
- Submit button only appears after all questions attempted
- Zero distractions — no notifications during active exam

### Student Dashboard
- Streak and XP prominently at top
- Assigned exams sorted by deadline (soonest first)
- Weak topic alerts shown as cards with action button
- Daily challenge card always visible
- Recent results below

### Teacher Dashboard
- Class selector at top if multiple classes
- Class average prominently shown
- Students who haven't submitted highlighted
- Weak topics shown as a ranked list
- Quick assign button always accessible

### Admin Panel
- Sidebar navigation always visible
- Content hierarchy (Qual → Board → Subject → Topic → Sub-topic) as breadcrumb
- Table views for all list pages
- Inline editing where possible
- Bulk actions supported on tables

### Results and Feedback Screen
- Score shown large and prominently
- Colour coded — green (high), amber (medium), red (low)
- Mark by mark breakdown as a checklist
- AI feedback in a styled card — distinct from the rest of the UI
- Model answer collapsible — hidden by default, shown on click
- Retry button always visible
- AI tutor button prominently placed after feedback

---

## States — Required on Every Component

### Loading State
- Use skeleton loaders for content areas
- Use spinner inside buttons
- Never show blank white screens

### Empty State
- Always show an illustration or icon
- Clear message explaining why it's empty
- Action button where relevant (e.g. "Create your first class")

### Error State
- Clear friendly error message
- Never show technical errors to users
- Retry button where relevant

---

## Dark Mode Rules
- All components must support dark mode using Tailwind dark: prefix
- Test every screen in both modes
- Never hardcode colours — always use CSS variables or Tailwind semantic classes
- Images and illustrations should work in both modes

---

## Do Not
- Use default unstyled shadcn components without customisation
- Use arbitrary Tailwind values (e.g. w-[347px]) unless absolutely necessary
- Use inline styles
- Use pure black (#000000) or pure white (#FFFFFF) for backgrounds
- Use more than 2 font weights on one screen
- Use heavy drop shadows
- Leave any component without loading, empty and error states
- Make exam screens feel cluttered or distracting