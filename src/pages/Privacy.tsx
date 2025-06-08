const Privacy = () => {
  return (
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
            <h1 className="text-4xl font-bold mb-4 text-white">Privacy Policy</h1>
            <p className="text-white/70 max-w-2xl mx-auto">Last updated: April 11, 2024</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-12">
            <div className="prose prose-invert max-w-none text-white/80">
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
              <p>
                At Devtone, we respect your privacy and are committed to protecting your personal data. This privacy
                policy will inform you about how we look after your personal data when you visit our website and tell
                you about your privacy rights and how the law protects you.
              </p>

              <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">2. Information We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped
                together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Identity Data includes first name, last name, username or similar identifier.</li>
                <li>Contact Data includes email address, telephone numbers, and physical address.</li>
                <li>
                  Technical Data includes internet protocol (IP) address, browser type and version, time zone setting
                  and location, browser plug-in types and versions, operating system and platform, and other technology
                  on the devices you use to access this website.
                </li>
                <li>Usage Data includes information about how you use our website and services.</li>
                <li>
                  Marketing and Communications Data includes your preferences in receiving marketing from us and our
                  third parties and your communication preferences.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">3. How We Use Your Information</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal
                data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our services</li>
                <li>To monitor the usage of our services</li>
                <li>To detect, prevent and address technical issues</li>
                <li>
                  To provide you with news, special offers and general information about other goods, services and
                  events which we offer
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally
                lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to
                your personal data to those employees, agents, contractors and other third parties who have a business
                need to know.
              </p>

              <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">5. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it
                for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>

              <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">6. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal
                data, including the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">7. Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our service and hold certain
                information. Cookies are files with small amount of data which may include an anonymous unique
                identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
                if you do not accept cookies, you may not be able to use some portions of our service.
              </p>

              <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">8. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
              </p>

              <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">9. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@matheusweb.com.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
