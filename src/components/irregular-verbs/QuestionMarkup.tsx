'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';

interface QuestionMarkupProps {
  question: string;
  className?: string;
}

export default function QuestionMarkup({ question, className = '' }: QuestionMarkupProps) {
  const { configuration } = useStore();
  
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
            title={t('verb', configuration.appLanguage)}
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
            title={t('tense', configuration.appLanguage)}
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
            title={t('person', configuration.appLanguage)}
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
            title={t('verb', configuration.appLanguage)}
          >
&quot;{verb}&quot;
          </span>
          {afterVerb}
        </>
      );
    }
  };

  return (
    <h2 className={`text-xl font-semibold leading-relaxed ${className}`} style={{ color: 'var(--neo-text)' }}>
      {parseQuestion(question)}
    </h2>
  );
}