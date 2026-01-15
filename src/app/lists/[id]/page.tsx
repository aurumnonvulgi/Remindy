"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase/client";

type List = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  created_at: string;
  owner_id: string;
};

type Item = {
  id: string;
  list_id: string;
  type: "text" | "audio" | "image" | "video" | "doodle";
  title: string;
  notes: string | null;
  status: "open" | "completed";
  priority: "low" | "medium" | "high";
  reminder_at: string | null;
  media_url: string | null;
};

type Member = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: "owner" | "editor" | "viewer";
};

const colorOptions = [
  { label: "Default", value: "" },
  { label: "Lavender", value: "from-[#efe9ff] to-[#f7f4ff] border-[#d8cef9] text-[#5c3ec8]" },
  { label: "Sunrise", value: "from-[#fff1dc] to-[#fff8ed] border-[#f1d6a7] text-[#8a5b1e]" },
  { label: "Mint", value: "from-[#e9fff4] to-[#f2fff9] border-[#bfead6] text-[#2a7b5d]" },
  { label: "Peach", value: "from-[#fff0e7] to-[#fff7f1] border-[#f1c9b1] text-[#c46a2c]" },
  { label: "Ocean", value: "from-[#e0f2fe] to-[#f0f9ff] border-[#7dd3fc] text-[#0369a1]" },
  { label: "Berry", value: "from-[#ffe4f1] to-[#fff1f7] border-[#f9a8d4] text-[#9d174d]" },
  { label: "Slate", value: "from-[#e2e8f0] to-[#f8fafc] border-[#cbd5f5] text-[#475569]" },
  { label: "Lime", value: "from-[#ecfccb] to-[#f7fee7] border-[#bef264] text-[#3f6212]" },
];

const getColorLabel = (value: string | null) => {
  if (!value) return "Default";
  return colorOptions.find((option) => option.value === value)?.label ?? "Custom";
};

