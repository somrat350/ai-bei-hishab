import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col justify-between">

      {/* Navbar */}
      <div className="navbar bg-base-200 shadow-md px-4 sm:px-8">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold text-primary tracking-wide">
            Ai-Bei-Hishab
          </Link>
        </div>
        <div className="flex-none gap-2">
          <Link href="/login" className="btn btn-ghost btn-sm sm:btn-md rounded-btn">
            Login
          </Link>
          <Link href="/dashboard" className="btn btn-primary btn-sm sm:btn-md rounded-btn">
            Dashboard
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero bg-base-100 flex-grow py-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Apnar Taker Hisheb, <span className="text-primary">Ebar Thakbe Angule!</span>
            </h1>
            <p className="py-6 text-base sm:text-lg opacity-80 leading-relaxed">
              Dainondin aay, khoros abong savings er nikhut o shohoj hisheb rakhar personal platform. Ajki register korun abong apnar arthik porikolponake korun aro shoktishali.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link href="/login" className="btn btn-primary btn-md sm:btn-lg shadow-lg">
                Get Started (Login)
              </Link>
              <Link href="/dashboard" className="btn btn-outline btn-secondary btn-md sm:btn-lg">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Features Section */}
      <div className="bg-base-200 py-12 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Feature 1 */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </div>
              <h2 className="card-title text-xl font-bold">Daily Income & Expense</h2>
              <p className="text-sm opacity-75">Kothai koto taka khoros holo ba kotha theke aay holo, shob kisu track korun date shoho.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-secondary/10 text-secondary mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="card-title text-xl font-bold">Strict Savings Rule</h2>
              <p className="text-sm opacity-75">Shukrobar bade protidin minimum 200 BDT shonchoy korar bishes nirdeshona o automatic system validation.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-accent/10 text-accent mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="card-title text-xl font-bold">Smart Calendar & Filter</h2>
              <p className="text-sm opacity-75">Calendar variable select kore ba specific text search term diye muhurtei purono shob data khuje ber korun.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content text-xs sm:text-sm">
        <div>
          <p>© {new Date().getFullYear()} - Ai-Bei-Hishab Tracker. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}