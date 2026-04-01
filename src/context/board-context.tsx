import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { AIError as AIErrorType, ConceptBoard, SavedBoard } from '@/types/board';
import { AIError } from '@/types/board';
import { getImageAlt, getImageUrl, getThumbnailUrl } from '@/lib/images';
import { parsePrompt } from '@/lib/ai';
import { getSavedBoards, saveBoard as storageSaveBoard } from '@/lib/storage';

/* ─── Types ─────────────────────────────────────────────────────────────── */

type BoardStatus = 'idle' | 'loading' | 'success' | 'error';

interface BoardState {
  status: BoardStatus;
  currentBoard: ConceptBoard | null;
  savedBoards: SavedBoard[];
  error: AIError | null;
}

interface BoardActions {
  generateBoard: (prompt: string) => Promise<void>;
  saveCurrentBoard: () => Promise<void>;
  loadSavedBoards: () => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
}

type BoardContextValue = BoardState & BoardActions;

/* ─── Context ─────────────────────────────────────────────────────────────── */

const BoardContext = createContext<BoardContextValue | null>(null);

export function useBoardContext(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoardContext must be used within BoardProvider');
  return ctx;
}

/* ─── Provider ─────────────────────────────────────────────────────────────── */

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BoardState>({
    status: 'idle',
    currentBoard: null,
    savedBoards: [],
    error: null,
  });

  // Store abort controller to cancel in-flight requests
  const abortRef = useRef<AbortController | null>(null);

  // Load saved boards once on mount
  useEffect(() => {
    loadSavedBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSavedBoards = useCallback(async () => {
    const boards = await getSavedBoards();
    setState((prev) => ({ ...prev, savedBoards: boards }));
  }, []);

  const generateBoard = useCallback(async (prompt: string) => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, status: 'loading', error: null, currentBoard: null }));

    try {
      const aiResult = await parsePrompt(prompt);

      if (controller.signal.aborted) return;

      const now = new Date().toISOString();
      const board: ConceptBoard = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        prompt,
        heading: aiResult.heading,
        colorPalette: aiResult.colorPalette,
        images: aiResult.imageQueries.map((q, i) => ({
          query: q,
          url: i === 0 ? getImageUrl(q, 800) : getThumbnailUrl(q),
          alt: getImageAlt(q),
        })),
        createdAt: now,
      };

      setState((prev) => ({ ...prev, status: 'success', currentBoard: board }));
    } catch (err) {
      if (controller.signal.aborted) return;
      const aiErr = err instanceof Error ? (err as AIErrorType) : new AIError(String(err), 'NETWORK_ERROR');
      setState((prev) => ({ ...prev, status: 'error', error: aiErr }));
    }
  }, []);

  const saveCurrentBoard = useCallback(async () => {
    const { currentBoard } = state;
    if (!currentBoard) return;
    const saved: SavedBoard = { ...currentBoard, savedAt: new Date().toISOString() };
    await storageSaveBoard(saved);
    await loadSavedBoards();
  }, [state.currentBoard, loadSavedBoards]);

  const deleteBoard = useCallback(
    async (id: string) => {
      const { deleteBoard: del } = await import('@/lib/storage');
      await del(id);
      await loadSavedBoards();
    },
    [loadSavedBoards],
  );

  return (
    <BoardContext.Provider
      value={{ ...state, generateBoard, saveCurrentBoard, loadSavedBoards, deleteBoard }}
    >
      {children}
    </BoardContext.Provider>
  );
}
