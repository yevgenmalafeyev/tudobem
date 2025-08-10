interface MultipleChoiceOptionsProps {
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  showAnswer: boolean;
  onCheckAnswer?: () => void;
  onOptionSelect?: (option: string) => void;
}

export default function MultipleChoiceOptions({
  options,
  selectedOption,
  setSelectedOption,
  showAnswer,
  onCheckAnswer,
  onOptionSelect
}: MultipleChoiceOptionsProps) {
  if (showAnswer || options.length === 0) return null;

  return (
    <div className="mb-4 sm:mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedOption(option);
              // Use onOptionSelect if available (with immediate option value)
              // Otherwise fallback to onCheckAnswer with timeout
              if (onOptionSelect) {
                onOptionSelect(option);
              } else if (onCheckAnswer) {
                // Fallback: Use timeout to ensure state update completes
                setTimeout(() => onCheckAnswer(), 100);
              }
            }}
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