export default function ListDetailPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const listId = params?.id ?? "";
  const [session, setSession] = useState<Session | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [list, setList] = useState<List | null>(null);
  const [listName, setListName] = useState("");
  const [listColor, setListColor] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("viewer");
  const [notice, setNotice] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "completed">("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "text" | "audio" | "image" | "video" | "doodle"
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!supabase) {
      setLoadingAuth(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session ?? null))
      .finally(() => setLoadingAuth(false));

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => setSession(nextSession)
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session || !listId) {
      setList(null);
      setItems([]);
      return;
    }

    const loadList = async () => {
      const { data: listData } = await supabase
        .from("lists")
        .select("id,name,color,icon,created_at,owner_id")
        .eq("id", listId)
        .single();
      if (listData) {
        setList(listData);
        setListName(listData.name);
        setListColor(listData.color ?? "");
      }

      const { data: itemData } = await supabase
        .from("items")
        .select("id,list_id,type,title,notes,status,priority,reminder_at,media_url")
        .eq("list_id", listId)
        .order("created_at");

      setItems(itemData ?? []);
    };

    loadList();
  }, [listId, session, supabase]);

  useEffect(() => {
    if (!supabase || !session || !listId) {
      setMembers([]);
      return;
    }

    const loadMembers = async () => {
      const { data: memberRows } = await supabase
        .from("list_members")
        .select("user_id,role")
        .eq("list_id", listId);

      if (!memberRows) {
        setMembers([]);
        return;
      }

      const userIds = memberRows.map((row) => row.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id,email,full_name")
        .in("id", userIds);

      const profileMap = new Map(
        (profiles ?? []).map((profile) => [profile.id, profile])
      );

      const next = memberRows.map((row) => {
        const profile = profileMap.get(row.user_id);
        return {
          user_id: row.user_id,
          email: profile?.email ?? null,
          full_name: profile?.full_name ?? null,
          role: row.role as "owner" | "editor" | "viewer",
        };
      });

      setMembers(next);
    };

    loadMembers();
  }, [listId, session, supabase]);

  useEffect(() => {
    if (!supabase || items.length === 0) {
      setMediaUrls({});
      return;
    }

    const loadMedia = async () => {
      const next: Record<string, string> = {};
      await Promise.all(
        items.map(async (item) => {
          if (!item.media_url) {
            return;
          }
          const { data } = await supabase.storage
            .from("media")
            .createSignedUrl(item.media_url, 3600);
          if (data?.signedUrl) {
            next[item.id] = data.signedUrl;
          }
        })
      );
      setMediaUrls(next);
    };

    loadMedia();
  }, [items, supabase]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      if (typeFilter !== "all" && item.type !== typeFilter) {
        return false;
      }
      if (priorityFilter !== "all" && item.priority !== priorityFilter) {
        return false;
      }
      return true;
    });
  }, [items, priorityFilter, statusFilter, typeFilter]);

  const handleSaveList = async () => {
    if (!supabase || !list) {
      return;
    }
    const name = listName.trim();
    if (!name) {
      setNotice("List name is required.");
      return;
    }
    setNotice("Saving...");
    const { error } = await supabase
      .from("lists")
      .update({ name, color: listColor || null })
      .eq("id", list.id);
    if (error) {
      setNotice(error.message);
      return;
    }
    setNotice("Saved.");
    setList({ ...list, name, color: listColor || null });
  };

  const handleInvite = async () => {
    if (!supabase || !list) {
      return;
    }
    const email = inviteEmail.trim().toLowerCase();
    if (!email) {
      setNotice("Enter an email to invite.");
      return;
    }
    setNotice("Sending invite...");
    const { data: profile } = await supabase
      .from("profiles")
      .select("id,email,full_name")
      .eq("email", email)
      .maybeSingle();
    if (!profile?.id) {
      setNotice("No user found with that email.");
      return;
    }
    const { error } = await supabase.from("list_members").insert({
      list_id: list.id,
      user_id: profile.id,
      role: inviteRole,
    });
    if (error) {
      setNotice(error.message);
      return;
    }
    setInviteEmail("");
    setMembers((prev) => [
      ...prev,
      {
        user_id: profile.id,
        email: profile.email ?? null,
        full_name: profile.full_name ?? null,
        role: inviteRole,
      },
    ]);
    setNotice("Invite added.");
  };

  const handleRemoveMember = async (userId: string) => {
    if (!supabase || !list) {
      return;
    }
    const { error } = await supabase
      .from("list_members")
      .delete()
      .eq("list_id", list.id)
      .eq("user_id", userId);
    if (error) {
      setNotice(error.message);
      return;
    }
    setMembers((prev) => prev.filter((member) => member.user_id !== userId));
    setNotice("Member removed.");
  };

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

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--muted)]">
        Loading your workspace...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-black/10 bg-white/90 p-6 text-center shadow-[var(--shadow)]">
          <h1 className="font-display text-2xl">Sign in required</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Please sign in to view this list.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--muted)]">
        Loading list...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] pb-28 text-[#1f2328]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        <header className="rounded-3xl border border-[#e7ecf4] bg-[#f7f9fc] px-5 py-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => router.push("/")}
              className="rounded-full border border-[#93c5fd] bg-[#dbeafe] px-3 py-1 text-xs font-semibold text-[#1d4ed8]"
            >
              ← Back to all lists
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-xs font-semibold text-[#1f2937]">
                {list.name}
              </span>
              <span className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-xs font-semibold text-[#6b7280]">
                {getColorLabel(list.color)} theme
              </span>
              <span className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-xs font-semibold text-[#6b7280]">
                {members.length || 1} members
              </span>
            </div>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <details className="rounded-2xl border border-[#eceff4] bg-white px-4 py-4">
            <summary className="cursor-pointer text-sm font-semibold text-[#1f2937]">
              List settings
            </summary>
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                Name
              </label>
              <input
                value={listName}
                onChange={(event) => setListName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#1f2937]"
              />
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                  Color
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setListColor(option.value)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        listColor === option.value
                          ? "border-[#1f2937] bg-white text-[#1f2937]"
                          : "border-[#eceff4] text-[#6b7280]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSaveList}
                className="mt-4 w-full rounded-2xl bg-[#1f2937] px-4 py-2 text-sm font-semibold text-white"
              >
                Save list settings
              </button>
            </div>
          </details>

          <details className="rounded-2xl border border-[#eceff4] bg-white px-4 py-4">
            <summary className="cursor-pointer text-sm font-semibold text-[#1f2937]">
              Members ({members.length || 1})
            </summary>
            <div className="mt-4 space-y-2">
              {members.length === 0 ? (
                <p className="text-xs text-[#8b8f98]">No members yet.</p>
              ) : (
                members.map((member) => (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between rounded-xl border border-[#eceff4] bg-[#f8fafc] px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[#1f2937]">
                        {member.full_name || member.email || member.user_id.slice(0, 6)}
                      </p>
                      <p className="text-[10px] text-[#8b8f98]">{member.role}</p>
                    </div>
                    {member.role !== "owner" ? (
                      <button
                        onClick={() => handleRemoveMember(member.user_id)}
                        className="rounded-full border border-[#fca5a5] px-2 py-1 text-[10px] font-semibold text-[#b91c1c]"
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="text-[10px] font-semibold text-[#6b7280]">
                        Owner
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
              <input
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="Invite by email"
                className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs"
              />
              <select
                value={inviteRole}
                onChange={(event) =>
                  setInviteRole(event.target.value as "editor" | "viewer")
                }
                className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
              <button
                onClick={handleInvite}
                className="rounded-2xl bg-[#1f2937] px-3 py-2 text-xs font-semibold text-white"
              >
                Invite
              </button>
            </div>
          </details>
        </div>

        <details className="rounded-2xl border border-[#eceff4] bg-white px-4 py-4">
          <summary className="cursor-pointer text-sm font-semibold text-[#1f2937]">
            Filters
          </summary>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
              Status
            </span>
            {["all", "open", "completed"].map((value) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value as "all" | "open" | "completed")}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  statusFilter === value
                    ? "border-[#1f2937] text-[#1f2937]"
                    : "border-[#eceff4]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
              Type
            </span>
            {["all", "text", "audio", "image", "video", "doodle"].map((value) => (
              <button
                key={value}
                onClick={() =>
                  setTypeFilter(
                    value as "all" | "text" | "audio" | "image" | "video" | "doodle"
                  )
                }
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  typeFilter === value
                    ? "border-[#1f2937] text-[#1f2937]"
                    : "border-[#eceff4]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
              Priority
            </span>
            {["all", "low", "medium", "high"].map((value) => (
              <button
                key={value}
                onClick={() =>
                  setPriorityFilter(value as "all" | "low" | "medium" | "high")
                }
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  priorityFilter === value
                    ? "border-[#1f2937] text-[#1f2937]"
                    : "border-[#eceff4]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </details>

        {notice ? (
          <p className="text-xs text-[#6b7280]">{notice}</p>
        ) : null}

        <section className="grid gap-3">
          {filteredItems.map((item) => {
            const mediaUrl = mediaUrls[item.id];
            return (
              <div
                key={item.id}
                className={`rounded-2xl border px-4 py-3 ${
                  item.type === "audio"
                    ? "border-[#fecaca] bg-[#fff1f2]"
                    : item.type === "image" || item.type === "video"
                    ? "border-[#bbf7d0] bg-[#f0fdf4]"
                    : item.type === "doodle"
                    ? "border-[#fde68a] bg-[#fffbeb]"
                    : "border-[#bfdbfe] bg-[#eff6ff]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1f2937]">
                      {item.title}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2 text-[10px] font-semibold text-[#6b7280]">
                      <span className="rounded-full border border-white/70 px-2 py-1">
                        {item.type}
                      </span>
                      <span className="rounded-full border border-white/70 px-2 py-1">
                        {item.priority}
                      </span>
                      <span className="rounded-full border border-white/70 px-2 py-1">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  {item.status === "completed" ? (
                    <span className="rounded-full border border-[#86efac] px-2 py-1 text-[10px] font-semibold text-[#166534]">
                      Done
                    </span>
                  ) : (
                    <span className="rounded-full border border-[#fcd34d] px-2 py-1 text-[10px] font-semibold text-[#92400e]">
                      Open
                    </span>
                  )}
                </div>

                {item.notes ? (
                  <p className="mt-2 text-xs text-[#4b5563]">{item.notes}</p>
                ) : null}

                {mediaUrl && item.type === "audio" ? (
                  <audio className="mt-3 w-full" controls>
                    <source src={mediaUrl} type="audio/webm" />
                  </audio>
                ) : null}

                {mediaUrl && item.type === "video" ? (
                  <video className="mt-3 h-48 w-full rounded-xl object-cover" controls>
                    <source src={mediaUrl} />
                  </video>
                ) : null}

                {mediaUrl && (item.type === "image" || item.type === "doodle") ? (
                  <img
                    src={mediaUrl}
                    alt="Task media"
                    className="mt-3 h-48 w-full rounded-xl object-cover"
                  />
                ) : null}
              </div>
            );
          })}
          {filteredItems.length === 0 ? (
            <p className="text-xs text-[#8b8f98]">
              No tasks match these filters.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
