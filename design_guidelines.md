# Design Guidelines: Sistema de Controle de Tickets - Suporte Técnico de Bicicletas

## Design Approach

**Selected Approach:** Design System with Reference Inspiration

Drawing from Linear's clean ticket management interface and Notion's structured data presentation, combined with elements from productivity tools like Asana. This approach prioritizes information clarity, efficient workflows, and professional aesthetics suitable for technical support operations.

**Core Principles:**
- Information hierarchy: Critical ticket data must be immediately scannable
- Workflow efficiency: Minimize clicks to complete common tasks
- Status visibility: Clear visual indication of ticket progression
- Professional credibility: Design conveys reliability and technical competence

---

## Typography System

**Font Stack:**
- Primary: Inter (Google Fonts) - for UI elements, labels, and body text
- Display: Space Grotesk (Google Fonts) - for headings and emphasis

**Hierarchy:**
- Page Headers: Space Grotesk, 2xl to 3xl, font-bold
- Section Titles: Inter, xl, font-semibold
- Ticket Titles: Inter, lg, font-medium
- Body Text: Inter, base, font-normal
- Labels/Meta: Inter, sm, font-medium
- Supporting Text: Inter, sm, font-normal

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, and 16
- Tight spacing: p-2, gap-2 (for compact elements)
- Standard spacing: p-4, gap-4 (default component padding)
- Section spacing: p-6, p-8 (for cards and containers)
- Page margins: px-12, py-8 (for main content areas)

**Grid Structure:**
- Dashboard: Two-column layout with 16:9 ratio (sidebar navigation + main content area)
- Ticket List: Single column with full-width table/card layout
- Forms: Single column, max-w-2xl centered for optimal readability

---

## Component Library

### Navigation & Header
**Top Navigation Bar:**
- Full-width horizontal bar with max height h-16
- Logo/brand on left (text-based: "BikeSupport" with wrench icon from Heroicons)
- Navigation links centered (Dashboard, Novo Ticket)
- User menu/settings on right
- Subtle bottom border for definition
- Sticky positioning (sticky top-0)

### Dashboard Layout
**Main Content Container:**
- max-w-7xl centered with px-12 horizontal padding
- py-8 vertical spacing from header
- Grid layout for metrics cards at top (grid-cols-1 md:grid-cols-4 gap-4)

**Metrics Cards (Status Overview):**
- Compact cards showing count per status (Entrada, Cadastro, Em processamento, etc.)
- Each card: p-6, rounded-lg border
- Large number (text-3xl font-bold) with label below (text-sm)
- Arranged in horizontal grid above main ticket list

### Ticket List/Table
**Table Structure:**
- Full-width responsive table with alternating row treatment
- Columns: ID (narrow), Cliente, Email, Componente, Marca, Status, Data, Ações
- Column headers: text-xs font-semibold uppercase tracking-wide, py-3 px-4
- Data rows: py-4 px-4, text-sm
- Status badges inline with distinct visual treatment per stage
- Action buttons (Editar/Deletar) using Heroicons (PencilIcon, TrashIcon) in final column

**Mobile Adaptation:**
- Stack table into card layout below md breakpoint
- Each ticket as individual card with key info visible
- Expandable details on tap

### Status Badges
**Visual Treatment per Stage:**
- Entrada: Rounded pill badge, px-3 py-1, text-xs font-medium
- Cadastro: Similar treatment with different styling cue
- Em processamento: Animated subtle pulse effect
- Aprovado/Negado: Split visual (green/red indicators via border or icon)
- Finalizado: Muted treatment indicating completion

### Forms (Create/Edit Ticket)
**Form Container:**
- Centered card layout, max-w-2xl, p-8, rounded-lg with border
- Clear header with title and close/cancel option
- Stacked form fields with consistent vertical rhythm (space-y-6)

**Input Fields:**
- Label above input (text-sm font-medium, mb-2)
- Full-width inputs: px-4 py-3, rounded-lg, border
- Focus states with ring treatment (ring-2 ring-offset-2)
- Helper text below when needed (text-xs, mt-1)
- Required fields marked with asterisk in label

**Field Groups:**
- Cliente (nome + email in two-column grid on desktop: grid-cols-2 gap-4)
- Componente (componente + marca in two-column grid)
- Número de série (full width)
- Status (dropdown select with clear current value)
- Data (auto-populated, read-only display)

**Action Buttons:**
- Primary: Full-width on mobile, inline on desktop (px-6 py-3, rounded-lg)
- Secondary/Cancel: Ghost style adjacent to primary
- Button group aligned right with gap-3

### Modal/Dialog
**Edit Modal:**
- Overlay with backdrop blur
- Centered modal card: max-w-2xl, p-0 (padding handled internally)
- Modal header: px-8 py-6, bottom border, with close button (top-right)
- Modal body: px-8 py-6 with form content
- Modal footer: px-8 py-6, top border, with action buttons

### Empty States
**No Tickets View:**
- Centered container with icon from Heroicons (TicketIcon)
- Heading: "Nenhum ticket cadastrado"
- Description text with CTA button to create first ticket
- Vertical spacing: space-y-4

---

## Iconography
**Icon Library:** Heroicons (via CDN)

**Key Icons:**
- TicketIcon - ticket representation
- WrenchIcon - maintenance/repair context
- PlusIcon - create new ticket
- PencilIcon - edit action
- TrashIcon - delete action
- CheckCircleIcon - approved status
- XCircleIcon - denied status
- ClockIcon - in progress status

**Usage:** Icons at h-5 w-5 for inline elements, h-6 w-6 for prominent actions, h-16 w-16 for empty states

---

## Animations
Minimal, purposeful animations only:
- Modal enter/exit: Fade with subtle scale (duration-200)
- Status badge for "Em processamento": Subtle pulse animation
- Hover states: Simple opacity/scale changes (no elaborate transitions)
- Form validation: Shake animation for errors

---

## Images
**No hero images or marketing imagery** - this is a utility dashboard focused on data and workflows. Any visual elements should be functional (icons, status indicators, user avatars if applicable).