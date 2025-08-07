# ShakPlay - Sports Match Recording & Analysis

A modern web application for recording, analyzing, and sharing sports matches with AI-powered insights. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Match Recording**: Record and track your sports matches
- **AI Analysis**: Get AI-powered insights on your performance
- **Club Management**: Find and book courts at local clubs
- **Performance Stats**: Track your progress and skill development
- **Social Features**: Share matches and connect with other players
- **Real-time Updates**: Live match scoring and updates
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Backend**: Xano (configurable)
- **Authentication**: Custom auth with Xano integration
- **Icons**: Lucide React
- **State Management**: React Context + Hooks

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/shakplay-app.git
   cd shakplay-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   
   Update `.env.local` with your configuration:
   \`\`\`env
   # Xano Configuration (optional - app works with mock data)
   NEXT_PUBLIC_XANO_WORKSPACE_URL=https://your-workspace-id.us-east-1.xano.io/api:your-api-key
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Xano Backend Setup (Optional)

The app works with mock data by default, but you can connect to a real Xano backend:

1. **Create a Xano workspace** at [xano.com](https://xano.com)
2. **Copy your workspace API URL**
3. **Update the environment variable** in `.env.local`
4. **Test the connection** using the built-in connection tester

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_XANO_WORKSPACE_URL` | Your Xano workspace API URL | No (uses mock data) |
| `NEXT_PUBLIC_APP_URL` | Your app's URL for metadata | Yes |

## 🎮 Usage

### Demo Credentials

For testing, use these demo credentials:
- **Email**: `demo@shakplay.com`
- **Password**: `demo123`

### Key Features

1. **Dashboard**: Overview of your matches, stats, and upcoming bookings
2. **Matches**: Create, manage, and analyze your matches
3. **Clubs**: Find and book courts at local tennis clubs
4. **Stats**: Track your performance and skill progression
5. **Profile**: Manage your personal information and achievements
6. **Settings**: Configure app preferences and test Xano connection

## 🏗️ Project Structure

\`\`\`
shakplay-app/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── theme-provider.tsx # Theme provider
│   └── xano-connection-test.tsx # Connection tester
├── hooks/                # Custom React hooks
│   └── useAuth.ts        # Authentication hook
├── lib/                  # Utility libraries
│   ├── api/              # API layer
│   ├── utils.ts          # Utility functions
│   └── xano-client.ts    # Xano API client
├── public/               # Static assets
└── styles/               # Additional styles
\`\`\`

## 🔌 API Integration

The app uses a flexible API layer that supports:

- **Mock Data**: Works out of the box for development
- **Xano Backend**: Production-ready backend integration
- **Custom APIs**: Easy to extend for other backends

### API Endpoints

- `POST /auth/login` - User authentication
- `POST /auth/signup` - User registration
- `GET /auth/me` - Get user profile
- `GET /matches` - Get user matches
- `GET /clubs` - Get tennis clubs
- `POST /matches` - Create new match

## 🎨 Customization

### Theming

The app uses Tailwind CSS with custom design tokens:

\`\`\`css
/* Custom ShakPlay colors */
.shakplay-gradient {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
}
\`\`\`

### Components

All UI components are built with shadcn/ui and can be customized:

\`\`\`bash
npx shadcn@latest add button
\`\`\`

## 🧪 Testing

### Connection Testing

The app includes a built-in Xano connection tester:

1. Go to Settings tab
2. Use the "Xano Connection Test" component
3. Get detailed diagnostics and setup instructions

### Manual Testing

Test the app with demo data:
- Login with demo credentials
- Explore all features
- Test responsive design

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables**
4. **Deploy**

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Xano](https://xano.com/) - Backend as a service

---

Built with ❤️ by the ShakPlay team
