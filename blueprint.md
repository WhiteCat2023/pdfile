# Project Blueprint

## Overview

This project is a web-based PDF utility application built with React and Vite. It provides users with a suite of tools to manipulate PDF files directly in the browser. The application is designed to be fast, secure, and user-friendly, with a modern and intuitive interface.

### Key Features

- **PDF Merging:** Combine multiple PDF files into a single document.
- **PDF Splitting:** Split a PDF into multiple files by page ranges or by extracting specific pages.
- **PDF Compression:** Reduce the file size of a PDF.
- **PDF to Word:** Convert a PDF file to a Microsoft Word document.
- **Word to PDF:** Convert a Microsoft Word document to a PDF file.
- **PDF to JPG:** Convert each page of a PDF file to a JPG image.
- **PDF Editing:** Add text, shapes, and images to a PDF file.
- **PDF Protection:** Add a password to a PDF file to encrypt it.
- **PDF Unlocking:** Remove a password from a PDF file.

## File Structure

```
.
├── .idx
│   ├── dev.nix
│   ├── icon.png
│   └── integrations.json
├── public
│   └── vite.svg
├── src
│   ├── assets
│   │   ├── Arl_Jacob_Necesario.png
│   │   ├── Berndt_Dennis_Canaya.jpg
│   │   ├── Berndt_Dennis_Canaya.png
│   │   ├── Ethan_Gabriel_Rolloque.jpg
│   │   ├── Ethan_Gabriel_Rolloque.png
│   │   ├── Josiah_Ephraim_Lago.png
│   │   ├── Lance_Keith_Fajardo.jpg
│   │   ├── Lance_Keith_Fajardo.png
│   │   └── react.svg
│   ├── components
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Notification.tsx
│   │   ├── ParticleBackground.tsx
│   │   ├── SuccessDialog.tsx
│   │   └── UpgradeModal.tsx
│   ├── contexts
│   │   ├── AuthContext.tsx
│   │   └── UsageContext.tsx
│   ├── Pages
│   │   ├── CategoryPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── PricingPage.tsx
│   │   ├── ProofreadingPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── TeamPage.tsx
│   │   ├── ToolWorkspace.tsx
│   │   └── Subpage
│   │       ├── AnnotationList.tsx
│   │       ├── AnnotationRenderer.tsx
│   │       ├── CompressOptions.tsx
│   │       ├── EditCanvas.tsx
│   │       ├── EditContainer.tsx
│   │       ├── EditToolbar.tsx
│   │       ├── FileList.tsx
│   │       ├── FileUpload.tsx
│   │       ├── PropertiesPanel.tsx
│   │       ├── ProtectPassword.tsx
│   │       ├── SplitOptions.tsx
│   │       ├── ToolHeader.tsx
│   │       └── UnlockPassword.tsx
│   ├── utils
│   │   └── pdf.ts
│   ├── App.css
│   ├── App.tsx
│   ├── App.txt
│   ├── constants.ts
│   ├── firebase.ts
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── .gitignore
├── blueprint.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Dependencies

### Main Dependencies

- **@cantoo/pdf-lib:** A library for creating and modifying PDF documents.
- **@tailwindcss/postcss:** A PostCSS plugin for Tailwind CSS.
- **@types/file-saver:** Type definitions for file-saver.
- **@types/jszip:** Type definitions for jszip.
- **file-saver:** A library for saving files on the client-side.
- **firebase:** A platform for building web and mobile applications.
- **framer-motion:** A library for creating animations in React.
- **jszip:** A library for creating, reading, and editing .zip files.
- **lucide-react:** A library of simply beautiful icons.
- **mammoth:** A library for converting .docx files to HTML.
- **pdf-lib:** A library for creating and modifying PDF documents.
- **pdfjs-dist:** A library for parsing and rendering PDF files.
- **react:** A JavaScript library for building user interfaces.
- **react-dom:** A package for working with the DOM in React.
- **react-router-dom:** A library for routing in React applications.
- **react-tsparticles:** A lightweight library for creating particles.
- **tsparticles-slim:** A slim version of tsparticles.

### Development Dependencies

- **@eslint/js:** The core ESLint library.
- **@types/node:** Type definitions for Node.js.
- **@types/react:** Type definitions for React.
- **@types/react-dom:** Type definitions for React DOM.
- **@vitejs/plugin-react:** A Vite plugin for React.
- **autoprefixer:** A PostCSS plugin to parse CSS and add vendor prefixes to CSS rules.
- **eslint:** A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- **eslint-plugin-react-hooks:** An ESLint plugin for React Hooks.
- **eslint-plugin-react-refresh:** An ESLint plugin for React Refresh.
- **globals:** A package with global variables for ESLint.
- **postcss:** A tool for transforming CSS with JavaScript.
- **tailwindcss:** A utility-first CSS framework.
- **typescript:** A typed superset of JavaScript.
- **typescript-eslint:** A tool for using TypeScript with ESLint.
- **vite:** A build tool that aims to provide a faster and leaner development experience for modern web projects.

## Scripts

- **dev:** Starts the development server.
- **build:** Builds the application for production.
- **lint:** Lints the codebase.
- **preview:** Starts a local server to preview the production build.
