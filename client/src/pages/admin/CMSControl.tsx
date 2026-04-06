import React, { useState } from "react";
import { 
  Globe, Megaphone, Star, Link as LinkIcon, 
  Trash2, Plus, Edit2, Layout, Image, 
  Eye, Save, Rocket, Compass, Sparkles
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function CMSControl() {
  const { toast } = useToast();
  const [featuredRepos, setFeaturedRepos] = useState([
    { id: 1, name: "shadcn-ui", stars: "45k", desc: "Beautifully designed components." },
    { id: 2, name: "next.js", stars: "115k", desc: "The React Framework for the Web." },
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: 1, text: "v2.0 Launch: AI repository insights are now live!", status: "ACTIVE" },
  ]);

  const addFeatured = () => {
    toast({ title: "Feature Added", description: "Repository added to front-page rotation." });
  };

  const saveBanner = () => {
    toast({ title: "Banner Updated", description: "Global announcement banner is now live." });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">Content Control (CMS)</h1>
        <p className="text-slate-500 font-medium">Manage featured content, landing page announcements, and global site resources.</p>
      </div>

      <Tabs defaultValue="featured" className="w-full space-y-6">
        <div className="flex items-center justify-between">
           <TabsList className="bg-white/5 border border-white/10 p-1">
             <TabsTrigger value="featured" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Star className="w-4 h-4 mr-2" /> Featured
             </TabsTrigger>
             <TabsTrigger value="announcements" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Megaphone className="w-4 h-4 mr-2" /> Announcements
             </TabsTrigger>
             <TabsTrigger value="ui" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Layout className="w-4 h-4 mr-2" /> Layout Parts
             </TabsTrigger>
           </TabsList>
           
           <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-white/5 border-white/10 text-slate-400 hover:text-white">
                 <Eye className="w-4 h-4 mr-2" /> Preview Production
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20">
                 <Save className="w-4 h-4 mr-2" /> Publish Live
              </Button>
           </div>
        </div>

        <TabsContent value="featured" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl">
                 <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                       <CardTitle className="text-slate-200">Front-Page Spotlight</CardTitle>
                       <CardDescription className="text-slate-500">Repositories highlighted in the primary discovery feed.</CardDescription>
                    </div>
                    <Button size="sm" onClick={addFeatured} className="bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20">
                       <Plus className="w-3.5 h-3.5 mr-2" /> Add Repo
                    </Button>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {featuredRepos.map((repo) => (
                         <div key={repo.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 group hover:border-blue-500/30 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/10">
                                  <Rocket className="w-5 h-5 text-blue-400" />
                               </div>
                               <div>
                                  <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{repo.name}</h4>
                                  <p className="text-xs text-slate-500 max-w-sm italic">{repo.desc}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] text-slate-400">
                                  <Star className="w-3 h-3 mr-1.5 fill-yellow-500 text-yellow-500 border-none" /> {repo.stars}
                               </Badge>
                               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-white"><Edit2 size={14} /></Button>
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-red-500"><Trash2 size={14} /></Button>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                 <CardHeader>
                    <CardTitle className="text-slate-200">Selection Rules</CardTitle>
                    <CardDescription className="text-slate-500 italic">Automated vs Manual control logic.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-400 leading-relaxed">
                       <span className="text-blue-400 font-bold">PRO TIP:</span> Enable "AI Discovery Mode" to automatically feature trending repos based on user chat frequency.
                    </div>
                    <Button variant="outline" className="w-full bg-blue-600/5 border-blue-500/20 text-blue-400 h-10 uppercase text-[10px] tracking-widest font-bold">
                       Configure AI Discovery
                    </Button>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="announcements">
           <Card className="bg-white/5 border-white/10 backdrop-blur-xl max-w-3xl">
              <CardHeader>
                 <CardTitle className="text-slate-200">Global Announcement Banner</CardTitle>
                 <CardDescription className="text-slate-500">Displayed at the top of the app for all users.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Banner Text</label>
                    <Input 
                      defaultValue={announcements[0].text}
                      className="bg-black/40 border-white/10 text-white focus:border-blue-500/50" 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Target Action (URL)</label>
                       <Input placeholder="/premium" className="bg-black/40 border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Display Status</label>
                       <Badge className="bg-green-500/20 text-green-500 border-green-500/20 uppercase tracking-widest px-4 py-2 mt-1">ACTIVE</Badge>
                    </div>
                 </div>
                 <div className="pt-4 flex justify-end">
                    <Button onClick={saveBanner} className="bg-blue-600 hover:bg-blue-700 h-11 px-8 font-bold uppercase text-xs tracking-widest">
                       Update Banner
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="ui">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 p-6 flex flex-col gap-4 group cursor-pointer hover:border-blue-500/30 transition-all">
                 <div className="flex items-center gap-3">
                    <Compass className="w-10 h-10 text-blue-400" />
                    <h4 className="text-lg font-bold text-white">Discovery Hero Section</h4>
                 </div>
                 <p className="text-sm text-slate-500">Edit the greeting text and primary call-to-action on the landing page.</p>
                 <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Last Edited: 2d ago</span>
                    <Button variant="ghost" size="sm" className="text-blue-400 group-hover:translate-x-1 transition-transform">Edit Layout →</Button>
                 </div>
              </Card>

              <Card className="bg-white/5 border-white/10 p-6 flex flex-col gap-4 group cursor-pointer hover:border-blue-500/30 transition-all">
                 <div className="flex items-center gap-3">
                    <Sparkles className="w-10 h-10 text-purple-400" />
                    <h4 className="text-lg font-bold text-white">AI Response Templates</h4>
                 </div>
                 <p className="text-sm text-slate-500">Manage suggested questions and quick-action buttons for the AI chat interface.</p>
                 <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Last Edited: 5h ago</span>
                    <Button variant="ghost" size="sm" className="text-blue-400 group-hover:translate-x-1 transition-transform">Configure →</Button>
                 </div>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
