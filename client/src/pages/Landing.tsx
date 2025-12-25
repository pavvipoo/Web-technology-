import { PublicNavbar } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, MessageSquare, Shield, Zap, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] opacity-30 -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] opacity-20 -z-10 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Now supporting all public repositories
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8">
            Chat with any <br />
            <span className="text-gradient-primary">GitHub Repository</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop digging through thousands of lines of code. Just ask questions. 
            RepoChat analyzes codebases instantly so you can ship faster.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105 active:scale-95">
                Start Chatting Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg border-white/10 hover:bg-white/5">
              View Demo
            </Button>
          </div>
        </motion.div>

        {/* Hero Visual Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="glass-card rounded-2xl p-2 border border-white/10 shadow-2xl">
            <div className="bg-background/80 rounded-xl overflow-hidden aspect-[16/9] flex items-center justify-center border border-white/5">
               {/* Dashboard mockup placeholder using stock image */}
               {/* Dashboard placeholder */}
               <div className="relative w-full h-full bg-slate-950 flex flex-col">
                  <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="ml-4 w-64 h-6 rounded bg-white/5" />
                  </div>
                  <div className="flex-1 p-8 flex gap-8">
                     <div className="w-64 h-full hidden md:block space-y-4">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-12 w-full rounded-lg bg-white/5" />
                        ))}
                     </div>
                     <div className="flex-1 space-y-6">
                        <div className="h-32 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/5" />
                        <div className="grid grid-cols-2 gap-6">
                           <div className="h-40 rounded-xl bg-white/5" />
                           <div className="h-40 rounded-xl bg-white/5" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Smart Search",
                desc: "Find relevant code snippets instantly using natural language queries instead of regex."
              },
              {
                icon: MessageSquare,
                title: "Context Aware",
                desc: "The AI understands the relationship between files, functions, and components."
              },
              {
                icon: Zap,
                title: "Instant Answers",
                desc: "Get explanations, refactoring suggestions, and bug fixes in seconds."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-muted-foreground">
        <p>&copy; 2024 RepoChat. All rights reserved.</p>
      </footer>
    </div>
  );
}
