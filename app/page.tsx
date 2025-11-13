import Header from "@/packages/ui/components/layout/Header";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-whitesm:items-start">
        <Header />
      </main>
    </div>
  );
}
