export default function OrienteersPage() {
  return (
    <div className="bg-gray-200 rounded-lg p-4 w-full flex flex-row items-center gap-2">
      <span className="material-symbols-rounded">search</span>
      <input
        type="text"
        placeholder="Search for orienteers..."
        className="bg-gray-200"
      />
    </div>
  );
}
