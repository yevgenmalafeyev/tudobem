import { describe, it, expect } from '@jest/globals';
import { levenshteinDistance, filterValidDistractors, isValidAnswer, normalizeAnswer } from '@/utils/validation'

describe('validation utils', () => {
  describe('levenshteinDistance', () => {
    it('should calculate correct distance for identical strings', () => {
      expect(levenshteinDistance('hello', 'hello')).toBe(0)
    })

    it('should calculate correct distance for completely different strings', () => {
      expect(levenshteinDistance('hello', 'world')).toBe(4)
    })

    it('should calculate correct distance for single character difference', () => {
      expect(levenshteinDistance('hello', 'hallo')).toBe(1)
    })

    it('should calculate correct distance for empty strings', () => {
      expect(levenshteinDistance('', '')).toBe(0)
      expect(levenshteinDistance('hello', '')).toBe(5)
      expect(levenshteinDistance('', 'hello')).toBe(5)
    })

    it('should calculate correct distance for Portuguese words', () => {
      expect(levenshteinDistance('falo', 'fala')).toBe(1)
      expect(levenshteinDistance('sou', 'são')).toBe(2)
    })
  })

  describe('filterValidDistractors', () => {
    it('should filter out exact matches (case-insensitive)', () => {
      const result = filterValidDistractors('falo', ['falo', 'FALO', 'falou', 'falamos'])
      expect(result).not.toContain('falo')
      expect(result).not.toContain('FALO')
      expect(result).toContain('falou')
      expect(result).toContain('falamos')
    })

    it('should filter out empty strings', () => {
      const result = filterValidDistractors('falo', ['', 'falou', 'falamos'])
      expect(result).not.toContain('')
      expect(result).toContain('falou')
      expect(result).toContain('falamos')
    })

    it('should filter out non-string values', () => {
      const result = filterValidDistractors('falo', [null, undefined, 123, 'falou'] as unknown)
      expect(result).toEqual(['falou'])
    })

    it('should filter out very similar strings based on threshold', () => {
      const result = filterValidDistractors('falo', ['falo', 'fala', 'falou', 'falamos'])
      expect(result).not.toContain('falo')
      expect(result).not.toContain('fala') // Too similar (distance 1)
      expect(result).toContain('falou')
      expect(result).toContain('falamos')
    })

    it('should limit results to 3 distractors', () => {
      const result = filterValidDistractors('falo', ['falou', 'falamos', 'falaram', 'falava', 'falaste'])
      expect(result).toHaveLength(3)
    })

    it('should handle empty input array', () => {
      const result = filterValidDistractors('falo', [])
      expect(result).toEqual([])
    })
  })

  describe('isValidAnswer', () => {
    it('should return true for valid answers', () => {
      expect(isValidAnswer('falo')).toBe(true)
      expect(isValidAnswer('  falo  ')).toBe(true)
      expect(isValidAnswer('sou')).toBe(true)
    })

    it('should return false for invalid answers', () => {
      expect(isValidAnswer('')).toBe(false)
      expect(isValidAnswer('   ')).toBe(false)
      expect(isValidAnswer(null as unknown)).toBe(false)
      expect(isValidAnswer(undefined as unknown)).toBe(false)
    })

    it('should handle Portuguese characters', () => {
      expect(isValidAnswer('está')).toBe(true)
      expect(isValidAnswer('São')).toBe(true)
      expect(isValidAnswer('coração')).toBe(true)
    })
  })

  describe('normalizeAnswer', () => {
    it('should normalize answers to lowercase and trimmed', () => {
      expect(normalizeAnswer('FALO')).toBe('falo')
      expect(normalizeAnswer('  Falo  ')).toBe('falo')
      expect(normalizeAnswer('Sou')).toBe('sou')
    })

    it('should handle Portuguese characters', () => {
      expect(normalizeAnswer('ESTÁ')).toBe('está')
      expect(normalizeAnswer('  São  ')).toBe('são')
      expect(normalizeAnswer('CORAÇÃO')).toBe('coração')
    })

    it('should handle empty strings', () => {
      expect(normalizeAnswer('')).toBe('')
      expect(normalizeAnswer('   ')).toBe('')
    })
  })
})