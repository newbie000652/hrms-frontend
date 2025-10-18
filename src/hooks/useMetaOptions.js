import { useEffect, useState } from 'react';
import { getLevels, getDepartments } from '../services/metaService';

// Simple in-memory cache to avoid duplicate requests across components
let metaCache = {
  levels: null,
  departments: null,
  promise: null,
  error: null,
};

// Fetch levels and departments once per mount and provide loading/error state
export default function useMetaOptions() {
  const [levels, setLevels] = useState(metaCache.levels || []);
  const [departments, setDepartments] = useState(metaCache.departments || []);
  const [loading, setLoading] = useState(!(metaCache.levels && metaCache.departments));
  const [error, setError] = useState(metaCache.error);

  useEffect(() => {
    let mounted = true;

    const assignFromCache = () => {
      if (!mounted) return;
      setLevels(metaCache.levels || []);
      setDepartments(metaCache.departments || []);
      setError(metaCache.error || null);
      setLoading(false);
    };

    // If already cached, use it
    if (metaCache.levels && metaCache.departments) {
      assignFromCache();
      return () => {
        mounted = false;
      };
    }

    // If a request is in-flight, await it
    if (metaCache.promise) {
      metaCache.promise
        .then(assignFromCache)
        .catch((e) => {
          if (!mounted) return;
          setError(e);
          setLoading(false);
        });
      return () => {
        mounted = false;
      };
    }

    // Otherwise kick off a new request
    metaCache.promise = Promise.all([getLevels(), getDepartments()])
      .then(([levelsRes, departmentsRes]) => {
        metaCache.levels = levelsRes || [];
        metaCache.departments = departmentsRes || [];
        metaCache.error = null;
      })
      .catch((e) => {
        metaCache.error = e;
      })
      .finally(() => {
        metaCache.promise = null;
      });

    metaCache.promise
      .then(assignFromCache)
      .catch((e) => {
        if (!mounted) return;
        setError(e);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { levels, departments, loading, error };
}
