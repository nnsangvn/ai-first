import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedBoard } from '@/types/board';

const STORAGE_KEY = '@promptviz:saved_boards';

export async function getSavedBoards(): Promise<SavedBoard[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedBoard[]) : [];
  } catch (err) {
    console.warn('[Storage] Failed to read saved boards', err);
    return [];
  }
}

export async function saveBoard(board: SavedBoard): Promise<void> {
  try {
    const existing = await getSavedBoards();
    // Avoid duplicate prompts on same day
    const filtered = existing.filter(
      (b) => !(b.prompt === board.prompt && b.savedAt.slice(0, 10) === board.savedAt.slice(0, 10)),
    );
    const updated = [board, ...filtered].slice(0, 50); // cap at 50 boards
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[Storage] Failed to save board', err);
    throw err;
  }
}

export async function deleteBoard(boardId: string): Promise<void> {
  try {
    const existing = await getSavedBoards();
    const updated = existing.filter((b) => b.id !== boardId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[Storage] Failed to delete board', err);
    throw err;
  }
}

export async function clearAllBoards(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[Storage] Failed to clear boards', err);
    throw err;
  }
}
