import Link from "next/link";
import { Ghost, Home } from "lucide-react";

/**
 * Custom 404 Page
 * 
 * Concept: 
 * A funny "lost student" theme that resonates with the OAU community.
 */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-white dark:bg-stone-950 flex items-center justify-center px-6 transition-colors duration-300">
      <div className="max-w-md w-full text-center">
        <div className="mb-10 relative inline-block">
          <div className="w-32 h-32 bg-stone-900 dark:bg-stone-100 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
            <Ghost className="w-16 h-16 text-white dark:text-stone-900" />
          </div>
          <div className="absolute -top-2 -right-2 px-3 py-1 bg-primary text-white text-xs font-black rounded-full rotate-12 shadow-lg">
            404
          </div>
        </div>

        <h1 className="text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tighter mb-4 uppercase">
          Omo, You Don Lost!
        </h1>
        
        <p className="text-stone-600 dark:text-stone-400 mb-8 font-medium leading-relaxed">
          This page is like a 7:30 AM lecture at spiders—nowhere to be found. 
          Maybe the URL is wrong, or maybe it graduated and left campus.
        </p>

        <div className="flex flex-col gap-3">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
            GO BACK TO CAMPUS (HOME)
          </Link>
          
          <p className="text-xs text-stone-400 dark:text-stone-600 font-bold uppercase tracking-widest mt-4">
            Error Code: STUDENT_DUE_FOR_GRADUATION
          </p>
        </div>
      </div>
    </main>
  );
}
