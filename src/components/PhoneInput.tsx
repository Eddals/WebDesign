import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'

interface Country {
  code: string
  name: string
  dialCode: string
  flag: string // URL da imagem da bandeira
}

const countries: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: 'https://flagcdn.com/w20/us.png' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: 'https://flagcdn.com/w20/br.png' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: 'https://flagcdn.com/w20/ca.png' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: 'https://flagcdn.com/w20/mx.png' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: 'https://flagcdn.com/w20/ar.png' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: 'https://flagcdn.com/w20/cl.png' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: 'https://flagcdn.com/w20/co.png' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: 'https://flagcdn.com/w20/pe.png' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: 'https://flagcdn.com/w20/ve.png' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: 'https://flagcdn.com/w20/ec.png' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: 'https://flagcdn.com/w20/bo.png' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: 'https://flagcdn.com/w20/py.png' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: 'https://flagcdn.com/w20/uy.png' },
  { code: 'GY', name: 'Guyana', dialCode: '+592', flag: 'https://flagcdn.com/w20/gy.png' },
  { code: 'SR', name: 'Suriname', dialCode: '+597', flag: 'https://flagcdn.com/w20/sr.png' },
  { code: 'GF', name: 'French Guiana', dialCode: '+594', flag: 'https://flagcdn.com/w20/gf.png' },
  { code: 'FK', name: 'Falkland Islands', dialCode: '+500', flag: 'https://flagcdn.com/w20/fk.png' },
  { code: 'GS', name: 'South Georgia', dialCode: '+500', flag: 'https://flagcdn.com/w20/gs.png' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: 'https://flagcdn.com/w20/gb.png' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: 'https://flagcdn.com/w20/de.png' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: 'https://flagcdn.com/w20/fr.png' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: 'https://flagcdn.com/w20/it.png' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: 'https://flagcdn.com/w20/es.png' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: 'https://flagcdn.com/w20/pt.png' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: 'https://flagcdn.com/w20/nl.png' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: 'https://flagcdn.com/w20/be.png' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: 'https://flagcdn.com/w20/ch.png' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: 'https://flagcdn.com/w20/at.png' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: 'https://flagcdn.com/w20/se.png' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: 'https://flagcdn.com/w20/no.png' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: 'https://flagcdn.com/w20/dk.png' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: 'https://flagcdn.com/w20/fi.png' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: 'https://flagcdn.com/w20/pl.png' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: 'https://flagcdn.com/w20/cz.png' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: 'https://flagcdn.com/w20/hu.png' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: 'https://flagcdn.com/w20/ro.png' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: 'https://flagcdn.com/w20/bg.png' },
  { code: 'HR', name: 'Croatia', dialCode: '+385', flag: 'https://flagcdn.com/w20/hr.png' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: 'https://flagcdn.com/w20/si.png' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: 'https://flagcdn.com/w20/sk.png' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: 'https://flagcdn.com/w20/lt.png' },
  { code: 'LV', name: 'Latvia', dialCode: '+371', flag: 'https://flagcdn.com/w20/lv.png' },
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: 'https://flagcdn.com/w20/ee.png' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: 'https://flagcdn.com/w20/ie.png' },
  { code: 'IS', name: 'Iceland', dialCode: '+354', flag: 'https://flagcdn.com/w20/is.png' },
  { code: 'MT', name: 'Malta', dialCode: '+356', flag: 'https://flagcdn.com/w20/mt.png' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: 'https://flagcdn.com/w20/cy.png' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: 'https://flagcdn.com/w20/lu.png' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: 'https://flagcdn.com/w20/li.png' },
  { code: 'MC', name: 'Monaco', dialCode: '+377', flag: 'https://flagcdn.com/w20/mc.png' },
  { code: 'SM', name: 'San Marino', dialCode: '+378', flag: 'https://flagcdn.com/w20/sm.png' },
  { code: 'VA', name: 'Vatican City', dialCode: '+379', flag: 'https://flagcdn.com/w20/va.png' },
  { code: 'AD', name: 'Andorra', dialCode: '+376', flag: 'https://flagcdn.com/w20/ad.png' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: 'https://flagcdn.com/w20/au.png' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: 'https://flagcdn.com/w20/nz.png' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: 'https://flagcdn.com/w20/jp.png' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: 'https://flagcdn.com/w20/kr.png' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: 'https://flagcdn.com/w20/cn.png' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: 'https://flagcdn.com/w20/in.png' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: 'https://flagcdn.com/w20/ru.png' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: 'https://flagcdn.com/w20/za.png' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: 'https://flagcdn.com/w20/eg.png' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: 'https://flagcdn.com/w20/ng.png' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: 'https://flagcdn.com/w20/ke.png' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: 'https://flagcdn.com/w20/gh.png' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: 'https://flagcdn.com/w20/et.png' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: 'https://flagcdn.com/w20/tz.png' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: 'https://flagcdn.com/w20/ug.png' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: 'https://flagcdn.com/w20/dz.png' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: 'https://flagcdn.com/w20/ma.png' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: 'https://flagcdn.com/w20/tn.png' },
  { code: 'LY', name: 'Libya', dialCode: '+218', flag: 'https://flagcdn.com/w20/ly.png' },
  { code: 'SD', name: 'Sudan', dialCode: '+249', flag: 'https://flagcdn.com/w20/sd.png' },
  { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: 'https://flagcdn.com/w20/ss.png' },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236', flag: 'https://flagcdn.com/w20/cf.png' },
  { code: 'TD', name: 'Chad', dialCode: '+235', flag: 'https://flagcdn.com/w20/td.png' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: 'https://flagcdn.com/w20/ne.png' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: 'https://flagcdn.com/w20/ml.png' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: 'https://flagcdn.com/w20/bf.png' },
  { code: 'CI', name: 'Ivory Coast', dialCode: '+225', flag: 'https://flagcdn.com/w20/ci.png' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: 'https://flagcdn.com/w20/sn.png' },
  { code: 'GM', name: 'Gambia', dialCode: '+220', flag: 'https://flagcdn.com/w20/gm.png' },
  { code: 'GN', name: 'Guinea', dialCode: '+224', flag: 'https://flagcdn.com/w20/gn.png' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: 'https://flagcdn.com/w20/gw.png' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: 'https://flagcdn.com/w20/sl.png' },
  { code: 'LR', name: 'Liberia', dialCode: '+231', flag: 'https://flagcdn.com/w20/lr.png' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: 'https://flagcdn.com/w20/tg.png' },
  { code: 'BJ', name: 'Benin', dialCode: '+229', flag: 'https://flagcdn.com/w20/bj.png' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: 'https://flagcdn.com/w20/cm.png' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: 'https://flagcdn.com/w20/gq.png' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: 'https://flagcdn.com/w20/ga.png' },
  { code: 'CG', name: 'Republic of the Congo', dialCode: '+242', flag: 'https://flagcdn.com/w20/cg.png' },
  { code: 'CD', name: 'Democratic Republic of the Congo', dialCode: '+243', flag: 'https://flagcdn.com/w20/cd.png' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: 'https://flagcdn.com/w20/ao.png' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: 'https://flagcdn.com/w20/zm.png' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: 'https://flagcdn.com/w20/zw.png' },
  { code: 'BW', name: 'Botswana', dialCode: '+267', flag: 'https://flagcdn.com/w20/bw.png' },
  { code: 'NA', name: 'Namibia', dialCode: '+264', flag: 'https://flagcdn.com/w20/na.png' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: 'https://flagcdn.com/w20/sz.png' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: 'https://flagcdn.com/w20/ls.png' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: 'https://flagcdn.com/w20/mg.png' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: 'https://flagcdn.com/w20/mu.png' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: 'https://flagcdn.com/w20/sc.png' },
  { code: 'KM', name: 'Comoros', dialCode: '+269', flag: 'https://flagcdn.com/w20/km.png' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: 'https://flagcdn.com/w20/dj.png' },
  { code: 'SO', name: 'Somalia', dialCode: '+252', flag: 'https://flagcdn.com/w20/so.png' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: 'https://flagcdn.com/w20/er.png' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: 'https://flagcdn.com/w20/rw.png' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: 'https://flagcdn.com/w20/bi.png' },
  { code: 'MW', name: 'Malawi', dialCode: '+265', flag: 'https://flagcdn.com/w20/mw.png' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: 'https://flagcdn.com/w20/mz.png' },
  { code: 'RE', name: 'Réunion', dialCode: '+262', flag: 'https://flagcdn.com/w20/re.png' },
  { code: 'YT', name: 'Mayotte', dialCode: '+262', flag: 'https://flagcdn.com/w20/yt.png' },
  { code: 'ST', name: 'São Tomé and Príncipe', dialCode: '+239', flag: 'https://flagcdn.com/w20/st.png' },
  { code: 'CV', name: 'Cape Verde', dialCode: '+238', flag: 'https://flagcdn.com/w20/cv.png' },
]

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "Phone Number",
  className = "",
  disabled = false
}) => {
  const [detectedCountry, setDetectedCountry] = useState<Country>(countries[0]) // Start with US
  const [phoneNumber, setPhoneNumber] = useState("")

  // Function to detect country from phone number
  const detectCountry = (phoneNumber: string): Country => {
    if (!phoneNumber) return countries[0] // Return US as default
    
    // Remove all non-digit characters except +
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '')
    
    // Find country by dial code (longest match first)
    const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length)
    
    for (const country of sortedCountries) {
      if (cleanNumber.startsWith(country.dialCode)) {
        return country
      }
    }
    
    return countries[0] // Return US as default if no match
  }

  useEffect(() => {
    // Parse existing value to extract country and phone number
    if (value) {
      const country = detectCountry(value)
      setDetectedCountry(country)
      // Remove the dial code from the display number
      const numberWithoutCode = value.replace(country.dialCode, '').trim()
      setPhoneNumber(numberWithoutCode)
    }
  }, [value])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setPhoneNumber(input)
    
    // Detect country from the full input
    const fullNumber = input.startsWith('+') ? input : `+${input}`
    const country = detectCountry(fullNumber)
    setDetectedCountry(country)
    
    // Format phone number based on detected country
    let formattedNumber = input
    const numberWithoutCode = input.replace(country.dialCode, '').replace(/[^\d]/g, '')
    
    if (country.code === 'US' || country.code === 'CA') {
      // Format as 1 XXX XXX XXXX or (XXX) XXX-XXXX
      if (numberWithoutCode.length <= 3) {
        formattedNumber = numberWithoutCode
      } else if (numberWithoutCode.length <= 6) {
        formattedNumber = `${numberWithoutCode.slice(0, 3)} ${numberWithoutCode.slice(3)}`
      } else if (numberWithoutCode.length <= 10) {
        formattedNumber = `${numberWithoutCode.slice(0, 3)} ${numberWithoutCode.slice(3, 6)} ${numberWithoutCode.slice(6)}`
      } else {
        formattedNumber = `${numberWithoutCode.slice(0, 1)} ${numberWithoutCode.slice(1, 4)} ${numberWithoutCode.slice(4, 7)} ${numberWithoutCode.slice(7, 11)}`
      }
    } else if (country.code === 'BR') {
      // Format as (XX) XXXXX-XXXX
      if (numberWithoutCode.length <= 2) {
        formattedNumber = numberWithoutCode
      } else if (numberWithoutCode.length <= 7) {
        formattedNumber = `(${numberWithoutCode.slice(0, 2)}) ${numberWithoutCode.slice(2)}`
      } else {
        formattedNumber = `(${numberWithoutCode.slice(0, 2)}) ${numberWithoutCode.slice(2, 7)}-${numberWithoutCode.slice(7, 11)}`
      }
    } else {
      // For other countries, format with spaces every 3-4 digits
      let formatted = ''
      for (let i = 0; i < numberWithoutCode.length; i++) {
        if (i > 0 && (i % 3 === 0 || (i === 4 && numberWithoutCode.length > 7))) {
          formatted += ' '
        }
        formatted += numberWithoutCode[i]
      }
      formattedNumber = formatted
    }
    
    const newValue = country.dialCode + " " + formattedNumber
    onChange(newValue)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden">
        {/* Country Flag Display */}
        <div className="flex items-center gap-2 px-3 py-3 bg-white/5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <img 
              src={detectedCountry.flag}
              alt={`${detectedCountry.name} flag`}
              className="w-6 h-4 object-cover rounded-sm drop-shadow-sm"
            />
            <span className="text-white text-sm font-medium">{detectedCountry.dialCode}</span>
          </motion.div>
        </div>

        {/* Phone Input */}
        <div className="flex-1 flex items-center gap-2 px-3 py-3">
          <Phone className="w-4 h-4 text-white/50" />
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Country Name Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute -bottom-6 left-0 text-white/60 text-xs"
      >
        {detectedCountry.name}
      </motion.div>
    </div>
  )
}

export default PhoneInput