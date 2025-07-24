# FridgeLicious 🍎

A modern web application for managing your fridge contents and tracking your daily nutrition goals. Built with Next.js, Redux Toolkit, and TypeScript.

## Features

### 🥗 Fridge Management

- **Add/Remove Items**: Easily add food items to your virtual fridge
- **Duplicate Prevention**: Automatically prevents adding duplicate items
- **Bulk Operations**: Clear all items with one click
- **Visual Grid Layout**: Clean, responsive display of your fridge contents

### 👤 User Profile Management

- **Personalized Username**: Set and update your username
- **Calorie Tracking**: Configure your daily calorie intake goals
- **Profile Reset**: Reset your profile data when needed
- **Dedicated Profile Page**: Separate page for managing user settings

### 💾 Data Persistence

- **Local Storage**: All data automatically saves to localStorage
- **Auto-Restore**: Data is restored when you refresh the page
- **Cross-Session**: Your data persists between browser sessions
- **Reliable Storage**: Graceful fallback if localStorage is unavailable

### 🎨 Modern UI/UX

- **Responsive Design**: Works perfectly on desktop and mobile
- **Clean Navigation**: Professional navbar with user avatar
- **Intuitive Interface**: Easy-to-use forms and controls
- **Visual Feedback**: Clear indication of data persistence

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) with RTK Query
- **Persistence**: [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Code Quality**: ESLint + Prettier integration
- **Development**: Turbopack for fast development builds

## Getting Started

### Prerequisites

- Node.js 22+ (NVM recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fridgelicious
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

## Project Structure

```text
fridgelicious/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── FridgeManager.tsx    # Main fridge management component
│   │   │   └── Navbar.tsx           # Navigation bar component
│   │   ├── profile/
│   │   │   └── page.tsx             # User profile page
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── page.tsx                 # Home page
│   │   ├── providers.tsx            # Redux providers
│   │   └── globals.css              # Global styles
│   └── store/
│       ├── fridgeContentsSlice.ts   # Fridge contents state management
│       ├── userDataSlice.ts         # User profile state management
│       ├── store.ts                 # Redux store configuration
│       └── hooks.ts                 # Typed Redux hooks
├── public/                          # Static assets
├── .prettierrc                      # Prettier configuration
├── .prettierignore                  # Prettier ignore rules
├── eslint.config.mjs               # ESLint configuration
└── package.json                     # Dependencies and scripts
```

## Redux Store Structure

### FridgeContents Slice

- **State**: Array of food item strings
- **Actions**: `addItem`, `removeItem`, `clearAllItems`, `setItems`
- **Persistence**: Automatically saved to localStorage

### UserData Slice

- **State**: `username` (string), `dailyCalorieIntake` (number)
- **Actions**: `setUsername`, `setDailyCalorieIntake`, `updateUserData`, `resetUserData`
- **Persistence**: Automatically saved to localStorage

## Development Features

### Code Quality

- **ESLint + Prettier**: Consistent code formatting and linting
- **TypeScript**: Full type safety throughout the application
- **Declarative Code**: Clean, composable functions following best practices

### Performance

- **Turbopack**: Fast development builds
- **Redux Persist**: Efficient state persistence
- **Next.js Optimization**: Automatic code splitting and optimization

### User Experience

- **Responsive Design**: Mobile-first approach
- **Accessibility**: Semantic HTML and keyboard navigation
- **Error Handling**: Graceful fallbacks for edge cases

## Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Other Platforms

This application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- State management with [Redux Toolkit](https://redux-toolkit.js.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons and UI inspiration from modern design systems
