"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/user-use-profile";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  PersonIcon,
  LockClosedIcon,
  CheckIcon,
  EnvelopeClosedIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  IdCardIcon,
} from "@radix-ui/react-icons";

// Zod Validation Schemas
const profileSchema = z.object({
  name: z.string().refine((val) => val.replace(/\s+/g, "").length >= 3, {
    message: "Nama lengkap minimal 3 karakter",
  }),
  nim: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string(),
  new_password: z
    .string()
    .min(6, { message: "Password baru minimal 6 karakter" }),
});

export default function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const updateMutation = useUpdateUserProfile();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // React Hook Form for Profile
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      nim: "",
    },
  });

  // React Hook Form for Password
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
    },
  });

  // Reset profile form values when profile query finishes loading
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name || "",
        nim: profile.nim || "",
      });
    }
  }, [profile, profileForm]);

  const onProfileSubmit = (data) => {
    updateMutation.mutate({
      name: data.name.trim(),
      nim: data.nim,
    });
  };

  const onPasswordSubmit = (data) => {
    updateMutation.mutate(
      {
        current_password: data.current_password,
        new_password: data.new_password,
      },
      {
        onSuccess: () => {
          passwordForm.reset();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background mia-connected-bg flex items-center justify-center text-foreground">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring mx-auto"></div>
          <p className="text-base text-muted-foreground">
            Memuat profil Anda...
          </p>
        </div>
      </div>
    );
  }

  const profileErrors = profileForm.formState.errors;
  const passwordErrors = passwordForm.formState.errors;

  return (
    <div className="min-h-screen w-full bg-background mia-connected-bg text-foreground relative overflow-hidden selection:bg-primary selection:text-white flex flex-col justify-between">
      <Header />

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 flex-1">
        {/* Page Title Section */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Profile Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Kelola informasi profil dan keamanan akun Anda
          </p>
        </div>

        {/* Profile Card Container */}
        <div className="mia-card p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Header Profile Info Banner - Centered */}
          <div className="flex flex-col items-center text-center gap-5 pb-6 border-b border-border">
            {/* Avatar Container */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-input border-2 border-primary flex items-center justify-center shadow-xl shadow-red-900/30">
                <span className="text-4xl sm:text-5xl font-bold text-primary select-none">
                  {profile?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-mia-success rounded-full flex items-center justify-center ring-4 ring-background shadow-md">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Profile Meta Information - Centered */}
            <div className="space-y-3 text-center w-full max-w-md">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                  {profile?.name || "Nama Pengguna"}
                </h2>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {profile?.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="mia-pill-badge text-xs uppercase tracking-wider">
                  {profile?.role || "USER"}
                </span>

                {typeof profile?.points === "number" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mia-yellow/10 border border-mia-yellow/30 text-mia-yellow text-xs font-semibold">
                    💎 {profile.points} Diamonds
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-12 bg-input border border-border rounded-xl p-1">
              <TabsTrigger
                value="profile"
                className="flex items-center justify-center gap-2 rounded-full text-xs sm:text-sm font-medium text-muted-foreground dark:data-[state=active]:bg-mia-bg/30 transition-all cursor-pointer"
              >
                <PersonIcon className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="flex items-center justify-center gap-2 rounded-lg text-xs sm:text-sm font-medium text-muted-foreground dark:data-[state=active]:bg-mia-bg/30 transition-all cursor-pointer"
              >
                <LockClosedIcon className="w-4 h-4" />
                Password
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab Form */}
            <TabsContent value="profile" className="focus-visible:outline-none">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    Informasi Dasar
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Perbarui nama lengkap dan nomor induk mahasiswa Anda
                  </p>
                </div>

                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="block text-sm font-semibold text-foreground"
                      >
                        Nama Lengkap
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                          <PersonIcon className="w-4 h-4" />
                        </div>
                        <Input
                          id="name"
                          type="text"
                          {...profileForm.register("name")}
                          className={cn(
                            "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                            profileErrors.name
                              ? "border-destructive focus-visible:ring-destructive"
                              : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
                          )}
                          required
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      {profileErrors.name && (
                        <p className="text-xs text-destructive mt-1 font-medium">
                          {profileErrors.name.message}
                        </p>
                      )}
                    </div>

                    {/* NIM Field */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="nim"
                        className="block text-sm font-semibold text-foreground"
                      >
                        NIM
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                          <IdCardIcon className="w-4 h-4" />
                        </div>
                        <Input
                          id="nim"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          // Accept only numeric chars
                          {...profileForm.register("nim", {
                            onChange: (e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              profileForm.setValue("nim", val);
                            },
                          })}
                          className="h-11 bg-input border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 focus-visible:border-ring focus-visible:ring-ring/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Masukkan NIM"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Field (Disabled) */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                        <EnvelopeClosedIcon className="w-4 h-4" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="h-11 bg-background/80 border-border/50 rounded-xl pl-10 pr-4 text-sm text-mia-muted-2 cursor-not-allowed"
                        placeholder="Email tidak dapat diubah"
                      />
                    </div>
                    <p className="text-xs text-mia-muted-2">
                      Email terikat pada identitas akun dan tidak dapat diubah
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="mia-btn-primary h-11 px-8 text-sm font-semibold shadow-lg shadow-red-900/30 cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <span>Update Profile</span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* Password Tab Form */}
            <TabsContent
              value="password"
              className="focus-visible:outline-none"
            >
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    Keamanan Password
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Pastikan password baru Anda kuat dan belum pernah digunakan
                  </p>
                </div>

                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-5"
                >
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="current_password"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Password Saat Ini
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                        <LockClosedIcon className="w-4 h-4" />
                      </div>
                      <Input
                        id="current_password"
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        {...passwordForm.register("current_password")}
                        className="h-11 bg-input rounded-xl pl-10 pr-10 text-sm text-foreground placeholder:text-mia-muted-2 transition-all border-border focus-visible:border-ring focus-visible:ring-ring/50"
                        placeholder="Masukkan password saat ini"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        tabIndex={-1}
                        onClick={() => setShowCurrentPassword((v) => !v)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent cursor-pointer z-10"
                      >
                        {showCurrentPassword ? (
                          <EyeOpenIcon className="w-4 h-4" />
                        ) : (
                          <EyeClosedIcon className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.current_password && (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        {passwordErrors.current_password.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="new_password"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Password Baru
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                        <LockClosedIcon className="w-4 h-4" />
                      </div>
                      <Input
                        id="new_password"
                        type={showNewPassword ? "text" : "password"}
                        {...passwordForm.register("new_password")}
                        className={cn(
                          "h-11 bg-input rounded-xl pl-10 pr-10 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                          passwordErrors.new_password
                            ? "border-destructive focus-visible:ring-destructive"
                            : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
                        )}
                        placeholder="Masukkan password baru"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        tabIndex={-1}
                        onClick={() => setShowNewPassword((v) => !v)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent cursor-pointer z-10"
                      >
                        {showNewPassword ? (
                          <EyeOpenIcon className="w-4 h-4" />
                        ) : (
                          <EyeClosedIcon className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.new_password ? (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        {passwordErrors.new_password.message}
                      </p>
                    ) : (
                      <p className="text-xs text-mia-muted-2">
                        Password baru minimal 6 karakter
                      </p>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="mia-btn-primary h-11 px-8 text-sm font-semibold shadow-lg shadow-red-900/30 cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <span>Update Password</span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
