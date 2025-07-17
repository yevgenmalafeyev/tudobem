'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { FlashcardCollection } from '@/types';
import CollectionList from './flashcards/CollectionList';
import CollectionDetail from './flashcards/CollectionDetail';
import StudySession from './flashcards/StudySession';

export default function Flashcards() {
  const { collections } = useStore();
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'study'>('list');
  const [selectedCollection, setSelectedCollection] = useState<FlashcardCollection | null>(null);

  const handleViewCollection = (collection: FlashcardCollection) => {
    setSelectedCollection(collection);
    setCurrentView('detail');
  };

  const handleStudyCollection = (collection: FlashcardCollection) => {
    setSelectedCollection(collection);
    setCurrentView('study');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedCollection(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {currentView === 'list' && (
        <CollectionList 
          collections={collections}
          onViewCollection={handleViewCollection}
          onStudyCollection={handleStudyCollection}
        />
      )}
      
      {currentView === 'detail' && selectedCollection && (
        <CollectionDetail 
          collection={selectedCollection}
          onBack={handleBackToList}
          onStudy={() => handleStudyCollection(selectedCollection)}
        />
      )}
      
      {currentView === 'study' && selectedCollection && (
        <StudySession 
          collection={selectedCollection}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}