
# Project Blueprint

## Overview

This project is a React-based web application that serves as a demonstration of modern AI-driven development practices. It leverages a powerful AI assistant to build, modify, and maintain the application, showcasing best practices in code quality, component design, and user experience. The application will follow an "Open-Core" model, with a free, open-source version and a "Pro" version with advanced features.

## Implemented Features

*   **Home Page:** A welcoming landing page that introduces the application.
*   **Team Page:** A page that introduces the "open-source mission" of the project.
*   **Tool Workspace:** A page to showcase the tools used in the project.
*   **Category Page:** A page to display different categories.
*   **Uniform Design:** A consistent and modern design language is used throughout the application, leveraging a theming and component library.
*   **Responsive Layout:** The application is designed to be responsive and work on various screen sizes.
*   **Navigation:** A clear and intuitive navigation bar allows users to move between pages.
*   **Split PDF Feature:** Users can split a PDF by providing page ranges. The tool now has two options:
    *   **Split by range:** Creates a separate PDF for each page range provided.
    *   **Extract pages:** Combines the selected pages into a single new PDF.

## Current Plan: Implement Open-Core Model

The current goal is to implement the "Open-Core" model by adding a new "Pro" feature and a pricing page.

### Steps:

1.  **Create `ProofreadingPage.tsx`:** A new page for an AI-powered proofreading tool, which will be a "Pro" feature.
2.  **Create `PricingPage.tsx`:** A new page to display the "Free" and "Pro" pricing plans.
3.  **Update Navigation:** Add links to the "AI Proofreader" and "Pricing" pages in the main navigation.
4.  **Maintain Design Consistency:** Ensure the new pages and components align with the existing design system.
