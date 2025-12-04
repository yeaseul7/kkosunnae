interface ReadHeaderTextProps {
  currentName: string;
  currentDescription: string;
}
export default function ReadHeaderText({
  currentName,
  currentDescription,
}: ReadHeaderTextProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h1 className="text-2xl font-bold">{currentName}</h1>
      {currentDescription && <p className="text-text2">{currentDescription}</p>}
    </div>
  );
}
