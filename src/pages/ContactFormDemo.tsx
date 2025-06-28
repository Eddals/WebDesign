import { Helmet } from 'react-helmet-async';
import ContactFormWithResend from '../components/ContactFormWithResend';

export default function ContactFormDemo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Contact Form Demo - DevTone Agency</title>
        <meta name="description" content="Demo of our contact form with automatic email confirmation using Resend" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            <span className="block">Contact Form Demo</span>
            <span className="block text-blue-600">with Automatic Email Confirmation</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            This form demonstrates our email automation system using Resend. Fill out the form below to receive an automatic confirmation email.
          </p>
        </div>
        
        <div className="mt-10">
          <ContactFormWithResend />
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <ol className="list-decimal pl-5 space-y-4 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Submit the form</strong> - Your data is sent securely to our server
                </li>
                <li>
                  <strong>Server processes the data</strong> - Our webhook at <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">/api/webhooks/resend-simple</code> receives your information
                </li>
                <li>
                  <strong>Two emails are sent automatically</strong>:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>A confirmation email to you with details of your submission</li>
                    <li>A notification email to our team with your contact information</li>
                  </ul>
                </li>
                <li>
                  <strong>Our team reviews your message</strong> - We'll respond personally within 24 hours
                </li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>
            Powered by <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Resend</a> and <a href="https://devtone.agency" className="text-blue-600 hover:underline">DevTone Agency</a>
          </p>
        </div>
      </div>
    </div>
  );
}