import type { IWeather } from "../../module/types/home.type";

interface ICardProps {
  weather: IWeather;
  onDelete: (cityId: number) => void;
}

function formatTime(iso: string | null): string {
  if (!iso) return "нет данных";
  
  const d = new Date(iso);
  
  return d.toLocaleString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

export const Card = ({ weather, onDelete }: ICardProps) => {
  const { cityId, name, country, temperature, has_data, message, fetched_at, is_stale, is_service_down } = weather;
  return (
    <div className={`bg-gray-100 relative rounded-2xl p-5 border-2 ${is_service_down ? "border-red-500" : is_stale ? "border-stone-500" : "border-transparent" }`}>

      <h3 className="text-lg font-bold mb-2">{name} {country && country}</h3>
      <button
        className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-full text-white cursor-pointer"
        onClick={() => onDelete(cityId)}
      >x</button>
      
      {has_data ? (
        <div className="text-2xl font-extrabold">{Math.round(temperature as number)} C</div>
      ) : (
        <div className="text-gray-500">Нет данных</div>
      )}

      <div>Последнее обновление: {formatTime(fetched_at)}</div>

      {message && <div
        className={`mt-2.5 p-2 rounded-lg text-xs ${!is_service_down ? "bg-red-700/30 text-red-700" : "bg-amber-700/30 text-amber-700"}`}
      >{message}</div>}
    </div>
  )
}
