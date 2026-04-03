# Fun SQL Quiz 

A fun quiz to practice SQL basics. Built as an experiment using [Lovable](https://lovable.dev/) — an AI-powered app builder, then adapted under manual control.

🔗 **Live site**: https://sandarlim.github.io/fun-sql-quiz

## Tech Stack

- [Vite](https://vitejs.dev/) — build tool
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) — database & backend
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Tailwind CSS](https://tailwindcss.com/) — styling

## Running locally

1. Clone the repo
```bash
   git clone https://github.com/sandarlim/fun-sql-quiz.git
   cd fun-sql-quiz
```

2. Install dependencies
```bash
   npm install
```

3. Create a `.env` file in the root with your Supabase credentials
```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
```

4. Start the dev server
```bash
   npm run dev
```