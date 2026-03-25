# PDF Utility Application

This is a web-based PDF utility application built with React and Vite. It provides users with a suite of tools to manipulate PDF files directly in the browser. The application is designed to be fast, secure, and user-friendly, with a modern and intuitive interface.

## Core Features

- **PDF Merging:** Combine multiple PDF files into a single document.
- **PDF Splitting:** Split a PDF into multiple files by page ranges or by extracting specific pages.
- **PDF Compression:** Reduce the file size of a PDF.
- **PDF to Word:** Convert a PDF file to a Microsoft Word document.
- **Word to PDF:** Convert a Microsoft Word document to a PDF file.
- **PDF to JPG:** Convert each page of a PDF file to a JPG image.
- **PDF Editing:** Add text, shapes, and images to a PDF file.
- **PDF Protection:** Add a password to a PDF file to encrypt it.
- **PDF Unlocking:** Remove a password from a PDF file.
- **AI Proofreader:** Proofread text using an advanced AI for grammar, spelling, punctuation, and style.

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
│   │   ├── gemini.ts
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

## Tools & Technologies

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A build tool that provides a faster and leaner development experience.
- **TypeScript:** A typed superset of JavaScript.
- **Tailwind CSS:** A utility-first CSS framework.
- **Firebase:** A platform for building web and mobile applications.
- **pdf-lib:** A library for creating and modifying PDF documents.
- **Gemini AI:** Used for the AI Proofreader feature.
- **Framer Motion:** A library for creating animations in React.
- **Lucide React:** A library of simply beautiful icons.

## Developer Credits

This project was developed by a talented team of developers:

- Arl Jacob Necesario
- Berndt Dennis Canaya
- Ethan Gabriel Rolloque
- Josiah Ephraim Lago
- Lance Keith Fajardo
