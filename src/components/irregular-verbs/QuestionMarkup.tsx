'use client';

import React from 'react';

interface QuestionMarkupProps {
  question: string;
  className?: string;
}

export default function QuestionMarkup({ question, className = '' }: QuestionMarkupProps) {
  // Parse the question to identify and mark up different components
  const parseQuestion = (question: string) => {
    // Pattern: "Conjugue o verbo "VERB" no TENSE, PERSON"
    const verbPattern = /"([^"]+)"/;
    const verbMatch = question.match(verbPattern);
    
    if (!verbMatch) {
      // Fallback if pattern doesn't match
      return <span>{question}</span>;
    }
    
    const verb = verbMatch[1];
    const beforeVerb = question.substring(0, verbMatch.index!);
    const afterVerb = question.substring(verbMatch.index! + verbMatch[0].length);
    
    // Split the part after the verb to identify tense and person
    // Pattern: " no TENSE, PERSON"
    const afterVerbParts = afterVerb.split(', ');
    if (afterVerbParts.length >= 2) {
      const tenseWithNo = afterVerbParts[0]; // " no Presente Indicativo"
      const person = afterVerbParts[1]; // "3ª pessoa singular"
      
      // Extract just the tense name (remove " no ")
      const tense = tenseWithNo.replace(/^\s*no\s+/, '');
      
      return (
        <>
          {beforeVerb}
          <span 
            className="font-bold px-2 py-1 rounded-md mx-1" 
            style={{ 
              backgroundColor: 'var(--neo-primary)', 
              color: 'var(--neo-primary-text)' 
            }}
            title="Verbo"
          >
&quot;{verb}&quot;
          </span>
          {' no '}
          <span 
            className="font-semibold px-2 py-1 rounded-md mx-1" 
            style={{ 
              backgroundColor: 'var(--neo-accent)', 
              color: 'var(--neo-accent-text)' 
            }}
            title="Tempo Verbal"
          >
            {tense}
          </span>
          {', '}
          <span 
            className="font-medium px-2 py-1 rounded-md mx-1" 
            style={{ 
              backgroundColor: 'var(--neo-secondary)', 
              color: 'var(--neo-secondary-text)' 
            }}
            title="Pessoa"
          >
            {person}
          </span>
        </>
      );
    } else {
      // Fallback if we can't parse tense and person
      return (
        <>
          {beforeVerb}
          <span 
            className="font-bold px-2 py-1 rounded-md mx-1" 
            style={{ 
              backgroundColor: 'var(--neo-primary)', 
              color: 'var(--neo-primary-text)' 
            }}
            title="Verbo"
          >
&quot;{verb}&quot;
          </span>
          {afterVerb}
        </>
      );
    }
  };

  return (
    <div className={`text-xl font-semibold leading-relaxed ${className}`} style={{ color: 'var(--neo-text)' }}>
      {parseQuestion(question)}
    </div>
  );
}