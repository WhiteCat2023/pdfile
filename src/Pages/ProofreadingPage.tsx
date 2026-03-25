
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { proofreadText } from '../utils/gemini';
import { useUsage } from '../contexts/UsageContext';
import { UpgradeModal } from '../components/UpgradeModal';

const ProofreadingPage = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [correctedText, setCorrectedText] = useState('');
  const [changesList, setChangesList] = useState<string[]>([]);

  const { isLimitReached, recordUsage } = useUsage();

  const handleProofread = useCallback(async () => {
    if (isLimitReached) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCorrectedText('');
    setChangesList([]);

    try {
      // The new function handles model initialization, content generation, and JSON parsing.
      const proofreadData = await proofreadText(text);

      setCorrectedText(proofreadData.correctedText);
      setChangesList(proofreadData.changes);
      recordUsage();
    } catch (err) {
      console.error("Proofreading failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Proofreading failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [text, isLimitReached, recordUsage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black tracking-tight uppercase mb-4">AI Proofreader</h1>
        <p className="text-zinc-500 font-medium max-w-2xl mx-auto">Paste your text below to have it proofread by our advanced AI for grammar, spelling, punctuation, and style.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-zinc-100">
        <textarea
          className="w-full h-48 p-4 border border-zinc-200 bg-zinc-50 rounded-lg focus:ring-zinc-500 focus:border-zinc-500 transition-all shadow-sm"
          placeholder="For example: teh wierd text had a lot of mistakes, and i wanted to fix them."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="mt-4 px-8 py-3 bg-zinc-900 text-white rounded-full font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleProofread}
          disabled={isLoading || !text}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Proofreading...
            </>
          ) : (
            'Proofread Text'
          )}
        </button>

        {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                <p>{error}</p>
            </div>
        )}

        {correctedText && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Corrected Text</h2>
            <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-200 whitespace-pre-wrap text-lg leading-relaxed">
              <p>{correctedText}</p>
            </div>
          </div>
        )}

        {changesList.length > 0 && (
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Summary of Changes</h2>
                <ul className="list-disc list-inside bg-zinc-50 p-6 rounded-lg border border-zinc-200 space-y-2">
                    {changesList.map((change, index) => (
                        <li key={index} className="text-zinc-700">{change}</li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProofreadingPage;