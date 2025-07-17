'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { FlashcardCollection } from '@/types';

interface CollectionListProps {
  collections: FlashcardCollection[];
  onViewCollection: (collection: FlashcardCollection) => void;
  onStudyCollection: (collection: FlashcardCollection) => void;
}

export default function CollectionList({ collections, onViewCollection, onStudyCollection }: CollectionListProps) {
  const { addCollection, deleteCollection, importCollection } = useStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      addCollection({
        name: newCollectionName.trim(),
        description: newCollectionDescription.trim(),
        cards: []
      });
      setNewCollectionName('');
      setNewCollectionDescription('');
      setShowCreateForm(false);
    }
  };

  const handleImportCollection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importCollection(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--neo-text)' }}>
          Coleções de Cartões
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="neo-button neo-button-success text-sm sm:text-base min-h-[44px] px-4 py-2"
          >
            Nova Coleção
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="neo-button text-sm sm:text-base min-h-[44px] px-4 py-2"
          >
            Importar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportCollection}
            className="hidden"
          />
        </div>
      </div>

      {/* Create Collection Form */}
      {showCreateForm && (
        <div className="neo-card mb-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
            Nova Coleção
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                Nome da Coleção
              </label>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="neo-input w-full"
                placeholder="Ex: Vocabulário Básico"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                Descrição (opcional)
              </label>
              <textarea
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
                className="neo-input w-full min-h-[80px] resize-none"
                placeholder="Descrição da coleção..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="neo-button text-sm sm:text-base min-h-[44px] px-4 py-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
                className="neo-button neo-button-success text-sm sm:text-base min-h-[44px] px-4 py-2"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="neo-card text-center py-12">
          <p className="text-lg mb-4" style={{ color: 'var(--neo-text-muted)' }}>
            Ainda não tens coleções de cartões
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="neo-button neo-button-primary text-sm sm:text-base min-h-[44px] px-6 py-2"
          >
            Criar a Primeira Coleção
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {collections.map((collection) => (
            <div key={collection.id} className="neo-card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--neo-text)' }}>
                  {collection.name}
                </h3>
                <button
                  onClick={() => deleteCollection(collection.id)}
                  className="neo-button neo-button-error text-xs min-h-[32px] px-2 py-1"
                >
                  ×
                </button>
              </div>
              
              {collection.description && (
                <p className="text-sm mb-3" style={{ color: 'var(--neo-text-muted)' }}>
                  {collection.description}
                </p>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                  {collection.cards.length} cartões
                </span>
                <span className="text-xs" style={{ color: 'var(--neo-text-muted)' }}>
                  {new Date(collection.updatedAt).toLocaleDateString('pt-PT')}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewCollection(collection)}
                  className="neo-button flex-1 text-sm min-h-[40px] py-2"
                >
                  Gerir
                </button>
                <button
                  onClick={() => onStudyCollection(collection)}
                  disabled={collection.cards.length === 0}
                  className="neo-button neo-button-primary flex-1 text-sm min-h-[40px] py-2"
                >
                  Estudar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}