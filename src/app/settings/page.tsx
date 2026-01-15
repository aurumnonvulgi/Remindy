"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
};

export default function SettingsPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [dailyFocus, setDailyFocus] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session ?? null);
      })
      .finally(() => setLoading(false));

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => setSession(nextSession)
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session) {
      setProfile(null);
      return;
    }

    supabase
      .from("profiles")
      .select("id,email,full_name")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data ?? null);
        setFullName(data?.full_name ?? "");
      });
  }, [session, supabase]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem("dailyFocus");
    if (stored) {
      setDailyFocus(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem("dailyFocus", dailyFocus);
  }, [dailyFocus]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarPick = (file: File | null) => {
    if (!file) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleProfileSave = async () => {
    if (!supabase || !session) {
      return;
    }
    setStatus("Saving profile...");
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
      })
      .eq("id", session.user.id);

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Profile updated.");
  };

  const handlePasswordChange = async () => {
    if (!supabase || !session) {
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }
    setStatus("Updating password...");
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      setStatus(error.message);
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setStatus("Password updated.");
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
    router.push("/");
  };

  const greetingInitial =
    profile?.full_name?.trim().charAt(0).toUpperCase() ??
    session?.user?.email?.trim().charAt(0).toUpperCase() ??
    "R";

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-black/10 bg-white/90 p-6 text-center shadow-[var(--shadow)]">
          <h1 className="font-display text-2xl">Connect Supabase</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Add your credentials to <code className="font-semibold">.env.local</code>{" "}
            and restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--muted)]">
        Loading settings...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white/90 p-6 text-center shadow-[var(--shadow)]">
          <h1 className="font-display text-2xl">Sign in required</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Please sign in to view your settings.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] pb-24 text-[#1f2328]">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
        <header className="flex items-center justify-between rounded-3xl bg-white px-6 py-5 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-[#9aa0aa]">
              Settings
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Profile &amp; Account</h1>
            <p className="text-sm text-[#8b8f98]">
              Manage your profile, password, and preferences.
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="rounded-2xl border border-[#eceff4] px-4 py-2 text-xs font-semibold text-[#6b7280]"
          >
            Back to lists
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9aa0aa]">
                Profile
              </h2>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-semibold text-white">
                    {greetingInitial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1f2937]">
                      {profile?.full_name || "Your profile"}
                    </p>
                    <p className="text-xs text-[#8b8f98]">{session.user.email}</p>
                  </div>
                </div>
                <div className="sm:ml-auto">
                  <label className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#cbd5f5] bg-[#f4f6ff] px-3 py-2 text-xs font-semibold text-[#4f46e5]">
                    {avatarPreview ? "Avatar selected" : "Upload photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        handleAvatarPick(event.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </div>
              </div>
              {avatarPreview ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-[#eceff4]">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-32 w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                    Full name
                  </label>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Add your name"
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                    Email
                  </label>
                  <input
                    value={session.user.email ?? ""}
                    readOnly
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f8f9fb] px-4 py-3 text-sm text-[#6b7280]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                    Focus for the day
                  </label>
                  <input
                    value={dailyFocus}
                    onChange={(event) => setDailyFocus(event.target.value)}
                    placeholder="e.g. Ship the list details page"
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleProfileSave}
                className="mt-5 rounded-2xl bg-[#1f2937] px-5 py-2 text-sm font-semibold text-white"
              >
                Save profile
              </button>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9aa0aa]">
                Security
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                    New password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat password"
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handlePasswordChange}
                className="mt-5 rounded-2xl border border-[#1f2937] px-5 py-2 text-sm font-semibold text-[#1f2937]"
              >
                Change password
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9aa0aa]">
                Account
              </h2>
              <p className="mt-3 text-sm text-[#6b7280]">
                Signed in as <span className="font-semibold text-[#1f2937]">{session.user.email}</span>
              </p>
              <div className="mt-4 rounded-2xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-xs text-[#92400e]">
                Need to switch accounts? Use the sign out button below.
              </div>
              <button
                onClick={handleSignOut}
                className="mt-5 w-full rounded-2xl bg-[#ef4444] px-4 py-3 text-sm font-semibold text-white"
              >
                Sign out
              </button>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9aa0aa]">
                Preferences
              </h2>
              <div className="mt-4 space-y-3 text-sm text-[#6b7280]">
                <div className="flex items-center justify-between rounded-2xl border border-[#eceff4] px-4 py-3">
                  <span>Weekly summary</span>
                  <span className="text-xs font-semibold text-[#1f2937]">Soon</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[#eceff4] px-4 py-3">
                  <span>Theme</span>
                  <span className="text-xs font-semibold text-[#1f2937]">
                    Sunrise
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {status ? (
          <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs text-[#6b7280] shadow-sm">
            {status}
          </div>
        ) : null}
      </div>
    </div>
  );
}
