'use client';

import { useLanguageDetection } from '@/hooks/useLanguageDetection';

interface LanguageDetectionWrapperProps {
  children: React.ReactNode;
}

export default function LanguageDetectionWrapper({ children }: LanguageDetectionWrapperProps) {
  useLanguageDetection();
  return <>{children}</>;
}