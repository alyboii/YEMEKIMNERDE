# Design System: YEMEKİMNERDE
**Source:** Google Stitch — Uber-style Dark Mode

## 1. Visual Theme & Atmosphere
Pitch-black, high-contrast, utilitarian. The aesthetic is urban, fast, and confident — inspired by Uber Eats. A single neon green accent cuts through the void, giving the app an electric, premium feel. Zero visual noise; every element earns its space.

## 2. Color Palette & Roles

| Name | Hex | Role |
|------|-----|------|
| Void Black | `#000000` | Splash/onboarding background |
| Surface | `#121212` / `#131313` | Main screen background |
| Card / Level-2 | `#1E1E1E` | Card backgrounds |
| Surface Container | `#1F1F1F` | Input field backgrounds |
| Surface Container High | `#2A2A2A` | Elevated containers |
| Border Subtle | `#2C2C2C` | Card borders, dividers |
| Neon Green (Primary Container) | `#00E676` | Primary buttons, badges, active indicators |
| Neon Green Light (Primary) | `#75FF9E` | Highlighted/hovered primary text |
| Primary Glow | `rgba(0,230,118,0.3)` | Button shadow glow |
| Text Primary | `#FFFFFF` | Headers, primary text |
| Text Secondary | `#A0A0A0` | Body text, subtitles |
| On-Primary (Inverse) | `#000000` | Text on green buttons |
| Error | `#FFB4AB` | Error states |
| Accent Orange | `#E2A257` | Optional warm accent |

## 3. Typography Rules
- **Headlines:** Plus Jakarta Sans — Bold (700) to ExtraBold (800), tight letter-spacing
- **Body/Labels:** Inter — Regular (400) to Bold (700)
- **Hierarchy:** XL 40px → LG 32px → MD 20px → Body 16/14px → Caption 12px

## 4. Component Stylings
- **Buttons (Primary):** Pill-shaped (border-radius: 9999px), solid Neon Green fill, black text, green glow shadow
- **Cards:** Dark gray (#121212), rounded-[18px], 1px white/5% border, no drop shadows
- **Inputs:** Dark (#1F1F1F) background, subtle border (#2C2C2C), rounded-lg (8px), green focus ring
- **Dividers:** 1px white at 5% opacity

## 5. Layout Principles
- 8pt base grid, 20px mobile margin, 40px desktop margin
- Generous vertical spacing between sections
- Full-bleed bottom action bars on mobile
