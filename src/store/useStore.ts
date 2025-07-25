import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserConfiguration, UserProgress, Exercise, FlashcardCollection, Flashcard } from '@/types';

interface AppState {
  configuration: UserConfiguration;
  progress: UserProgress;
  currentExercise: Exercise | null;
  isConfigured: boolean;
  collections: FlashcardCollection[];
  
  setConfiguration: (config: UserConfiguration) => void;
  setCurrentExercise: (exercise: Exercise | null) => void;
  addIncorrectAnswer: (word: string) => void;
  removeFromReviewQueue: (word: string) => void;
  addMasteredWord: (exercise: Exercise) => void;
  resetProgress: () => void;
  resetMasteredWords: () => void;
  
  // Collection management
  addCollection: (collection: Omit<FlashcardCollection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCollection: (id: string, updates: Partial<FlashcardCollection>) => void;
  deleteCollection: (id: string) => void;
  
  // Card management
  addCard: (collectionId: string, card: Omit<Flashcard, 'id' | 'createdAt' | 'reviewCount' | 'difficulty'>) => void;
  updateCard: (collectionId: string, cardId: string, updates: Partial<Flashcard>) => void;
  deleteCard: (collectionId: string, cardId: string) => void;
  
  // Import/Export
  exportCollection: (collectionId: string) => string;
  importCollection: (data: string) => void;
}

const defaultConfiguration: UserConfiguration = {
  selectedLevels: ['A1'],
  selectedTopics: [
    'verbo-estar',
    'presente-indicativo-regulares', 
    'verbo-ter',
    'artigos-definidos-indefinidos',
    'pronomes-pessoais'
  ], // Default A1 topics so users can start immediately
  claudeApiKey: undefined, // Optional in database-driven mode
  appLanguage: 'pt',
};

const defaultProgress: UserProgress = {
  incorrectAnswers: {},
  reviewQueue: [],
  masteredWords: {},
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      configuration: defaultConfiguration,
      progress: defaultProgress,
      currentExercise: null,
      isConfigured: true, // Default to true since we have valid default configuration
      collections: [],
      
      setConfiguration: (config) => set({ 
        configuration: config,
        // Configuration is complete if user has selected levels and topics
        // API key is optional for database-driven mode
        isConfigured: config.selectedLevels.length > 0 && config.selectedTopics.length > 0
      }),
      
      setCurrentExercise: (exercise) => set({ currentExercise: exercise }),
      
      addIncorrectAnswer: (word) => set((state) => ({
        progress: {
          ...state.progress,
          incorrectAnswers: {
            ...state.progress.incorrectAnswers,
            [word]: (state.progress.incorrectAnswers[word] || 0) + 1
          },
          reviewQueue: state.progress.reviewQueue.includes(word) 
            ? state.progress.reviewQueue 
            : [...state.progress.reviewQueue, word]
        }
      })),
      
      removeFromReviewQueue: (word) => set((state) => ({
        progress: {
          ...state.progress,
          reviewQueue: state.progress.reviewQueue.filter(w => w !== word)
        }
      })),
      
      addMasteredWord: (exercise) => set((state) => {
        const wordKey = `${exercise.correctAnswer}:${exercise.hint?.infinitive || ''}:${exercise.hint?.form || ''}`;
        return {
          progress: {
            ...state.progress,
            masteredWords: {
              ...state.progress.masteredWords,
              [wordKey]: {
                word: exercise.correctAnswer,
                infinitive: exercise.hint?.infinitive,
                form: exercise.hint?.form,
                masteredAt: new Date(),
                topic: exercise.topic,
                level: exercise.level
              }
            }
          }
        };
      }),
      
      resetProgress: () => set({ progress: defaultProgress }),
      
      resetMasteredWords: () => set((state) => ({
        progress: {
          ...state.progress,
          masteredWords: {}
        }
      })),
      
      // Collection management
      addCollection: (collection) => set((state) => ({
        collections: [...state.collections, {
          ...collection,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      })),
      
      updateCollection: (id, updates) => set((state) => ({
        collections: state.collections.map(collection => 
          collection.id === id 
            ? { ...collection, ...updates, updatedAt: new Date() }
            : collection
        )
      })),
      
      deleteCollection: (id) => set((state) => ({
        collections: state.collections.filter(collection => collection.id !== id)
      })),
      
      // Card management
      addCard: (collectionId, card) => set((state) => ({
        collections: state.collections.map(collection => 
          collection.id === collectionId
            ? {
                ...collection,
                cards: [...collection.cards, {
                  ...card,
                  id: Date.now().toString(),
                  createdAt: new Date(),
                  reviewCount: 0,
                  difficulty: 'medium' as const
                }],
                updatedAt: new Date()
              }
            : collection
        )
      })),
      
      updateCard: (collectionId, cardId, updates) => set((state) => ({
        collections: state.collections.map(collection => 
          collection.id === collectionId
            ? {
                ...collection,
                cards: collection.cards.map(card => 
                  card.id === cardId ? { ...card, ...updates } : card
                ),
                updatedAt: new Date()
              }
            : collection
        )
      })),
      
      deleteCard: (collectionId, cardId) => set((state) => ({
        collections: state.collections.map(collection => 
          collection.id === collectionId
            ? {
                ...collection,
                cards: collection.cards.filter(card => card.id !== cardId),
                updatedAt: new Date()
              }
            : collection
        )
      })),
      
      // Import/Export
      exportCollection: (collectionId) => {
        const collection = get().collections.find(c => c.id === collectionId);
        if (!collection) return '';
        
        return JSON.stringify({
          name: collection.name,
          description: collection.description,
          cards: collection.cards.map(card => ({
            front: card.front,
            back: card.back
          }))
        }, null, 2);
      },
      
      importCollection: (data) => {
        try {
          const imported = JSON.parse(data);
          const collection = {
            name: imported.name || 'Coleção Importada',
            description: imported.description || '',
            cards: imported.cards || []
          };
          
          get().addCollection(collection);
        } catch (error) {
          console.error('Error importing collection:', error);
        }
      }
    }),
    {
      name: 'portuguese-learning-store',
      partialize: (state) => ({
        configuration: state.configuration,
        progress: state.progress,
        isConfigured: state.isConfigured,
        collections: state.collections
      })
    }
  )
);