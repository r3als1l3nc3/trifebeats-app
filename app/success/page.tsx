export default function SuccessPage({
  searchParams,
}: {
  searchParams: { beat?: string; audio?: string };
}) {
  const beat = searchParams.beat || "Your Beat";
  const audio = searchParams.audio || "#";

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl font-black text-yellow-500 mb-6">
          Payment Successful
        </h1>

        <p className="text-gray-300 text-lg mb-4">
          Thank you for purchasing:
        </p>

        <h2 className="text-3xl font-black mb-8">{beat}</h2>

        <a
          href={audio}
          download
          className="inline-block bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition"
        >
          Download MP3
        </a>

        <div className="mt-8">
          <a href="/" className="text-yellow-500 hover:underline">
            Return Home
          </a>
        </div>
      </div>
    </main>
  );
}