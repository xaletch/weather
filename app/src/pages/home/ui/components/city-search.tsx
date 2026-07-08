import { useEffect, useRef, useState } from "react";
import type { IAddFavoritesCredentials, ICitySearch } from "../../module/types/home.type"
import { weatherService } from "../../services/weather.service";

interface CitySearchProps {
  handleAdd: (city: IAddFavoritesCredentials) => void;
}

type ResultState = {
  result: ICitySearch[];
  isLoading: boolean;
}

export const CitySearch = ({ handleAdd }: CitySearchProps) => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<ResultState>({ result: [], isLoading: false });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setData(p => ({ ...p, result: [] }));
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setData(p => ({ ...p, isLoading: true }));
      try {
        const data = await weatherService.citySearch(query);
        setData(p => ({ ...p, result: data }));
      } catch {
        setData(p => ({ ...p, result: [] }));
      } finally {
        setData(p => ({ ...p, isLoading: false }));
      }
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="mx-auto w-full max-w-lg mb-8 relative">
      <input
        type="text"
        placeholder="Найти город..."
        value={query}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-stone-500"
        onChange={(e) => setQuery(e.target.value)}
      />
      {data.isLoading && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">Ищем...</div>}

      {data.result.length > 0 && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {data.result.map((c, idx) => (
            <div className="flex items-center justify-between px-4 py-3 transition hover:bg-gray-50" key={idx}>
              <div className="text-sm">
                <span className="font-medium text-gray-800">
                  {c.name}
                </span>

                {c.country && (
                  <span className="ml-1 text-gray-400">
                    {c.country}
                  </span>
                )}
              </div>
              <button
                className="rounded-lg bg-stone-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-600  active:scale-95"
                onClick={() => {
                  handleAdd(c);
                  setQuery("")
                  setData(p => ({ ...p, result: [] }));
                }}
              >Добавить</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
