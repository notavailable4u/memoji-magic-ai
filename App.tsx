import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import * as geminiService from './services/geminiService';

import SparklesIcon from './components/icons/SparklesIcon';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Idle);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [memojiImage, setMemojiImage] = useState<string | null>(null);
  const [memojiBio, setMemojiBio] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setAppState(AppState.Idle);
    setOriginalImagePreview(null);
    setMemojiImage(null);
    setMemojiBio(null);
    setError(null);
    setLoadingMessage('');
  };

  const generateMemoji = useCallback(async (imageFile: File) => {
    setAppState(AppState.Loading);
    setError(null);

    try {
      setLoadingMessage('Analyzing your photo...');
      const description = await geminiService.generateMemojiDescription(imageFile);

      setLoadingMessage('Crafting your memoji masterpiece...');
      const [imageResult, bioResult] = await Promise.all([
        geminiService.generateMemojiImage(description),
        geminiService.generateMemojiBio(description),
      ]);

      setMemojiImage(imageResult);
      setMemojiBio(bioResult);
      setAppState(AppState.Success);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to create your memoji. Please try again. Details: ${errorMessage}`);
      setAppState(AppState.Error);
    }
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    generateMemoji(file);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.Loading:
        return <Loader message={loadingMessage} />;
      case AppState.Success:
        if (originalImagePreview && memojiImage && memojiBio) {
          return (
            <ResultDisplay
              originalImage={originalImagePreview}
              memojiImage={memojiImage}
              memojiBio={memojiBio}
              onReset={handleReset}
            />
          );
        }
        handleReset();
        setError("Something went wrong displaying the result. Please try again.");
        setAppState(AppState.Error);
        return null;
      case AppState.Error:
        return (
          <div className="text-center">
            <p className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        );
      case AppState.Idle:
      default:
        return (
          <>
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-400">
                Turn Your Photo into a Unique 3D Avatar
              </h2>
            </div>
            {/* FIX: The ImageUploader is only rendered when appState is Idle, so it should not be disabled. The previous comparison `appState === AppState.Loading` is always false here. */}
            <ImageUploader onImageUpload={handleImageUpload} disabled={false} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight flex items-center justify-center gap-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
              Memoji Magic AI
            </span>
            <SparklesIcon className="w-8 h-8 md:w-10 md:w-10 text-yellow-300" />
          </h1>
        </header>
        <div className="bg-slate-800/50 p-6 sm:p-10 rounded-3xl border border-slate-700 shadow-2xl shadow-indigo-900/20">
          {renderContent()}
        </div>
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Powered by Google Gemini and Imagen. Created for demonstration purposes.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;