"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, Heart, Sparkles, Layers, Palette, Bot, Box } from "lucide-react";

const mockPreviousWishlists = [
  {
    id: 1,
    title: "Scandinavian Living Room",
    date: "2024-05-01",
    items: 4,
  },
  {
    id: 2,
    title: "Modern Bedroom",
    date: "2024-04-15",
    items: 3,
  },
];

const mockDownloadHistory = [
  {
    id: 1,
    name: "Minimalist Bundle.pdf",
    date: "2024-05-10",
    status: "Downloaded",
  },
  {
    id: 2,
    name: "Bohemian Theme.zip",
    date: "2024-04-20",
    status: "Downloaded",
  },
];

const ProfilePage: React.FC = () => {
  // Placeholder user data
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane.doe@email.com",
    password: "********",
  });
  const [editing, setEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleSave = () => setEditing(false); // Placeholder for save logic

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-xl p-0 shadow-sm overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Column: Profile Info & Account Actions */}
            <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-black mb-6">Profile</h1>
                {/* Profile Info */}
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <Input
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="bg-white border-gray-200 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className="bg-white border-gray-200 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <Input
                      name="password"
                      type="password"
                      value={profile.password}
                      onChange={handleChange}
                      disabled={!editing}
                      className="bg-white border-gray-200 text-black"
                    />
                  </div>
                  <div className="flex space-x-2 mt-2">
                    {editing ? (
                      <>
                        <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800">Save</Button>
                        <Button variant="outline" onClick={handleCancel} className="border-gray-300 text-black">Cancel</Button>
                      </>
                    ) : (
                      <Button onClick={handleEdit} className="bg-black text-white hover:bg-gray-800">Edit</Button>
                    )}
                  </div>
                </div>
              </div>
              {/* Account Actions */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-black mb-4">Account Actions</h2>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="border-gray-300 text-black">Manage Notifications</Button>
                  <button className="group flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <LogOut className="w-5 h-5 text-black group-hover:text-gray-700" />
                    <span className="text-black font-medium">Logout</span>
                  </button>
                  <Button variant="destructive" className="bg-white text-red-600 border-red-200 hover:bg-red-50">Delete Account</Button>
                </div>
              </div>
            </div>

            {/* Right Column: Navigation & History */}
            <div className="w-full md:w-1/2 p-8 flex flex-col gap-10">
              {/* Navigation Options */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">Navigation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/wishlist" className="group flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5 text-black group-hover:text-gray-700" />
                    <span className="text-black font-medium">Wishlist</span>
                  </Link>
                  <Link href="/product-bundles" className="group flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Layers className="w-5 h-5 text-black group-hover:text-gray-700" />
                    <span className="text-black font-medium">Product Bundles</span>
                  </Link>
                  <Link href="/inspiration" className="group flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Sparkles className="w-5 h-5 text-black group-hover:text-gray-700" />
                    <span className="text-black font-medium">Inspirations</span>
                  </Link>
                  <Link href="/design-themes" className="group flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Palette className="w-5 h-5 text-black group-hover:text-gray-700" />
                    <span className="text-black font-medium">Design Themes</span>
                  </Link>
                  <Link href="/gen-ai-studio" className="group flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Bot className="w-5 h-5 text-black group-hover:text-gray-700" />
                    <span className="text-black font-medium">GenAI Studio</span>
                  </Link>
                  <Link href="/3D-visualizer" className="group flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Box className="w-5 h-5 text-black group-hover:text-gray-700" />
                    <span className="text-black font-medium">3D Visualizer</span>
                  </Link>
                </div>
              </div>

              {/* Previous Wishlists */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">Previous Wishlists</h2>
                {mockPreviousWishlists.length === 0 ? (
                  <div className="text-gray-500">No previous wishlists found.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {mockPreviousWishlists.map((w) => (
                      <div key={w.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white">
                        <div>
                          <div className="font-medium text-black">{w.title}</div>
                          <div className="text-xs text-gray-500">{w.date} &middot; {w.items} items</div>
                        </div>
                        <Button size="sm" className="bg-black text-white hover:bg-gray-800">View</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Download/Order History */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">Download History</h2>
                {mockDownloadHistory.length === 0 ? (
                  <div className="text-gray-500">No downloads yet.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {mockDownloadHistory.map((d) => (
                      <div key={d.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white">
                        <div>
                          <div className="font-medium text-black">{d.name}</div>
                          <div className="text-xs text-gray-500">{d.date} &middot; {d.status}</div>
                        </div>
                        <Button size="sm" variant="outline" className="border-gray-300 text-black">Download</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
