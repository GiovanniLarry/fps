import Navigation from "@/components/navigation";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-200">
          <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="mb-8 text-gray-300">Effective date: August 20, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Information We Collect</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Account information (email, username)</li>
                <li>Tracking numbers and related package metadata</li>
                <li>Usage data (logs, device and browser information)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. How We Use Information</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>To provide tracking and notifications</li>
                <li>To improve reliability and performance</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. Sharing</h2>
              <p className="text-gray-300">We do not sell your personal data. We share information with service providers only as needed to deliver the service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. Data Retention</h2>
              <p className="text-gray-300">We retain data as long as your account is active or as required by law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Your Rights</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Access, correct, or delete your data</li>
                <li>Export your data</li>
                <li>Object to or restrict processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Contact</h2>
              <p className="text-gray-300">Questions? Email <a href="mailto:privacy@fedpack.example" className="text-blue-300 hover:underline">privacy@fedpack.example</a>.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
