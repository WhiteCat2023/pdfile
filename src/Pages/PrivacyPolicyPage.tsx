
import { motion } from 'framer-motion';

export function PrivacyPolicyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-zinc-200 p-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-zinc max-w-none">
          <p>Your privacy is important to us. It is PDFile's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
          <p>We may collect the following information:</p>
          <ul>
            <li>Name and contact information including email address</li>
            <li>Documents and files you upload to our service</li>
            <li>Usage data and analytics to help us improve our services</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Use of Information</h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul>
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Security of Your Information</h2>
          <p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>
          <p>We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies</h2>
          <p>We use cookies to help us improve our services. A cookie is a small file that is placed on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some parts of our Service.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Links to Other Sites</h2>
          <p>Our Service may contain links to other sites that are not operated by us. If you click a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
        </div>
      </div>
    </motion.div>
  );
}
