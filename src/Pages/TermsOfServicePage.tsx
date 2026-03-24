
import { motion } from 'framer-motion';

export function TermsOfServicePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-zinc-200 p-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-6">Terms of Service</h1>
        <div className="prose prose-zinc max-w-none">
          <p>Welcome to PDFile! These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions. Do not continue to use PDFile if you do not agree to all of the terms and conditions stated on this page.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. License to Use</h2>
          <p>Unless otherwise stated, PDFile and/or its licensors own the intellectual property rights for all material on PDFile. All intellectual property rights are reserved. You may access this from PDFile for your own personal use subjected to restrictions set in these terms and conditions.</p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from PDFile</li>
            <li>Sell, rent or sub-license material from PDFile</li>
            <li>Reproduce, duplicate or copy material from PDFile</li>
            <li>Redistribute content from PDFile</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. User Accounts</h2>
          <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
          <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Content</h2>
          <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
          <p>By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitation of Liability</h2>
          <p>In no event shall PDFile, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>
        </div>
      </div>
    </motion.div>
  );
}
