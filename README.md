# WebDesign Portfolio

A modern, responsive web design portfolio built with React, TypeScript, and Vite.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Contact Forms**: Integrated with Supabase for data storage
- **Fallback Storage**: LocalStorage fallback when Supabase is not configured
- **SEO Optimized**: React Helmet for meta tags and SEO
- **Performance**: Optimized build with code splitting
- **Animations**: Framer Motion for smooth animations

## 🛠️ Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd WebDesign
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables (optional):
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_APP_URL=http://localhost:5173
```

### Development

Start the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── lib/                # Utility libraries
├── types/              # TypeScript type definitions
├── styles/             # Global styles
└── context/            # React context providers
```

## 🔧 Configuration

### Supabase Setup (Optional)

If you want to use Supabase for data storage:

1. Create a Supabase project
2. Set up the required tables (see `supabase/` directory)
3. Add your Supabase URL and anon key to `.env`

### Fallback Mode

The application works without Supabase configuration:
- Form submissions are stored in localStorage
- All features remain functional
- Data can be exported later for import to Supabase

## 🚀 Deployment

### AWS Amplify

The project includes an `amplify.yml` configuration file for AWS Amplify deployment:

1. Connect your repository to AWS Amplify
2. Set environment variables in Amplify console
3. Deploy automatically on push to main branch

### Other Platforms

The project can be deployed to any static hosting platform:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 🔒 Security

- XSS protection headers
- Content type validation
- Frame options security
- Input sanitization

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, please contact [your-email@example.com]