import { useState, useEffect, useCallback } from 'react';
import { Control, Bookmark, Framework } from '../types';
import {
  getAllControls,
  getControlById,
  getControlsByFramework,
  searchControls,
  getFamiliesByFramework,
  getAllBookmarks,
  isBookmarked,
  addBookmark,
  removeBookmark,
  updateBookmarkNote,
  getBookmarkCount,
} from '../database/queries';

export function useControls(framework?: Framework) {
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = framework
        ? await getControlsByFramework(framework)
        : await getAllControls();
      setControls(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [framework]);

  useEffect(() => {
    load();
  }, [load]);

  return { controls, loading, error, refresh: load };
}

export function useControlDetail(controlId: string) {
  const [control, setControl] = useState<Control | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [ctrl, bm] = await Promise.all([
          getControlById(controlId),
          isBookmarked(controlId),
        ]);
        if (mounted) {
          setControl(ctrl);
          setBookmarked(bm);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [controlId]);

  const toggleBookmark = useCallback(async (note = '') => {
    if (bookmarked) {
      await removeBookmark(controlId);
      setBookmarked(false);
    } else {
      await addBookmark(controlId, note);
      setBookmarked(true);
    }
  }, [bookmarked, controlId]);

  return { control, loading, bookmarked, toggleBookmark };
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [framework, setFramework] = useState<Framework | undefined>();
  const [family, setFamily] = useState<string | undefined>();
  const [results, setResults] = useState<Control[]>([]);
  const [loading, setLoading] = useState(false);
  const [families, setFamilies] = useState<string[]>([]);

  useEffect(() => {
    if (framework) {
      getFamiliesByFramework(framework).then(setFamilies);
    } else {
      setFamilies([]);
    }
    setFamily(undefined);
  }, [framework]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchControls(query, framework, family);
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, framework, family]);

  return {
    query, setQuery,
    framework, setFramework,
    family, setFamily,
    results, loading,
    families,
  };
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [bms, cnt] = await Promise.all([getAllBookmarks(), getBookmarkCount()]);
      setBookmarks(bms);
      setCount(cnt);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = useCallback(async (controlId: string) => {
    await removeBookmark(controlId);
    await load();
  }, [load]);

  const updateNote = useCallback(async (controlId: string, note: string) => {
    await updateBookmarkNote(controlId, note);
    await load();
  }, [load]);

  return { bookmarks, count, loading, refresh: load, remove, updateNote };
}
