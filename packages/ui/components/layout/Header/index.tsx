import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/">
          <h1 className="text-2xl font-bold">Logo</h1>
        </Link>
      </div>
    </header>
  );
}
