'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { FlashcardCollection, Flashcard } from '@/types';

interface CollectionDetailProps {
  collection: FlashcardCollection;
  onBack: () => void;
  onStudy: () => void;
}

export default function CollectionDetail({ collection, onBack, onStudy }: CollectionDetailProps) {
  const { updateCollection, addCard, updateCard, deleteCard, exportCollection } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(collection.name);
  const [editedDescription, setEditedDescription] = useState(collection.description || '');
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  const handleUpdateCollection = () => {
    updateCollection(collection.id, {
      name: editedName.trim(),
      description: editedDescription.trim()
    });
    setIsEditing(false);
  };

  const handleAddCard = () => {
    if (newCardFront.trim() && newCardBack.trim()) {
      addCard(collection.id, {
        front: newCardFront.trim(),
        back: newCardBack.trim()
      });
      setNewCardFront('');
      setNewCardBack('');
      setShowAddCard(false);
    }
  };

  const handleUpdateCard = (card: Flashcard) => {
    updateCard(collection.id, card.id, card);
    setEditingCard(null);
  };

  const handleExport = () => {
    const data = exportCollection(collection.id);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${collection.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="neo-button text-sm sm:text-base min-h-[44px] px-4 py-2"
        >
          ← Voltar
        </button>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="neo-button text-sm sm:text-base min-h-[44px] px-4 py-2"
          >
            Exportar
          </button>
          <button
            onClick={onStudy}
            disabled={collection.cards.length === 0}
            className="neo-button neo-button-primary text-sm sm:text-base min-h-[44px] px-4 py-2"
          >
            Estudar
          </button>
        </div>
      </div>

      {/* Collection Info */}
      <div className="neo-card mb-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                Nome da Coleção
              </label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="neo-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                Descrição
              </label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="neo-input w-full min-h-[80px] resize-none"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedName(collection.name);
                  setEditedDescription(collection.description || '');
                }}
                className="neo-button text-sm sm:text-base min-h-[44px] px-4 py-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateCollection}
                disabled={!editedName.trim()}
                className="neo-button neo-button-success text-sm sm:text-base min-h-[44px] px-4 py-2"
              >
                Guardar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start mb-3">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--neo-text)' }}>
                {collection.name}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="neo-button text-sm min-h-[36px] px-3 py-1"
              >
                Editar
              </button>
            </div>
            {collection.description && (
              <p className="text-sm mb-3" style={{ color: 'var(--neo-text-muted)' }}>
                {collection.description}
              </p>
            )}
            <p className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              {collection.cards.length} cartões • Atualizado em {new Date(collection.updatedAt).toLocaleDateString('pt-PT')}
            </p>
          </div>
        )}
      </div>

      {/* Add Card Form */}
      {showAddCard && (
        <div className="neo-card mb-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
            Novo Cartão
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                Frente
              </label>
              <textarea
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                className="neo-input w-full min-h-[100px] resize-none"
                placeholder="Ex: Olá"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                Verso
              </label>
              <textarea
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                className="neo-input w-full min-h-[100px] resize-none"
                placeholder="Ex: Hello"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddCard(false)}
              className="neo-button text-sm sm:text-base min-h-[44px] px-4 py-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddCard}
              disabled={!newCardFront.trim() || !newCardBack.trim()}
              className="neo-button neo-button-success text-sm sm:text-base min-h-[44px] px-4 py-2"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Cards Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--neo-text)' }}>
          Cartões ({collection.cards.length})
        </h2>
        <button
          onClick={() => setShowAddCard(true)}
          className="neo-button neo-button-success text-sm sm:text-base min-h-[44px] px-4 py-2"
        >
          Adicionar Cartão
        </button>
      </div>

      {/* Cards List */}
      {collection.cards.length === 0 ? (
        <div className="neo-card text-center py-12">
          <p className="text-lg mb-4" style={{ color: 'var(--neo-text-muted)' }}>
            Esta coleção ainda não tem cartões
          </p>
          <button
            onClick={() => setShowAddCard(true)}
            className="neo-button neo-button-primary text-sm sm:text-base min-h-[44px] px-6 py-2"
          >
            Adicionar Primeiro Cartão
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {collection.cards.map((card) => (
            <div key={card.id} className="neo-card">
              {editingCard?.id === card.id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                      Frente
                    </label>
                    <textarea
                      value={editingCard.front}
                      onChange={(e) => setEditingCard({ ...editingCard, front: e.target.value })}
                      className="neo-input w-full min-h-[100px] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                      Verso
                    </label>
                    <textarea
                      value={editingCard.back}
                      onChange={(e) => setEditingCard({ ...editingCard, back: e.target.value })}
                      className="neo-input w-full min-h-[100px] resize-none"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingCard(null)}
                      className="neo-button text-sm sm:text-base min-h-[44px] px-4 py-2"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleUpdateCard(editingCard)}
                      disabled={!editingCard.front.trim() || !editingCard.back.trim()}
                      className="neo-button neo-button-success text-sm sm:text-base min-h-[44px] px-4 py-2"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--neo-text-muted)' }}>
                      Frente
                    </h4>
                    <p className="text-base" style={{ color: 'var(--neo-text)' }}>
                      {card.front}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--neo-text-muted)' }}>
                      Verso
                    </h4>
                    <p className="text-base" style={{ color: 'var(--neo-text)' }}>
                      {card.back}
                    </p>
                  </div>
                  <div className="md:col-span-2 flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingCard(card)}
                      className="neo-button text-sm min-h-[36px] px-3 py-1"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteCard(collection.id, card.id)}
                      className="neo-button neo-button-error text-sm min-h-[36px] px-3 py-1"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}