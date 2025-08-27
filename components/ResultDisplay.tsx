import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import DownloadIcon from './icons/DownloadIcon';

interface ResultDisplayProps {
  originalImage: string;
  memojiImage: string;
  memojiBio: string;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  originalImage,
  memojiImage,
  memojiBio,
  onReset,
}) => {
  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${memojiImage}`;
    link.download = 'memoji.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadBio = () => {
    const blob = new Blob([memojiBio], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'memoji-bio.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-slate-300 mb-4">Your Photo</h2>
          <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-lg bg-slate-800">
            <img
              src={originalImage}
              alt="User uploaded"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-indigo-400 mb-4">Your Memoji</h2>
          <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-lg bg-slate-800 shadow-indigo-500/20">
            <img
              src={`data:image/png;base64,${memojiImage}`}
              alt="Generated memoji"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-12 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center mb-3">
          <SparklesIcon className="w-5 h-5 mr-2 text-yellow-400" />
          Character Bio
        </h3>
        <p className="text-slate-300 leading-relaxed">{memojiBio}</p>
      </div>

      <div className="mt-12 text-center flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
        <button
          onClick={handleDownloadImage}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-slate-100 font-semibold rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition-all transform hover:scale-105"
        >
          <DownloadIcon className="w-5 h-5" />
          Download Memoji
        </button>
        <button
          onClick={handleDownloadBio}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-slate-100 font-semibold rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition-all transform hover:scale-105"
        >
          <DownloadIcon className="w-5 h-5" />
          Download Bio
        </button>
        <button
          onClick={onReset}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
        >
          Create Another!
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;