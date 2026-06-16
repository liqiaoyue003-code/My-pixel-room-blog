import { projectId, publicAnonKey } from "../../utils/supabase/info";

const BASE = `https://${projectId}.supabase.co/rest/v1`;
const HEADERS = {
  apikey: publicAnonKey,
  Authorization: `Bearer ${publicAnonKey}`,
  "Content-Type": "application/json",
};

async function query<T>(table: string, params: string): Promise<T[]> {
  try {
    const res = await fetch(`${BASE}/${table}?${params}`, { headers: HEADERS });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// Chainable query builder — supports .eq().order().then() in any order
function buildChain<T>(table: string, params: string) {
  return {
    eq: (col: string, val: string | number) =>
      buildChain<T>(table, `${params}&${col}=eq.${val}`),
    order: (col: string, { ascending = true }: { ascending?: boolean } = {}) =>
      buildChain<T>(table, `${params}&order=${col}.${ascending ? "asc" : "desc"}`),
    then: (cb: (r: { data: T[] | null }) => void) =>
      query<T>(table, params).then((data) =>
        cb({ data: data.length ? data : null })
      ),
  };
}

export const supabase = {
  from: (table: string) => ({
    select: (cols = "*") => buildChain(table, `select=${cols}`),
  }),
};
