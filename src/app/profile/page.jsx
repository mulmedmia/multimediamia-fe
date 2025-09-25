"use client";

import React, { useState } from "react";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/user-use-profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Pencil2Icon,
  PersonIcon,
  LockClosedIcon,
  CheckIcon,
} from "@radix-ui/react-icons";

export default function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const updateMutation = useUpdateUserProfile();

  const [form, setForm] = useState({
    name: "",
    nim: "",
    current_password: "",
    new_password: "",
  });

  React.useEffect(() => {
    if (profile) {
      setForm((f) => ({
        ...f,
        name: profile.name || "",
        nim: profile.nim || "",
      }));
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      name: form.name,
      nim: form.nim,
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      current_password: form.current_password,
      new_password: form.new_password,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Memuat profil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-900 via-red-800 to-red-700 bg-clip-text text-transparent pb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Kelola informasi profil dan keamanan akun Anda
            </p>
          </div>

          <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm pt-0">
            {/* Enhanced Header with Gradient */}
            <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 p-8 relative">
              <div className="absolute inset-0 bg-black/10"></div>

              <div className="relative z-10 flex flex-col items-center text-white">
                {/* Enhanced Avatar */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-white shadow-2xl flex items-center justify-center ring-4 ring-white/30">
                    <span className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {profile?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white">
                    <CheckIcon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">
                    {profile?.name || "Nama Pengguna"}
                  </h2>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-3">
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      {profile?.role || "USER"}
                    </span>
                  </div>
                  <p className="text-white/90 text-lg mb-2">{profile?.email}</p>
                  {typeof profile?.points === "number" && (
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-400/20 backdrop-blur-sm">
                      <span className="text-yellow-100 font-semibold">
                        💎 {profile.points} Diamonds
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Tabs */}
            <CardContent className="p-8">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
                  <TabsTrigger
                    value="profile"
                    className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm cursor-pointer"
                  >
                    <PersonIcon className="w-4 h-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm cursor-pointer"
                  >
                    <LockClosedIcon className="w-4 h-4" />
                    Password
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">
                        Informasi Profil
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Perbarui informasi dasar profil Anda
                      </p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Nama Lengkap
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="h-11 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan nama lengkap"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nim" className="text-sm font-medium">
                            NIM
                          </Label>
                          <Input
                            id="nim"
                            name="nim"
                            value={form.nim}
                            onChange={handleChange}
                            type="number"
                            className="h-11 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan NIM"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          value={profile?.email || ""}
                          type="email"
                          disabled
                          className="h-11 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500"
                          placeholder="Email tidak dapat diubah"
                        />
                        <p className="text-xs text-gray-500">
                          Email tidak dapat diubah untuk keamanan akun
                        </p>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={updateMutation.isPending}
                          className="h-11 px-8 bg-gradient-to-r from-red-900 via-red-800 to-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                          {updateMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Menyimpan...
                            </>
                          ) : (
                            "Update Profile"
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>

                {/* Password Tab */}
                <TabsContent value="password">
                  <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">
                        Ubah Password
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Pastikan password baru Anda kuat dan aman
                      </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="current_password"
                          className="text-sm font-medium"
                        >
                          Password Saat Ini
                        </Label>
                        <Input
                          id="current_password"
                          name="current_password"
                          value={form.current_password}
                          onChange={handleChange}
                          type="password"
                          required
                          className="h-11 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Masukkan password saat ini"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="new_password"
                          className="text-sm font-medium"
                        >
                          Password Baru
                        </Label>
                        <Input
                          id="new_password"
                          name="new_password"
                          value={form.new_password}
                          onChange={handleChange}
                          type="password"
                          required
                          className="h-11 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Masukkan password baru"
                        />
                        <p className="text-xs text-gray-500">
                          Minimal 8 karakter dengan kombinasi huruf dan angka
                        </p>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={updateMutation.isPending}
                          className="h-11 px-8 bg-gradient-to-r from-red-900 via-red-800 to-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                          {updateMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Menyimpan...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
