import Navigation from "@/components/navigation";

export default function RecentSearchesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Recent Searches</h2>
          <p className="text-gray-300">Your recent tracking number searches will appear here.</p>
        </div>
      </section>
    </div>
  );
}
