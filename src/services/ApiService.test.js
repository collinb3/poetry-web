/* eslint-disable no-undef */ // Needed for global.fetch
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchPoetData, callApi } from './ApiService';
import { BASE_ENDPOINT } from '../constants';

// Mock fetch globally
global.fetch = vi.fn();

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock before each test
    global.fetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('callApi', () => {
    it('constructs endpoint with author only', async () => {
      const mockData = [{ title: 'Poem 1', author: 'Emily Dickinson' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await callApi('Emily Dickinson', null);

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_ENDPOINT}/author/Emily%20Dickinson`
      );
    });

    it('constructs endpoint with title only', async () => {
      const mockData = [{ title: 'Hope', author: 'Emily Dickinson' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await callApi(null, 'Hope');

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_ENDPOINT}/title/Hope`
      );
    });

    it('constructs endpoint with both author and title', async () => {
      const mockData = [{ title: 'Hope', author: 'Emily Dickinson' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await callApi('Emily Dickinson', 'Hope');

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_ENDPOINT}/author,title/Emily%20Dickinson;Hope`
      );
    });

    it('encodes special characters in author name', async () => {
      const mockData = [{ title: 'Poem', author: 'O\'Brien' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await callApi("O'Brien", null);

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_ENDPOINT}/author/O'Brien`
      );
    });

    it('returns data when API call is successful', async () => {
      const mockData = [{ title: 'Poem 1', author: 'Emily Dickinson' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await callApi('Emily Dickinson', null);

      expect(result.errorOccurred).toBe(false);
      expect(result.data).toEqual(mockData);
    });

    it('sets errorOccurred to true when response is not ok', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server error' }),
      });

      const result = await callApi('Emily Dickinson', null);

      expect(result.errorOccurred).toBe(true);
    });

    it('handles 404 status in response data', async () => {
      const mockData = { status: 404, reason: 'Not found' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await callApi('Unknown Author', null);

      expect(result.errorOccurred).toBe(true);
      expect(result.data.status).toBe(404);
    });

    it('handles network errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await callApi('Emily Dickinson', null);

      expect(result.errorOccurred).toBe(false); // Error is caught, no explicit error flag set
      expect(result.data).toBeNull();
    });

    it('handles fetch rejection without crashing', async () => {
      global.fetch.mockRejectedValueOnce('Unknown error');

      const result = await callApi('Emily Dickinson', null);

      expect(result.data).toBeNull();
    });

    it('calls base endpoint when no parameters provided', async () => {
      const mockData = [{ title: 'Random Poem' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await callApi(null, null);

      expect(global.fetch).toHaveBeenCalledWith(BASE_ENDPOINT);
    });
  });

  describe('fetchPoetData', () => {
    it('sets loading to true at start and false at end', async () => {
      const mockData = [{ title: 'Poem 1', author: 'Emily Dickinson' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const setPoetData = vi.fn();
      const setError = vi.fn();
      const setLoading = vi.fn();

      await fetchPoetData('Emily Dickinson', null, setPoetData, setError, setLoading);

      expect(setLoading).toHaveBeenCalledWith(true);
      expect(setLoading).toHaveBeenCalledWith(false);
      expect(setLoading).toHaveBeenCalledTimes(2);
    });

    it('sets poet data on successful fetch', async () => {
      const mockData = [{ title: 'Poem 1', author: 'Emily Dickinson' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const setPoetData = vi.fn();
      const setError = vi.fn();
      const setLoading = vi.fn();

      await fetchPoetData('Emily Dickinson', null, setPoetData, setError, setLoading);

      expect(setPoetData).toHaveBeenCalledWith(mockData);
      expect(setError).toHaveBeenCalledWith(null);
    });

    it('sets error message when 404 status is returned', async () => {
      const mockData = { status: 404, reason: 'Not found' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const setPoetData = vi.fn();
      const setError = vi.fn();
      const setLoading = vi.fn();

      await fetchPoetData('Unknown Author', null, setPoetData, setError, setLoading);

      expect(setError).toHaveBeenCalledWith(
        'No record found. Please check your spelling or try another author/title.'
      );
      expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('sets error message when errorOccurred is true', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server error' }),
      });

      const setPoetData = vi.fn();
      const setError = vi.fn();
      const setLoading = vi.fn();

      await fetchPoetData('Emily Dickinson', null, setPoetData, setError, setLoading);

      expect(setError).toHaveBeenCalledWith(
        'An error occurred while fetching data. Please try again later.'
      );
    });

    it('handles network errors and sets error message', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network failure'));

      const setPoetData = vi.fn();
      const setError = vi.fn();
      const setLoading = vi.fn();

      await fetchPoetData('Emily Dickinson', null, setPoetData, setError, setLoading);

      expect(setError).toHaveBeenCalledWith(
        'An error occurred while fetching data. Please try again later.'
      );
      expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('does not set generic error for 404 errors', async () => {
      const mockData = { status: 404, reason: 'Not found' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const setPoetData = vi.fn();
      const setError = vi.fn();
      const setLoading = vi.fn();

      await fetchPoetData('Unknown Author', null, setPoetData, setError, setLoading);

      // Should set 404-specific error, not generic error
      expect(setError).toHaveBeenCalledWith(
        'No record found. Please check your spelling or try another author/title.'
      );
      // Generic error should not be called again in catch block
      expect(setError).toHaveBeenCalledTimes(1);
    });

    it('passes author and title to callApi', async () => {
      const mockData = [{ title: 'Hope', author: 'Emily Dickinson' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const setPoetData = vi.fn();
      const setError = vi.fn();
      const setLoading = vi.fn();

      await fetchPoetData('Emily Dickinson', 'Hope', setPoetData, setError, setLoading);

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_ENDPOINT}/author,title/Emily%20Dickinson;Hope`
      );
    });
  });
});