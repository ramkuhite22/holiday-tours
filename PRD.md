# Product Requirements Document: Vidarbha Holiday Tours Website Modernization

## 1. Overview & Goals
The goal of this project is to modernize the legacy Vidarbha Holiday Tours website, transforming a set of outdated, poorly styled HTML pages into a cohesive, highly aesthetic, fully responsive, and interactive single-page-style web application.

The modern site will use the parsed data from `data/districts.json` and the project overview from `data/project.json` to present:
1. A beautiful, immersive landing page with a hero section, overview stat chips, and a grid of all 12 districts in the Vidarbha region.
2. An interactive district explorer allowing users to see fast facts, tourist attractions, how to reach, travel tips, and maps for each district.
3. Interactive project documentation sections (Introduction, Objectives, Scope, Limitations, etc.) loaded dynamically.
4. Fully modernized and polished "About Us" and "Contact Us" pages/sections.
5. Consistent branding, typography (Google Fonts - Inter/Outfit), and premium UI components using glassmorphism, smooth gradients, and micro-animations.

## 2. Target Audience
Travelers looking to explore the Vidarbha region of Maharashtra, India, and students/reviewers examining the project design.

## 3. Key Features
- **Dynamic Content Loading:** Fetch and load `data/districts.json` and `data/project.json` using JavaScript fetch API.
- **District Grid & Filters:** Render all 12 districts with cards showing fast facts. Allow searching or filtering by name or category.
- **Rich District Detail View:** A tabbed layout showing:
  - **Overview & Fast Facts:** Beautifully structured cards.
  - **Tourist Attractions:** Dynamic cards with description and image.
  - **Places of Worship:** Sorted by category (Temples, Churches, Masjids).
  - **How to Reach:** Detailed instructions for Air, Train, and Road.
  - **Travel Tips:** Helpful hospital, bank, and hotel contacts.
  - **Interactive Map:** Display the map image gracefully with a modal preview.
- **Project Section Explorer:** A sidebar-navigation page/view showing academic details of the Holiday Tours project.
- **Contact Us & About Us:** Modern forms with visual validations and rich layouts.
- **Responsive Navigation:** A persistent, modern navbar supporting smooth transitions between Home, Districts, Project Info, About, and Contact.

## 4. Design Guidelines (Aesthetics)
- **Palette:** HSL-tailored colors. Warm sandy backgrounds (`#fbf9f4`), deep forest/ocean teal primary accents (`#115d59`), soft terracotta warm secondary accents (`#e07a5f`), and glassmorphism styling.
- **Typography:** Google Fonts (Outfit for headings, Inter for body).
- **Interactions:** Subtle hover lifts, fade-in animations on load (IntersectionObserver), transition-based navigation.
- **Accessibility:** Semantic HTML5 tags, `aria-*` tags where appropriate, unique IDs for testing.

## 5. Verification Plan
- Verify page load times and dynamic JSON loading.
- Verify responsive layout across mobile, tablet, and desktop viewports.
- Validate contact form interactive states.
- Ensure all 12 districts and their content render correctly.
