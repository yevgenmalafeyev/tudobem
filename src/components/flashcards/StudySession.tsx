'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { FlashcardCollection, Flashcard } from '@/types';

interface StudySessionProps {
  collection: FlashcardCollection;
  onBack: () => void;
}

export default function StudySession({ collection, onBack }: StudySessionProps) {
  const { updateCard } = useStore();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    // Shuffle cards for study session
    const shuffled = [...collection.cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  }, [collection.cards]);

  const currentCard = shuffledCards[currentCardIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficultyResponse = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (currentCard) {
      updateCard(collection.id, currentCard.id, {
        difficulty,
        lastReviewed: new Date(),
        reviewCount: currentCard.reviewCount + 1
      });
    }

    // Move to next card
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      setSessionComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    const shuffled = [...collection.cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  };

  if (collection.cards.length === 0) {
    return (
      <div className="text-center">
        <div className="neo-card py-12">
          <p className="text-lg mb-4" style={{ color: 'var(--neo-text-muted)' }}>
            Esta coleção não tem cartões para estudar
          </p>
          <button
            onClick={onBack}
            className="neo-button neo-button-primary text-sm sm:text-base min-h-[44px] px-6 py-2"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="text-center">
        <div className="neo-card py-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--neo-text)' }}>
            Sessão Completa!
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--neo-text-muted)' }}>
            Estudaste {shuffledCards.length} cartões da coleção &quot;{collection.name}&quot;
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRestart}
              className="neo-button neo-button-primary text-sm sm:text-base min-h-[44px] px-6 py-2"
            >
              Estudar Novamente
            </button>
            <button
              onClick={onBack}
              className="neo-button text-sm sm:text-base min-h-[44px] px-6 py-2"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="neo-button text-sm sm:text-base min-h-[44px] px-4 py-2"
        >
          ← Sair
        </button>
        <div className="text-center">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--neo-text)' }}>
            {collection.name}
          </h2>
          <p className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
            {currentCardIndex + 1} de {shuffledCards.length}
          </p>
        </div>
        <div className="w-24"></div>
      </div>

      {/* Progress Bar */}
      <div className="neo-inset rounded-full h-2 mb-8">
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ 
            width: `${((currentCardIndex + 1) / shuffledCards.length) * 100}%`,
            background: 'var(--neo-accent)'
          }}
        />
      </div>

      {/* Card */}
      <div className="mb-8">
        <div 
          className={`neo-card cursor-pointer transition-all duration-300 min-h-[300px] flex items-center justify-center ${
            isFlipped ? 'neo-inset' : 'neo-outset'
          }`}
          onClick={handleFlip}
        >
          <div className="text-center p-6">
            <div className="text-sm font-medium mb-4" style={{ color: 'var(--neo-text-muted)' }}>
              {isFlipped ? 'Verso' : 'Frente'}
            </div>
            <div className="text-xl sm:text-2xl font-medium" style={{ color: 'var(--neo-text)' }}>
              {isFlipped ? currentCard?.back : currentCard?.front}
            </div>
            <div className="text-sm mt-6" style={{ color: 'var(--neo-text-muted)' }}>
              {isFlipped ? 'Clica para ver a frente' : 'Clica para ver o verso'}
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Buttons */}
      {isFlipped && (
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => handleDifficultyResponse('hard')}
            className="neo-button neo-button-error text-sm sm:text-base min-h-[44px] px-6 py-2"
          >
            Difícil
          </button>
          <button
            onClick={() => handleDifficultyResponse('medium')}
            className="neo-button neo-button-primary text-sm sm:text-base min-h-[44px] px-6 py-2"
          >
            Médio
          </button>
          <button
            onClick={() => handleDifficultyResponse('easy')}
            className="neo-button neo-button-success text-sm sm:text-base min-h-[44px] px-6 py-2"
          >
            Fácil
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center mt-8">
        <p className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
          {isFlipped 
            ? 'Avalia a dificuldade deste cartão' 
            : 'Clica no cartão para ver a resposta'
          }
        </p>
      </div>
    </div>
  );
}