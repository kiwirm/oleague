export default function TextWithIcon({
  icon,
  text,
  children,
}: {
  icon: string | Array<string>;
  text: string;
  children?: React.ReactNode;
}) {
  if (!Array.isArray(icon)) {
    icon = [icon];
  }

  return (
    <div
      className={`inline-flex ${
        children ? "flex-row-reverse" : "flex-row"
      } items-center`}
    >
      {icon.map((icon, index) => (
        <span
          key={index}
          className="material-symbols-rounded align-text-bottom -mr-2"
        >
          {icon}
        </span>
      ))}
      <span className="ml-3 overflow-hidden text-ellipsis whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}
