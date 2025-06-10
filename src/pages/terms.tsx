import SEO from '@/components/SEO'

const Terms = () => {
    return (
      <>
        <SEO
          title="Terms of Service - DevTone"
          description="DevTone's terms of service outline the conditions for using our web development services. Learn about our policies, client responsibilities, and service agreements."
          keywords={['DevTone terms of service', 'service agreement', 'web development terms', 'client responsibilities', 'service conditions']}
          ogUrl="https://www.devtone.agency/terms"
        />
      <div className="min-h-screen pt-24 bg-[#030718]">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>
  
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm">
                Legal
              </div>
              <h1 className="text-4xl font-bold mb-4 text-white">Terms of Service</h1>
              <p className="text-white/70 max-w-2xl mx-auto">Last updated: April 11, 2024</p>
            </div>
  
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-12">
              <div className="prose prose-invert max-w-none text-white/80">
                <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
                <p>
                  Welcome to Devtone ("Company", "we", "our", "us"). These Terms of Service ("Terms", "Terms of
                  Service") govern your use of our website and services operated by Devtone.
                </p>
                <p>
                  By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part
                  of the terms, you may not access our services.
                </p>
  
                <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">2. Services</h2>
                <p>
                  Devtone provides web design, development, and related digital services. The specific deliverables,
                  timeline, and payment terms for each project will be outlined in a separate agreement or proposal.
                </p>
  
                <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">3. Client Responsibilities</h2>
                <p>
                  Clients are responsible for providing necessary content, feedback, and approvals in a timely manner.
                  Delays in providing required materials may result in project timeline extensions.
                </p>
  
                <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">4. Payment Terms</h2>
                <p>
                  Unless otherwise specified, we require a 50% deposit to begin work, with the remaining balance due upon
                  project completion. For larger projects, we may offer milestone-based payment plans.
                </p>
                <p>
                  Late payments may incur additional fees. We reserve the right to suspend work on projects with
                  outstanding balances.
                </p>
  
                <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">5. Revisions and Changes</h2>
                <p>
                  Each project includes a specific number of revision rounds as outlined in the project proposal.
                  Additional revisions beyond the included amount will be billed at our standard hourly rate.
                </p>
                <p>Significant changes to project scope may require a revised quote and timeline.</p>
  
                <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">6. Intellectual Property</h2>
                <p>
                  Upon full payment, clients receive rights to the final deliverables. We retain rights to display the
                  work in our portfolio unless otherwise agreed upon.
                </p>
                <p>
                  Clients are responsible for ensuring they have proper rights to all content provided for the project.
                </p>
  
                <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">7. Termination</h2>
                <p>
                  Either party may terminate the service agreement with written notice. In case of termination, the client
                  is responsible for payment for all work completed up to the termination date.
                </p>
  
                <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">8. Limitation of Liability</h2>
                <p>
                  Devtone is not liable for any indirect, incidental, special, consequential or punitive damages
                  resulting from your use of our services.
                </p>
  
                <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">9. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. We will provide notice of significant changes by
                  updating the date at the top of these terms.
                </p>
  
                <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">10. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at contact@devtone.agency.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }
  
  export default Terms
  