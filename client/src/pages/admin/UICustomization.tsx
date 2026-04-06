import React, { useState } from "react";
import { 
  Moon, Save, RefreshCw, Smartphone, Monitor, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function UICustomization() {
  const { toast } = useToast();
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [glassStrength, setGlassStrength] = useState([40]);

  const handleSave = () => {
    toast({
      title: "Settings Preserved",
      description: "Global UI tokens have been updated across all nodes.",
    });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">UI & Theme Engine</h1>
        <p className="text-slate-500 font-medium">Customize the platform's visual identity, typography, and glassmorphism parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Identity */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-200">Global Branding</CardTitle>
            <CardDescription className="text-slate-500 italic">Core visual tokens for the entire platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Accent Primary Color</label>
              <div className="flex gap-4">
                <Input 
                  type="color" 
                  value={accentColor} 
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-20 h-10 p-1 bg-black/40 border-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex-1 flex gap-2">
                  {["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"].map((c) => (
                    <button 
                      key={c} 
                      onClick={() => setAccentColor(c)}
                      className={cn(
                        "w-10 h-10 rounded-xl border border-white/10 transition-all duration-200 hover:scale-110 active:scale-95",
                        accentColor === c && "ring-2 ring-white/50 ring-offset-2 ring-offset-[#09090b]"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                <span>Glassmorphism Strength</span>
                <span className="text-blue-400 font-bold">{glassStrength}%</span>
              </div>
              <Slider 
                value={glassStrength} 
                onValueChange={setGlassStrength} 
                max={100} 
                step={1} 
                className="py-4"
              />
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-200">Forced Dark Mode</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-200">High-Performance Animations</span>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Live Component Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="p-8 rounded-3xl backdrop-blur-2xl border border-white/10 bg-black/40 flex flex-col items-center text-center">
                <motion.div 
                  className="w-16 h-16 rounded-2xl mb-6 shadow-2xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ backgroundColor: accentColor }}
                />
                <h4 className="text-2xl font-bold text-white mb-2">Platform Preview</h4>
                <p className="text-xs text-slate-400 max-w-[240px] italic">Your chosen tokens will propagate instantly across all UI nodes.</p>
                <Button 
                  className="mt-8 px-8 h-12 font-bold uppercase text-[10px] tracking-widest shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  Primary Action Button
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center gap-3 cursor-pointer hover:bg-white/10 transition-all">
              <Monitor className="w-6 h-6 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Desktop View</span>
            </Card>
            <Card className="bg-blue-500/5 border-blue-500/30 p-6 flex flex-col items-center gap-3 cursor-pointer hover:bg-blue-500/10 transition-all">
              <Smartphone className="w-6 h-6 text-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Mobile Sync</span>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white/5 border border-white/10 p-6 rounded-3xl">
        <div className="flex items-center gap-3 text-slate-500 italic text-sm">
          <RefreshCw className="w-4 h-4" /> All changes will require a production cache purge.
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-slate-400 hover:text-white">Reset Defaults</Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 px-10 h-12 font-bold uppercase text-xs tracking-widest">
            <Save className="w-4 h-4 mr-2" /> Save & Deploy
          </Button>
        </div>
      </div>
    </div>
  );
}
