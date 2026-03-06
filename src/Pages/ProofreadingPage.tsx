
import { useState } from 'react';
import { motion } from 'motion/react';

const ProofreadingPage = () => {
  const [text, setText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProofread = () => {
    setIsLoading(true);
    setCorrectedText('');
    // Simulate API call to a proofreading service
    setTimeout(() => {
      // Simple mock correction logic
      const mockCorrected = text
        .replace(/teh/gi, 'the')
        .replace(/wierd/gi, 'weird')
        .replace(/ a lot/gi, ' many')
        .replace(/, and/gi, ' and')
        .replace(/ i /gi, ' I ')
        .trim();
      setCorrectedText(`This is a mock correction. In a real application, this would be processed by an AI.\n\nOriginal: ${text}\n\nCorrected: ${mockCorrected}`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black tracking-tight uppercase mb-4">AI Proofreader</h1>
        <p className="text-zinc-500 font-medium max-w-2xl mx-auto">Paste your text below to have it proofread by our advanced AI. Note: This is a mock implementation.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-zinc-100">
        <textarea
          className="w-full h-48 p-4 border border-zinc-200 bg-zinc-50 rounded-lg focus:ring-zinc-500 focus:border-zinc-500 transition-all shadow-sm"
          placeholder="Enter text to proofread... For example: Teh wierd text had a lot of mistakes, and i wanted to fix them."
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

        {correctedText && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-2">Correction</h2>
            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 whitespace-pre-wrap font-mono text-sm">
              <p>{correctedText}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProofreadingPage;
