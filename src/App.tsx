
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import { PDF_TOOLS, CONTRIBUTORS } from './constants';
import { ToolWorkspaceWrapper } from './Pages/ToolWorkspace';
import { HomePage } from './Pages/HomePage';
import { CategoryPage } from './Pages/CategoryPage';
import { TeamPage } from './Pages/TeamPage';
import ProofreadingPage from './Pages/ProofreadingPage';
import PricingPage from './Pages/PricingPage';
import { LoginPage } from './Pages/LoginPage';
import { SignupPage } from './Pages/SignupPage';
import { ForgotPasswordPage } from './Pages/ForgotPasswordPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UsageProvider } from './contexts/UsageContext';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <UsageProvider>
        <div className="min-h-screen flex flex-col">
          <Header />

          <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <Routes location={location}>
                  <Route path="/" element={<HomePage tools={PDF_TOOLS} />} />
                  <Route path="/team" element={<TeamPage contributors={CONTRIBUTORS} />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/proofreading" element={<ProofreadingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/merge" element={<CategoryPage category="merge" tools={PDF_TOOLS.filter(t => t.category === 'merge')} />} />
                  <Route path="/split" element={<CategoryPage category="split" tools={PDF_TOOLS.filter(t => t.category === 'split')} />} />
                  <Route path="/convert" element={<CategoryPage category="convert" tools={PDF_TOOLS.filter(t => t.category === 'convert')} />} />
                  <Route path="/compress" element={<CategoryPage category="compress" tools={PDF_TOOLS.filter(t => t.category === 'compress')} />} />
                  <Route path="/tool/:id" element={<ToolWorkspaceWrapper />} />
                </Routes>
              </motion.div>

          </main>

          <Footer />
        </div>
      </UsageProvider>
    </AuthProvider>
  );
}
