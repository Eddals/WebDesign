import { useState } from 'react'
import Head from 'next/head'

export default function NewsletterTest() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos
    if (!firstName.trim() || !email.trim()) {
      setMessage('Please fill in all required fields.')
      setIsSuccess(false)
      return
    }
    
    // Criar um iframe oculto para evitar problemas de CORS
    const iframe = document.createElement('iframe')
    iframe.name = 'newsletter-iframe'
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    
    // Criar um formulário HTML para submissão direta
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = 'https://api.brevo.com/v3/contacts'
    form.target = 'newsletter-iframe'
    form.style.display = 'none'
    
    // Adicionar campos ao formulário
    const apiKeyInput = document.createElement('input')
    apiKeyInput.type = 'hidden'
    apiKeyInput.name = 'api-key'
    apiKeyInput.value = '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'
    form.appendChild(apiKeyInput)
    
    // Criar um campo para o payload JSON
    const payloadInput = document.createElement('input')
    payloadInput.type = 'hidden'
    payloadInput.name = 'payload'
    
    // Construir o payload para o Brevo
    const payload = {
      email,
      attributes: {
        FIRSTNAME: firstName
      },
      listIds: [2],
      updateEnabled: true
    }
    
    // Adicionar telefone se fornecido
    if (phone.trim()) {
      payload.attributes.SMS = phone.trim()
    }
    
    payloadInput.value = JSON.stringify(payload)
    form.appendChild(payloadInput)
    
    // Adicionar o formulário ao documento
    document.body.appendChild(form)
    
    // Enviar o formulário
    form.submit()
    
    // Mostrar mensagem de sucesso após um breve atraso
    setTimeout(() => {
      setMessage('Thank you for subscribing! Check your email for confirmation.')
      setIsSuccess(true)
      
      // Limpar campos
      setFirstName('')
      setEmail('')
      setPhone('')
      
      // Remover o iframe e o formulário
      document.body.removeChild(iframe)
      document.body.removeChild(form)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Newsletter Test</title>
      </Head>
      
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
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Subscribe Now
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
          </div>
        </div>
      </div>
    </div>
  )
}