# Component Architecture (Atomic Design)

This project follows **Atomic Design** methodology for organizing UI components. Components are structured into three tiers: **atoms**, **molecules**, and **organisms**.

## Folder Structure

```
components/
├── atoms/           # Smallest UI building blocks
│   ├── Button.tsx
│   └── index.ts
├── molecules/       # Combinations of atoms (future use)
│   └── index.ts
├── organisms/       # Complex, self-contained UI sections
│   ├── About.tsx
│   ├── AddProduct.tsx
│   ├── AdminOrders.tsx
│   ├── Benefits.tsx
│   ├── CartSummary.tsx
│   ├── CheckOutForm.tsx
│   ├── EnquiryForm.tsx
│   ├── Hero.tsx
│   ├── InteractiveMap.tsx
│   ├── TopPicksForYou.tsx
│   ├── Navbar.tsx
│   ├── ProductExcellence.tsx
│   ├── UPIPayment.tsx
│   └── ... (all page-level components)
├── ARCHITECTURE.md  # This file
└── [re-exports]     # Backward-compatible exports (Navbar.tsx, Hero.tsx, etc.)
```

## Atomic Design Tiers

### Atoms
**Definition:** Basic HTML elements with minimal styling. Cannot be broken down further without losing meaning.

**Examples:**
- `Button` - Reusable button with variants (primary, secondary, outline)
- Future: `Input`, `Label`, `Badge`, `Icon`

**Import:** `import { Button } from '@/components/atoms'`

### Molecules
**Definition:** Groups of atoms bonded together. Simple combinations that form functional units.

**Examples (future):**
- `ProductCard` - Image + name + price + add-to-cart button
- `FormField` - Label + input + error message
- `SearchBar` - Input + search icon

**Import:** `import { ProductCard } from '@/components/molecules'`

### Organisms
**Definition:** Complex UI components composed of molecules and atoms. Distinct sections that function as a unit.

**Examples:**
- `Navbar` - Site navigation with logo, links, cart, search
- `Hero` - Landing page hero section with headline and CTA
- `ProductExcellence` - Product showcase section
- `CheckOutForm` - Full checkout form with validation

**Import:** `import Navbar from '@/components/Navbar'` (or `import { Navbar } from '@/components/organisms'`)

## Backward Compatibility

Re-export files in the `components/` root (e.g., `Navbar.tsx`, `Hero.tsx`) maintain backward compatibility. Existing imports like `import Navbar from '@/components/Navbar'` continue to work by re-exporting from `organisms/`.

## Theme (Leaf)

The design system uses CSS variables defined in `globals.css`:
- `--leaf-50` through `--leaf-900` - Primary green palette
- `--stem`, `--stem-light` - Accent brown/tan
- `--cream`, `--paper` - Neutral backgrounds

## Adding New Components

1. **Atom:** Create in `atoms/`, export from `atoms/index.ts`
2. **Molecule:** Create in `molecules/`, export from `molecules/index.ts`
3. **Organism:** Create in `organisms/`, add re-export in `components/` root if needed for backward compatibility
