import Navigation from "@/components/navigation";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-200">
          <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="mb-8 text-gray-300">Effective date: August 20, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-300">By using FedPack, you agree to these terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. Use of Service</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>You must comply with applicable laws.</li>
                <li>Do not misuse the service or attempt to disrupt it.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. Accounts</h2>
              <p className="text-gray-300">You are responsible for activities under your account and for safeguarding your credentials.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. Limitation of Liability</h2>
              <p className="text-gray-300">FedPack is provided "as is" without warranty. We are not liable for indirect or consequential damages.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Changes</h2>
              <p className="text-gray-300">We may update these terms and will notify you of material changes.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Contact</h2>
              <p className="text-gray-300">Questions? Email <a href="mailto:legal@fedpack.example" className="text-blue-300 hover:underline">legal@fedpack.example</a>.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
