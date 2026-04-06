import { AppNavbar } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Check, Crown, Zap, Shield, Sparkles, Star, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for students and occasional explorers.",
    features: [
      "5-6 Repository searches",
      "Basic AI code analysis",
      "Search history (last 10 items)",
      "Standard support",
    ],
    icon: Zap,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "99",
    description: "Ideal for active developers and small projects.",
    features: [
      "20 Repository searches",
      "Enhanced AI context (larger files)",
      "Full search history",
      "Ad-free experience",
    ],
    icon: Shield,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Elite",
    price: "399",
    description: "For deep codebase auditing and security review.",
    features: [
      "40 Repository searches",
      "Advanced AI models (Gemini Pro)",
      "Multi-repo dependency analysis",
      "Priority dashboard access",
    ],
    icon: Crown,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    buttonVariant: "default" as const,
  },
  {
    name: "Unlimited",
    price: "999",
    description: "Enterprise power for teams and serious codebases.",
    features: [
      "Unlimited Repository searches",
      "Real-time streaming analysis",
      "Project-wide documentation generation",
      "24/7 Priority support",
    ],
    icon: Sparkles,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    buttonVariant: "default" as const,
  },
];

export default function Premium() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  const handlePlanClick = (planName: string) => {
    if (planName === "Free") {
      toast({
        title: "Current Plan",
        description: "You are already using the Free plan.",
      });
      return;
    }
    toast({
      title: "Coming Soon!",
      description: `The ${planName} plan will be available for purchase very soon. Stay tuned!`,
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans pb-20">
      <AppNavbar />
      
      <main className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Pricing Plans</h2>
           <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
             Elevate your <span className="text-primary italic">Developer Experience</span>
           </h1>
           <p className="text-lg text-[#8b949e] max-w-2xl mx-auto leading-relaxed">
             Unlock the true power of AI-driven repository analysis with our professional tiers. 
             Choose the plan that best fits your workflow.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {plans.map((plan, idx) => {
             const Icon = plan.icon;
             return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={cn(
                    "relative flex flex-col p-8 bg-[#161b22]/50 border border-[#30363d] rounded-[2.5rem] shadow-sm transition-all hover:border-primary/50 hover:bg-[#161b22] hover:shadow-2xl hover:shadow-primary/5",
                    plan.popular && "border-primary/50 ring-2 ring-primary/20 scale-105 z-10"
                  )}
                >
                   {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                         <Star className="w-3 h-3 fill-white" /> Most Popular
                      </div>
                   )}

                   <div className="flex items-center justify-between mb-8">
                     <div className={cn("p-3 rounded-2xl", plan.bgColor)}>
                       <Icon className={cn("w-6 h-6", plan.color)} />
                     </div>
                     <span className="text-sm font-semibold text-[#8b949e] tracking-wider uppercase">{plan.name}</span>
                   </div>

                   <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold tracking-tighter text-white">₹{plan.price}</span>
                        <span className="text-[#8b949e] font-medium">/mo</span>
                      </div>
                      <p className="mt-4 text-sm text-[#8b949e] leading-relaxed min-h-[40px]">
                        {plan.description}
                      </p>
                   </div>

                   <div className="space-y-4 mb-10 flex-1">
                      {plan.features.map(feature => (
                        <div key={feature} className="flex gap-3 text-sm font-medium">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-[#c9d1d9]">{feature}</span>
                        </div>
                      ))}
                   </div>

                   <Button 
                      variant={plan.buttonVariant === "outline" ? "ghost" : "default"} 
                      onClick={() => handlePlanClick(plan.name)}
                      className={cn(
                        "w-full h-12 rounded-2xl font-bold transition-all",
                        plan.buttonVariant === "default" && "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-white",
                        plan.buttonVariant === "outline" && "border-[#30363d] text-white hover:bg-[#21262d]"
                      )}
                   >
                     {plan.name === "Free" ? "Current Plan" : "Upgrade Plan"}
                   </Button>
                </motion.div>
             );
           })}
        </div>

        <div className="mt-20 p-10 bg-primary/5 rounded-[3rem] border border-primary/10 text-center space-y-6">
           <h3 className="text-2xl font-bold text-white">Trusted by developers at major startups</h3>
           <div className="flex flex-wrap justify-center items-center gap-10 opacity-30 grayscale invert dark:invert-0 px-4">
              <Github className="w-10 h-10 text-white" />
              <Zap className="w-10 h-10 text-white" />
              <Shield className="w-10 h-10 text-white" />
              <Crown className="w-10 h-10 text-white" />
              <Sparkles className="w-10 h-10 text-white" />
           </div>
        </div>
      </main>
    </div>
  );
}
