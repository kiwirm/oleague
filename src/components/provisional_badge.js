export default function ProvisionalBadge({ provisional }) {
  return (
    <span className="inline px-2 py-1 bg-blue-500 rounded-lg text-white text-sm sm:text-lg tracking-wide uppercase font-bold">
      {provisional ? "provisional" : "final"}
    </span>
  );
}
