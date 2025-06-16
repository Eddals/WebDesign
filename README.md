# DevTone - Professional Web Development Agency

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, high-performance web development agency website built with React, TypeScript, and cutting-edge web technologies.

## 🚀 Features

### ✨ Modern Tech Stack
- **React 18** with TypeScript for type-safe development
- **Vite** for lightning-fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Query** for efficient data fetching and caching

### 🎨 Design & UX
- Fully responsive design that works on all devices
- Modern dark theme with purple accent colors
- Smooth animations and micro-interactions
- Accessibility-first approach (WCAG 2.1 compliant)
- SEO optimized with structured data

### 🔧 Performance Optimizations
- Code splitting with lazy loading
- Image optimization and lazy loading
- Bundle size optimization
- Performance monitoring and metrics
- Service worker for offline functionality

### 🛡️ Security & Best Practices
- Content Security Policy (CSP) headers
- XSS protection
- Secure environment variable handling
- Error boundary implementation
- Comprehensive error handling

### 📊 Analytics & Monitoring
- Google Analytics 4 integration
- Performance monitoring
- Error tracking and reporting
- User behavior analytics

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── SEO.tsx
│   └── ...
├── pages/              # Page components
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   └── ...
├── lib/                # Utility libraries
│   ├── supabase.ts
│   ├── performance.ts
│   ├── accessibility.ts
│   ├── env.ts
│   └── ...
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── styles/             # Global styles and animations
└── contexts/           # React contexts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/WebDesign.git
   cd WebDesign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual configuration values.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# App Configuration
VITE_APP_NAME=DevTone
VITE_APP_URL=https://www.devtone.agency

# Supabase (Database)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Stripe (Payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Analytics
VITE_GA_TRACKING_ID=your_ga_id
```

### Database Setup (Optional)

If you want to use the contact forms and user management features:

1. Create a [Supabase](https://supabase.com) account
2. Create a new project
3. Run the SQL scripts in the `database/` folder
4. Add your Supabase credentials to `.env`

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run type-check` | Run TypeScript type checking |
| `npm run generate-sitemap` | Generate sitemap.xml and robots.txt |
| `npm run clean` | Clean build directory |

## 🎨 Customization

### Colors & Theming

The project uses a custom color palette defined in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#faf5ff',
    500: '#a855f7',
    900: '#581c87',
  },
  // ... more colors
}
```

### Components

All components are built with:
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Accessibility best practices

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route to `src/App.tsx`
3. Update the sitemap generator in `scripts/generate-sitemap.js`

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist/` folder to Netlify
3. Configure environment variables
4. Set up continuous deployment

### Deploy to AWS S3 + CloudFront

1. Build the project: `npm run build`
2. Upload to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain and SSL

## 🔍 SEO Optimization

The project includes comprehensive SEO features:

- **Meta tags** for all pages
- **Open Graph** and Twitter Card support
- **Structured data** (JSON-LD)
- **Sitemap.xml** generation
- **Robots.txt** configuration
- **Canonical URLs**
- **Performance optimization** for Core Web Vitals

## ♿ Accessibility

Built with accessibility in mind:

- **WCAG 2.1 AA** compliance
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Focus management**
- **Color contrast** optimization
- **Reduced motion** support

## 📊 Performance

Performance optimizations include:

- **Code splitting** and lazy loading
- **Image optimization**
- **Bundle size optimization**
- **Caching strategies**
- **Performance monitoring**

Current Lighthouse scores:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 🛠️ Development

### Code Style

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking
- **Husky** for git hooks (optional)

### Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### Debugging

Development tools included:
- React Developer Tools support
- Performance monitoring
- Error boundary with detailed error info
- Environment configuration validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write accessible components
- Include proper error handling
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:

- 📧 Email: support@devtone.agency
- 💬 Create an issue on GitHub
- 📖 Check the documentation

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev/) - Icon library
- [Supabase](https://supabase.com/) - Backend as a Service

---

<div align="center">
  <p>Built with ❤️ by the DevTone team</p>
  <p>
    <a href="https://www.devtone.agency">Website</a> •
    <a href="https://twitter.com/devtone">Twitter</a> •
    <a href="https://linkedin.com/company/devtone">LinkedIn</a>
  </p>
</div>