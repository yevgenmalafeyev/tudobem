import { describe, it, expect } from '@jest/globals';
import { shuffleArray, getRandomElement, removeDuplicates, chunk } from '@/utils/arrays'

describe('arrays utils', () => {
  describe('shuffleArray', () => {
    it('should return array with same elements', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray([...original])
      
      expect(shuffled).toHaveLength(original.length)
      expect(shuffled.sort()).toEqual(original.sort())
    })

    it('should handle empty array', () => {
      expect(shuffleArray([])).toEqual([])
    })

    it('should handle single element array', () => {
      expect(shuffleArray([1])).toEqual([1])
    })

    it('should handle string array', () => {
      const original = ['a', 'b', 'c']
      const shuffled = shuffleArray([...original])
      
      expect(shuffled).toHaveLength(original.length)
      expect(shuffled.sort()).toEqual(original.sort())
    })

    it('should not modify original array', () => {
      const original = [1, 2, 3, 4, 5]
      const copy = [...original]
      shuffleArray(copy)
      
      expect(original).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('getRandomElement', () => {
    it('should return element from array', () => {
      const array = [1, 2, 3, 4, 5]
      const element = getRandomElement(array)
      
      expect(array).toContain(element)
    })

    it('should return undefined for empty array', () => {
      expect(getRandomElement([])).toBeUndefined()
    })

    it('should return the single element for single element array', () => {
      expect(getRandomElement([42])).toBe(42)
    })

    it('should work with different types', () => {
      const stringArray = ['hello', 'world']
      const element = getRandomElement(stringArray)
      
      expect(stringArray).toContain(element)
    })

    it('should return different elements over multiple calls', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const results = new Set()
      
      // Run multiple times to check randomness
      for (let i = 0; i < 100; i++) {
        results.add(getRandomElement(array))
      }
      
      // Should get more than one unique result
      expect(results.size).toBeGreaterThan(1)
    })
  })

  describe('removeDuplicates', () => {
    it('should remove duplicate numbers', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3, 4])).toEqual([1, 2, 3, 4])
    })

    it('should remove duplicate strings', () => {
      expect(removeDuplicates(['a', 'b', 'b', 'c', 'a'])).toEqual(['a', 'b', 'c'])
    })

    it('should handle empty array', () => {
      expect(removeDuplicates([])).toEqual([])
    })

    it('should handle array with no duplicates', () => {
      expect(removeDuplicates([1, 2, 3, 4])).toEqual([1, 2, 3, 4])
    })

    it('should preserve order of first occurrence', () => {
      expect(removeDuplicates([3, 1, 2, 1, 3])).toEqual([3, 1, 2])
    })

    it('should handle Portuguese words', () => {
      expect(removeDuplicates(['falo', 'fala', 'falo', 'falamos'])).toEqual(['falo', 'fala', 'falamos'])
    })
  })

  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      const result = chunk([1, 2, 3, 4, 5, 6], 2)
      expect(result).toEqual([[1, 2], [3, 4], [5, 6]])
    })

    it('should handle last chunk with fewer elements', () => {
      const result = chunk([1, 2, 3, 4, 5], 2)
      expect(result).toEqual([[1, 2], [3, 4], [5]])
    })

    it('should handle empty array', () => {
      expect(chunk([], 2)).toEqual([])
    })

    it('should handle chunk size larger than array', () => {
      const result = chunk([1, 2, 3], 5)
      expect(result).toEqual([[1, 2, 3]])
    })

    it('should handle chunk size of 1', () => {
      const result = chunk([1, 2, 3], 1)
      expect(result).toEqual([[1], [2], [3]])
    })

    it('should handle string arrays', () => {
      const result = chunk(['a', 'b', 'c', 'd'], 2)
      expect(result).toEqual([['a', 'b'], ['c', 'd']])
    })

    it('should throw error for invalid chunk size', () => {
      expect(() => chunk([1, 2, 3], 0)).toThrow()
      expect(() => chunk([1, 2, 3], -1)).toThrow()
    })
  })
})