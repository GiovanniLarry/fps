import Navigation from "@/components/navigation";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-200">
          <h1 className="text-4xl font-bold text-white mb-6">Contact Us</h1>
          <p className="mb-8 text-gray-300">We'd love to hear from you. Choose the option that best fits your question.</p>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">Support</h2>
              <p className="text-gray-300 mb-3">Have a question about tracking or your account?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Email: <a href="mailto:fedexPackShipping@gmail.com" className="text-blue-300 hover:underline">fedexPackShipping@gmail.com</a></li>
                <li>Phone: <a href="tel:+12723638722" className="text-blue-300 hover:underline">+1 (272) 363-8722</a></li>
                <li>Hours: Monday–Friday, 9:00–18:00 (local time)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">Sales</h2>
              <p className="text-gray-300 mb-3">Looking for a custom plan or enterprise features?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Email: <a href="mailto:fedexPackShipping@gmail.com" className="text-blue-300 hover:underline">fedexPackShipping@gmail.com</a></li>
                <li>Phone: <a href="tel:+12723638722" className="text-blue-300 hover:underline">+1 (272) 363-8722</a></li>
                <li>Response time: within 1 business day</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">Press</h2>
              <p className="text-gray-300 mb-3">For media inquiries and brand resources.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Email: <a href="mailto:fedexPackShipping@gmail.com" className="text-blue-300 hover:underline">fedexPackShipping@gmail.com</a></li>
                <li>Phone: <a href="tel:+12723638722" className="text-blue-300 hover:underline">+1 (272) 363-8722</a></li>
              </ul>
            </div>

            

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">FAQ</h2>
              <div className="space-y-4">
                <details className="glass-morphism rounded-xl p-4">
                  <summary className="cursor-pointer font-medium text-white">Why is my tracking number not found?</summary>
                  <p className="mt-2 text-gray-300">It may take a few hours for carriers to publish tracking data. Try again later or verify the number with your carrier.</p>
                </details>
                <details className="glass-morphism rounded-xl p-4">
                  <summary className="cursor-pointer font-medium text-white">How often is tracking updated?</summary>
                  <p className="mt-2 text-gray-300">We check for updates regularly and display new events as soon as carriers provide them.</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
