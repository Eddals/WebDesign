import React, { useState } from 'react'

export default function NewsletterTest() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos
    if (!firstName.trim() || !email.trim()) {
      setMessage('Please fill in all required fields.')
      setIsSuccess(false)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      console.log('Sending newsletter subscription:', {
        firstName,
        email,
        phone: phone || 'não fornecido'
      })
      
      const res = await fetch('/api/newsletter-brevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          firstName,
          phone: phone || 'não fornecido'
        })
      })

      console.log('Newsletter response status:', res.status)
      console.log('Newsletter response headers:', Object.fromEntries(res.headers.entries()))

      // Check if response has content before trying to parse JSON
      const responseText = await res.text()
      console.log('Newsletter response text:', responseText)
      console.log('Newsletter response text length:', responseText.length)

      // Handle completely empty responses
      if (!responseText || responseText.trim() === '') {
        console.error('Received completely empty response from newsletter API')
        throw new Error('Server returned empty response. The newsletter API endpoint may not be working correctly.')
      }

      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse newsletter response as JSON:', parseError)
        console.error('Raw response text:', responseText)
        throw new Error(`Newsletter API returned invalid JSON. Raw response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`)
      }

      if (!res.ok) {
        console.error('Newsletter API error:', result)
        throw new Error(result.error || result.message || `Newsletter API error: HTTP ${res.status}: ${res.statusText}`)
      }
      
      console.log('Newsletter subscription successful:', result)
      
      // Mostrar mensagem de sucesso
      setMessage('Thank you for subscribing! Check your email for confirmation.')
      setIsSuccess(true)
      
      // Limpar campos
      setFirstName('')
      setEmail('')
      setPhone('')
      
    } catch (error) {
      console.error('Newsletter error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setMessage(errorMessage)
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Test Page</div>
          <h1 className="text-2xl font-bold mb-5">Newsletter Signup Test</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </div>
          </form>
          
          {message && (
            <div className={`mt-4 p-4 rounded-md ${isSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </div>
          )}
          
          <div className="mt-8 text-sm text-gray-500">
            <p>This is a test page for the newsletter signup functionality.</p>
            <p className="mt-2">After submitting the form, you should see a success message and receive a confirmation email.</p>
            <p className="mt-2">The form uses the <code>/api/newsletter-brevo</code> endpoint to handle the subscription.</p>
          </div>
        </div>
      </div>
    </div>
  )
}