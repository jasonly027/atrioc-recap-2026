export interface HeaderDataProps {
  vidId: string;
  duration: number;
}

export function HeaderData({ vidId, duration }: HeaderDataProps) {
  return (
    <div className="flex justify-between gap-1">
      <span className="text-lg py-1 px-3 bg-gray-700 rounded-2xl">
        <span className="font-bold">ID</span> <span>{vidId}</span>
      </span>

      <span className="text-lg py-1 px-3 bg-gray-700 rounded-2xl">
        <span className="font-bold">Duration</span> <span>{duration}</span>
      </span>
    </div>
  );
}
