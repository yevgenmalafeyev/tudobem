interface MultipleChoiceOptionsProps {
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  showAnswer: boolean;
}

export default function MultipleChoiceOptions({
  options,
  selectedOption,
  setSelectedOption,
  showAnswer
}: MultipleChoiceOptionsProps) {
  if (showAnswer || options.length === 0) return null;

  return (
    <div className="mb-4 sm:mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`neo-button text-sm sm:text-base p-3 sm:p-4 text-left ${
              selectedOption === option ? 'neo-button-primary' : ''
            }`}
            style={{ 
              minHeight: '44px',
              color: selectedOption === option ? 'var(--neo-text-inverted)' : 'var(--neo-text)'
            }}
            data-testid="multiple-choice-option"
          >
            {String.fromCharCode(65 + index)}. {option}
          </button>
        ))}
      </div>
    </div>
  );
}