"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase/client";

type List = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  created_at: string;
};

type ListMember = {
  list_id: string;
};

type Item = {
  id: string;
  list_id: string;
  type: "text" | "audio" | "image" | "video" | "doodle";
  title: string;
  notes: string | null;
  status: "open" | "completed";
  reminder_at: string | null;
  priority: "low" | "medium" | "high";
};

const listPalette: Record<string, string> = {
  Personal: "from-[#efe9ff] to-[#f7f4ff] border-[#d8cef9] text-[#5c3ec8]",
  Work: "from-[#fff1dc] to-[#fff8ed] border-[#f1d6a7] text-[#8a5b1e]",
  "To-Do": "from-[#e9fff4] to-[#f2fff9] border-[#bfead6] text-[#2a7b5d]",
  Shopping: "from-[#fff0e7] to-[#fff7f1] border-[#f1c9b1] text-[#c46a2c]",
};

const listIcon: Record<string, string> = {
  Personal: "P",
  Work: "W",
  "To-Do": "T",
  Shopping: "S",
};

export default function Home() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [lists, setLists] = useState<List[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [createListOpen, setCreateListOpen] = useState(false);
  const [createListName, setCreateListName] = useState("");
  const [createNotice, setCreateNotice] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "open" | "completed"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "text" | "audio" | "image" | "video" | "doodle"
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [taskCountSort, setTaskCountSort] = useState<
    "none" | "most" | "least"
  >("none");
  const [listOrderMode, setListOrderMode] = useState<
    "created" | "name" | "tasks_desc" | "tasks_asc" | "custom"
  >("created");
  const [customListOrder, setCustomListOrder] = useState<string[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteType, setNoteType] = useState<Item["type"]>("text");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaKind, setMediaKind] = useState<"image" | "video">("image");
  const [audioClips, setAudioClips] = useState<Blob[]>([]);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [doodleDirty, setDoodleDirty] = useState(false);
  const [doodleOpen, setDoodleOpen] = useState(false);
  const [doodlePreview, setDoodlePreview] = useState<string | null>(null);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [dueDate, setDueDate] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderChannel, setReminderChannel] = useState<
    "popup" | "email" | "sound"
  >("popup");
  const [reminderFrequency, setReminderFrequency] = useState("once");
  const [reminderTime, setReminderTime] = useState("");
  const [locationMode, setLocationMode] = useState<"address" | "gps">("address");
  const [locationValue, setLocationValue] = useState("");
  const [noteStatus, setNoteStatus] = useState("");
  const [speechActive, setSpeechActive] = useState(false);
  const [showRecordPrompt, setShowRecordPrompt] = useState(false);
  const [micPermission, setMicPermission] = useState<
    "granted" | "denied" | "prompt" | "unsupported"
  >("prompt");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const dictationStopTimeoutRef = useRef<number | null>(null);
  const dictationBaseRef = useRef<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

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
    if (!supabase || !session) {
      setLists([]);
      setItems([]);
      setActiveListId(null);
      return;
    }

    const loadLists = async () => {
      const { data: listData } = await supabase
        .from("lists")
        .select("id,name,color,icon,created_at")
        .order("created_at");

      setLists(listData ?? []);
      setActiveListId((current) => current ?? listData?.[0]?.id ?? null);

      const { data: memberData } = await supabase
        .from("list_members")
        .select("list_id");

      const counts: Record<string, number> = {};
      (memberData ?? []).forEach((member: ListMember) => {
        counts[member.list_id] = (counts[member.list_id] ?? 0) + 1;
      });
      setMemberCounts(counts);
    };

    loadLists();
  }, [session, supabase]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const draft = window.localStorage.getItem("taskDraft");
    if (!draft) {
      return;
    }
    try {
      const parsed = JSON.parse(draft) as {
        noteTitle?: string;
        noteBody?: string;
        noteType?: Item["type"];
        priority?: "low" | "medium" | "high";
        dueDate?: string;
        reminderEnabled?: boolean;
        reminderChannel?: "popup" | "email" | "sound";
        reminderFrequency?: string;
        reminderTime?: string;
        locationMode?: "address" | "gps";
        locationValue?: string;
      };
      if (parsed.noteTitle) setNoteTitle(parsed.noteTitle);
      if (parsed.noteBody) setNoteBody(parsed.noteBody);
      if (parsed.noteType) setNoteType(parsed.noteType);
      if (parsed.priority) setPriority(parsed.priority);
      if (parsed.dueDate) setDueDate(parsed.dueDate);
      if (typeof parsed.reminderEnabled === "boolean")
        setReminderEnabled(parsed.reminderEnabled);
      if (parsed.reminderChannel) setReminderChannel(parsed.reminderChannel);
      if (parsed.reminderFrequency) setReminderFrequency(parsed.reminderFrequency);
      if (parsed.reminderTime) setReminderTime(parsed.reminderTime);
      if (parsed.locationMode) setLocationMode(parsed.locationMode);
      if (parsed.locationValue) setLocationValue(parsed.locationValue);
    } catch {
      // Ignore invalid draft.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const payload = {
      noteTitle,
      noteBody,
      noteType,
      priority,
      dueDate,
      reminderEnabled,
      reminderChannel,
      reminderFrequency,
      reminderTime,
      locationMode,
      locationValue,
    };
    window.localStorage.setItem("taskDraft", JSON.stringify(payload));
  }, [
    noteTitle,
    noteBody,
    noteType,
    priority,
    dueDate,
    reminderEnabled,
    reminderChannel,
    reminderFrequency,
    reminderTime,
    locationMode,
    locationValue,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem("listOrder");
    if (stored) {
      try {
        setCustomListOrder(JSON.parse(stored));
      } catch {
        setCustomListOrder([]);
      }
    }
  }, []);

  useEffect(() => {
    if (lists.length === 0) {
      return;
    }
    setCustomListOrder((prev) => {
      const existing = prev.filter((id) => lists.some((list) => list.id === id));
      const missing = lists
        .map((list) => list.id)
        .filter((id) => !existing.includes(id));
      return [...existing, ...missing];
    });
  }, [lists]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem("listOrder", JSON.stringify(customListOrder));
  }, [customListOrder]);

  useEffect(() => {
    if (!supabase || !session) {
      setItems([]);
      return;
    }

    const loadItems = async () => {
      const { data } = await supabase
        .from("items")
        .select("id,list_id,type,title,notes,status,reminder_at,priority")
        .order("created_at");

      setItems(data ?? []);
    };

    loadItems();
  }, [session, supabase]);

  useEffect(() => {
    if (!supabase || !session) {
      return;
    }

    const channel = supabase
      .channel("lists-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lists" },
        () => {
          supabase
            .from("lists")
            .select("id,name,color,icon,created_at")
            .order("created_at")
            .then(({ data }) => {
              setLists(data ?? []);
              setActiveListId((current) => current ?? data?.[0]?.id ?? null);
            });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "list_members" },
        () => {
          supabase
            .from("list_members")
            .select("list_id")
            .then(({ data }) => {
              const counts: Record<string, number> = {};
              (data ?? []).forEach((member: ListMember) => {
                counts[member.list_id] = (counts[member.list_id] ?? 0) + 1;
              });
              setMemberCounts(counts);
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, supabase]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicPermission("unsupported");
      return;
    }

    if (!navigator.permissions?.query) {
      return;
    }

    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((status) => {
        setMicPermission(status.state);
        status.onchange = () => setMicPermission(status.state);
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    if (noteType !== "doodle") {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.lineCap = "round";
        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 3;
        if (doodlePreview) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.drawImage(img, 0, 0, rect.width, rect.height);
          };
          img.src = doodlePreview;
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [noteType, doodlePreview]);

  useEffect(() => {
    if (!supabase || !session) {
      return;
    }

    const channel = supabase
      .channel("items-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => {
          supabase
            .from("items")
            .select("id,list_id,type,title,notes,status,reminder_at,priority")
            .order("created_at")
            .then(({ data }) => setItems(data ?? []));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, supabase]);

  const handlePasswordSignIn = async () => {
    if (!supabase) {
      return;
    }

    if (!email || !password) {
      setStatusMessage("Enter your email and password.");
      return;
    }

    setStatusMessage("Signing in...");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatusMessage(error.message);
      return;
    }

    setStatusMessage("");
  };

  const handlePasswordSignUp = async () => {
    if (!supabase) {
      return;
    }

    if (!email || !password) {
      setStatusMessage("Enter your email and password.");
      return;
    }

    setStatusMessage("Creating account...");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });

    if (error) {
      setStatusMessage(error.message);
      return;
    }

    setStatusMessage(
      "Account created. Check your email to confirm if required."
    );
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  };

  const handleCreateAction = (
    action: "task" | "day" | "reminder" | "list"
  ) => {
    if (action === "list") {
      setCreateMenuOpen(false);
      setCreateListOpen(true);
      setCreateNotice("");
      return;
    }

    setCreateMenuOpen(false);
    setCreateNotice("Creation flow coming next. Tell me which to build first.");
  };

  const handleCreateList = async () => {
    if (!supabase || !session) {
      return;
    }

    const name = createListName.trim();
    if (!name) {
      setCreateNotice("Enter a list name.");
      return;
    }

    setCreateNotice("Creating list...");
    const { data, error } = await supabase
      .from("lists")
      .insert({
        owner_id: session.user.id,
        name,
        color: null,
        icon: null,
      })
      .select("id,name,color,icon,created_at")
      .single();

    if (error) {
      setCreateNotice(error.message);
      return;
    }

    if (data) {
      setLists((prev) => [...prev, data]);
      setActiveListId(data.id);
    }

    setCreateListName("");
    setCreateListOpen(false);
    setCreateNotice("List created.");
  };

  const focusTitleInput = () => {
    const input = titleInputRef.current;
    if (!input) {
      return;
    }
    input.focus();
    const length = input.value.length;
    if (input.setSelectionRange) {
      input.setSelectionRange(length, length);
    }
  };

  const handleStartDictation = () => {
    if (typeof window === "undefined") {
      return;
    }

    if (recognitionRef.current) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setNoteStatus("Speech recognition is not supported in this browser.");
      return;
    }

    focusTitleInput();
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      dictationBaseRef.current = noteTitle.trim();
      setSpeechActive(true);
    };
    recognition.onend = () => {
      setSpeechActive(false);
      recognitionRef.current = null;
    };
    recognition.onerror = () => {
      setSpeechActive(false);
      recognitionRef.current = null;
      setNoteStatus("Could not capture speech. Try again.");
    };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const finals: string[] = [];
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result?.isFinal) {
          const transcript = result?.[0]?.transcript ?? "";
          if (transcript) {
            finals.push(transcript);
          }
        }
      }
      if (finals.length === 0) {
        return;
      }
      const base = dictationBaseRef.current;
      const combined = finals.join(" ").trim();
      const next = base ? `${base} ${combined}` : combined;
      setNoteTitle(next);
      dictationBaseRef.current = next;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleStopDictation = () => {
    if (dictationStopTimeoutRef.current) {
      window.clearTimeout(dictationStopTimeoutRef.current);
    }
    dictationStopTimeoutRef.current = window.setTimeout(() => {
      recognitionRef.current?.stop();
    }, 250);
  };

  const startVoiceRecording = async () => {
    if (voiceRecording) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(mediaChunksRef.current, { type: "audio/webm" });
        setAudioClips((prev) => [...prev, blob]);
        stream.getTracks().forEach((track) => track.stop());
        setVoiceRecording(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setVoiceRecording(true);
    } catch (error) {
      setNoteStatus("Microphone access was denied.");
    }
  };

  const handleVoiceRecordStart = () => {
    if (audioClips.length > 0 && !voiceRecording) {
      setShowRecordPrompt(true);
      return;
    }
    startVoiceRecording();
  };

  const handleVoiceRecordStop = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleRecordChoice = (action: "add" | "replace") => {
    setShowRecordPrompt(false);
    if (action === "replace") {
      setAudioClips([]);
    }
    startVoiceRecording();
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setMediaFile(file);
    if (file?.type.startsWith("video")) {
      setMediaKind("video");
    } else if (file?.type.startsWith("image")) {
      setMediaKind("image");
    }
  };

  const handleClearDoodle = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDoodleDirty(false);
    setDoodlePreview(null);
  };

  const handleSaveDoodle = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setDoodleOpen(false);
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");
    setDoodlePreview(dataUrl);
    setDoodleDirty(true);
    setDoodleOpen(false);
  };

  const handleDoodlePointer = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    if (event.type === "pointerdown") {
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#1f2937";
      ctx.beginPath();
      ctx.moveTo(x, y);
      setDoodleDirty(true);
    } else if (event.type === "pointermove" && event.buttons === 1) {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (event.type === "pointerup") {
      ctx.closePath();
    }
  };
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setNoteStatus("Geolocation is not available.");
      return;
    }

    setLocationMode("gps");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        setLocationValue(coords);
      },
      () => setNoteStatus("Unable to get location.")
    );
  };

  const handleCreateNote = async () => {
    if (!supabase || !session) {
      setNoteStatus("Sign in to create a task.");
      return;
    }

    if (!activeListId) {
      setNoteStatus("Create or select a list first.");
      return;
    }

    if (!noteTitle.trim()) {
      setNoteStatus("Add a title to continue.");
      return;
    }

    if (noteType === "audio" && audioClips.length === 0) {
      setNoteStatus("Record a voice memo first.");
      return;
    }

    if (noteType === "image" && !mediaFile) {
      setNoteStatus("Upload a photo or video.");
      return;
    }

    if (noteType === "doodle" && !doodleDirty) {
      setNoteStatus("Add a doodle first.");
      return;
    }

    const reminderAt =
      reminderEnabled && dueDate && reminderTime
        ? new Date(`${dueDate}T${reminderTime}`).toISOString()
        : null;

    const uploadMedia = async (
      file: Blob,
      extension: string
    ): Promise<string | null> => {
      if (!supabase || !session) {
        return null;
      }
      const fileName = `${session.user.id}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage
        .from("media")
        .upload(fileName, file, { upsert: true });
      if (error) {
        setNoteStatus(error.message);
        return null;
      }
      return fileName;
    };

    let finalType: Item["type"] = noteType;
    const mediaEntries: { media_type: string; media_path: string }[] = [];

    if (noteType === "audio" && audioClips.length > 0) {
      for (const clip of audioClips) {
        const path = await uploadMedia(clip, "webm");
        if (path) {
          mediaEntries.push({ media_type: "audio", media_path: path });
        }
      }
    }

    if (noteType === "image" && mediaFile) {
      finalType = mediaKind;
      const extension = mediaFile.name.split(".").pop() || "bin";
      const path = await uploadMedia(mediaFile, extension);
      if (path) {
        mediaEntries.push({ media_type: mediaKind, media_path: path });
      }
    }

    if (noteType === "doodle" && (canvasRef.current || doodlePreview)) {
      const dataUrl = canvasRef.current
        ? canvasRef.current.toDataURL("image/png")
        : doodlePreview;
      if (dataUrl) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const path = await uploadMedia(blob, "png");
        if (path) {
          mediaEntries.push({ media_type: "doodle", media_path: path });
        }
      }
    }

    setNoteStatus("Saving...");
    const { data, error } = await supabase
      .from("items")
      .insert({
        list_id: activeListId,
        created_by: session.user.id,
        type: finalType,
        title: noteTitle.trim(),
        notes: noteBody.trim() || null,
        status: "open",
        reminder_at: reminderAt,
        recurrence_rule: reminderEnabled ? reminderFrequency : null,
        priority,
        due_date: dueDate || null,
        reminder_channel: reminderEnabled ? reminderChannel : null,
        reminder_time: reminderTime || null,
        location_label: locationMode === "address" ? locationValue : null,
        location_coords: locationMode === "gps" ? locationValue : null,
        media_url: mediaEntries[0]?.media_path ?? null,
      })
      .select("id")
      .single();

    if (error) {
      setNoteStatus(error.message);
      return;
    }

    if (data?.id && mediaEntries.length > 0) {
      const { error: mediaError } = await supabase.from("item_media").insert(
        mediaEntries.map((entry) => ({
          item_id: data.id,
          created_by: session.user.id,
          media_type: entry.media_type,
          media_path: entry.media_path,
        }))
      );
      if (mediaError) {
        setNoteStatus(mediaError.message);
        return;
      }
    }

    setNoteTitle("");
    setNoteBody("");
    setPriority("low");
    setDueDate("");
    setReminderEnabled(false);
    setReminderChannel("popup");
    setReminderFrequency("once");
    setReminderTime("");
    setLocationMode("address");
    setLocationValue("");
    setMediaFile(null);
    setAudioClips([]);
    setVoiceRecording(false);
    setDoodleDirty(false);
    setDoodlePreview(null);
    setNoteStatus("Task created.");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("taskDraft");
    }
  };


  const completedCount = items.filter((item) => item.status === "completed")
    .length;
  const pendingCount = items.filter((item) => item.status === "open").length;
  const greetingInitial =
    session?.user?.email?.trim().charAt(0).toUpperCase() ?? "E";

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

  const filteredLists = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return lists;
    }
    return lists.filter((list) => list.name.toLowerCase().includes(query));
  }, [lists, searchQuery]);

  const listStats = useMemo(() => {
    const stats = filteredLists.map((list) => {
      const listItems = filteredItems.filter((item) => item.list_id === list.id);
      const total = listItems.length;
      const completed = listItems.filter(
        (item) => item.status === "completed"
      ).length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { list, total, completed, percent };
    });
    const nextStats = [...stats];
    if (taskCountSort === "most") {
      nextStats.sort((a, b) => b.total - a.total);
    } else if (taskCountSort === "least") {
      nextStats.sort((a, b) => a.total - b.total);
    }

    if (listOrderMode === "name") {
      nextStats.sort((a, b) => a.list.name.localeCompare(b.list.name));
    } else if (listOrderMode === "tasks_desc") {
      nextStats.sort((a, b) => b.total - a.total);
    } else if (listOrderMode === "tasks_asc") {
      nextStats.sort((a, b) => a.total - b.total);
    } else if (listOrderMode === "custom" && customListOrder.length > 0) {
      nextStats.sort(
        (a, b) =>
          customListOrder.indexOf(a.list.id) -
          customListOrder.indexOf(b.list.id)
      );
    } else {
      nextStats.sort(
        (a, b) =>
          new Date(a.list.created_at).getTime() -
          new Date(b.list.created_at).getTime()
      );
    }

    return nextStats;
  }, [
    customListOrder,
    filteredItems,
    filteredLists,
    listOrderMode,
    taskCountSort,
  ]);

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
        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white/90 p-6 shadow-[var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.38em] text-[var(--muted)]">
            AddOne
          </p>
          <h1 className="mt-2 font-display text-3xl">
            Sign in with email &amp; password
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Use your email and a password. You can also create a new account.
          </p>
          <div className="mt-6 space-y-3">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
            <button
              onClick={handlePasswordSignIn}
              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
            >
              Sign in
            </button>
            <button
              onClick={handlePasswordSignUp}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#1f2937]"
            >
              Create account
            </button>
            {statusMessage ? (
              <p className="text-xs text-[var(--muted)]">{statusMessage}</p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] pb-28 text-[#1f2328]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        {createNotice ? (
          <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#1f2937] shadow-sm">
            {createNotice}
          </div>
        ) : null}
        <header className="flex flex-col gap-6 rounded-3xl bg-white px-6 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                Hi, {greetingInitial}
              </h1>
              <p className="text-sm text-[#8b8f98]">
                Let&apos;s make today productive
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCreateMenuOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-[#1f2937] px-4 py-2 text-sm font-semibold text-white shadow-sm"
              >
                <span className="text-lg leading-none">+</span>
                Create
              </button>
              <button
                onClick={handleSignOut}
                className="rounded-xl border border-[#eceff4] px-3 py-2 text-xs font-semibold text-[#667085]"
              >
                Sign out
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center justify-between rounded-2xl border border-[#c9f0dc] bg-gradient-to-br from-[#ddf8ea] to-[#f1fffb] px-4 py-3">
              <div>
                <p className="text-xl font-semibold">{completedCount}</p>
                <p className="text-xs text-[#3e7b65]">Completed</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9f0dc] text-[#1f6b55]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l4 4 10-10" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-[#f8dba8] bg-gradient-to-br from-[#fff0c7] to-[#fff7e4] px-4 py-3">
              <div>
                <p className="text-xl font-semibold">{pendingCount}</p>
                <p className="text-xs text-[#a36a1a]">Pending</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8dba8] text-[#9a5a10]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 8v4l3 2" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-[#d8d1f8] bg-gradient-to-br from-[#efe9ff] to-[#f7f4ff] px-4 py-3">
              <div>
                <p className="text-xl font-semibold">{lists.length}</p>
                <p className="text-xs text-[#6a50c7]">Lists</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3dcff] text-[#6a50c7]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 4l2.2 5.2L20 12l-5.8 2.8L12 20l-2.2-5.2L4 12l5.8-2.8L12 4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-[#eceff4] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#eceff4] bg-[#f8f9fb] px-3 py-2 text-sm text-[#8b8f98]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search your lists..."
                className="flex-1 bg-transparent text-sm text-[#1f2937] outline-none placeholder:text-[#8b8f98]"
              />
            </div>
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#eceff4] px-4 py-2 text-sm font-semibold text-[#3b3f46]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16" />
                <path d="M7 6v6" />
                <path d="M4 12h16" />
                <path d="M17 12v6" />
                <path d="M4 18h16" />
              </svg>
              Filters
            </button>
          </div>
          {showFilters ? (
            <div className="rounded-2xl border border-[#eceff4] bg-white px-4 py-4 text-xs text-[#6b7280]">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                    Status
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["all", "open", "completed"].map((value) => (
                      <button
                        key={value}
                        onClick={() =>
                          setStatusFilter(value as "all" | "open" | "completed")
                        }
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
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                    Type
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["all", "text", "audio", "image", "video", "doodle"].map(
                      (value) => (
                        <button
                          key={value}
                          onClick={() =>
                            setTypeFilter(
                              value as
                                | "all"
                                | "text"
                                | "audio"
                                | "image"
                                | "video"
                                | "doodle"
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
                      )
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                    Priority
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["all", "low", "medium", "high"].map((value) => (
                      <button
                        key={value}
                        onClick={() =>
                          setPriorityFilter(
                            value as "all" | "low" | "medium" | "high"
                          )
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
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                    Task count
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      { label: "none", value: "none" },
                      { label: "most", value: "most" },
                      { label: "least", value: "least" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setTaskCountSort(option.value as "none" | "most" | "least")
                        }
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          taskCountSort === option.value
                            ? "border-[#1f2937] text-[#1f2937]"
                            : "border-[#eceff4]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9aa0aa]">
                    Order lists
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      { label: "created", value: "created" },
                      { label: "name", value: "name" },
                      { label: "most tasks", value: "tasks_desc" },
                      { label: "least tasks", value: "tasks_asc" },
                      { label: "custom", value: "custom" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setListOrderMode(
                            option.value as
                              | "created"
                              | "name"
                              | "tasks_desc"
                              | "tasks_asc"
                              | "custom"
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          listOrderMode === option.value
                            ? "border-[#1f2937] text-[#1f2937]"
                            : "border-[#eceff4]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {listOrderMode === "custom" ? (
                    <p className="mt-2 text-xs text-[#8b8f98]">
                      Drag list cards to reorder.
                    </p>
                  ) : null}
                </div>
              </div>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setPriorityFilter("all");
                  setTaskCountSort("none");
                  setListOrderMode("created");
                }}
                className="mt-4 text-xs font-semibold text-[#1f2937] underline"
              >
                Reset filters
              </button>
            </div>
          ) : null}
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          {listStats.length === 0 ? (
            <div className="rounded-2xl border border-[#eceff4] bg-white px-4 py-6 text-center text-sm text-[#8b8f98]">
              No lists yet. Create your first list.
            </div>
          ) : (
            listStats.map(({ list, total, percent }) => {
              const palette =
                list.color ?? listPalette[list.name] ?? "from-white to-white";
              const icon = list.icon ?? listIcon[list.name] ?? list.name.slice(0, 1);
              const members = memberCounts[list.id] ?? 1;
              return (
                <button
                  key={list.id}
                  onClick={() => setActiveListId(list.id)}
                  draggable={listOrderMode === "custom"}
                  onDragStart={(event) => {
                    if (listOrderMode !== "custom") return;
                    event.dataTransfer.setData("text/plain", list.id);
                  }}
                  onDragOver={(event) => {
                    if (listOrderMode !== "custom") return;
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    if (listOrderMode !== "custom") return;
                    event.preventDefault();
                    const draggedId = event.dataTransfer.getData("text/plain");
                    if (!draggedId || draggedId === list.id) return;
                    setCustomListOrder((prev) => {
                      const next = prev.length > 0 ? [...prev] : listStats.map((s) => s.list.id);
                      const fromIndex = next.indexOf(draggedId);
                      const toIndex = next.indexOf(list.id);
                      if (fromIndex === -1 || toIndex === -1) return prev;
                      next.splice(fromIndex, 1);
                      next.splice(toIndex, 0, draggedId);
                      return next;
                    });
                  }}
                  className={`flex flex-col gap-4 rounded-2xl border bg-gradient-to-br px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 ${palette} ${
                    activeListId === list.id ? "ring-2 ring-[#1f2937]/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 text-sm font-semibold">
                      {icon}
                    </div>
                    <span className="rounded-full bg-white/60 px-2 py-1 text-xs font-semibold text-[#6b7280]">
                      {members} people
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-semibold">{list.name}</p>
                    <p className="text-xs text-[#8b8f98]">{total} tasks</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#8b8f98]">
                    <div className="h-2 flex-1 rounded-full bg-white/70">
                      <div
                        className="h-2 rounded-full bg-[#6a50c7]/50"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span>{percent}%</span>
                  </div>
                </button>
              );
            })
          )}
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-[#eceff4] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-around px-6 py-3 text-xs text-[#8b8f98]">
          {[
            {
              label: "Lists",
              active: true,
              icon: (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 6h12" />
                  <path d="M8 12h12" />
                  <path d="M8 18h12" />
                  <path d="M4 6h.01" />
                  <path d="M4 12h.01" />
                  <path d="M4 18h.01" />
                </svg>
              ),
            },
            {
              label: "My Day",
              icon: (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="3" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M3 10h18" />
                </svg>
              ),
            },
            {
              label: "Reminders",
              icon: (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14V11a6 6 0 1 0-12 0v3a2 2 0 0 1-.6 1.4L4 17h11" />
                  <path d="M9 20h6" />
                </svg>
              ),
            },
            {
              label: "Settings",
              icon: (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
                </svg>
              ),
            },
          ].map((tab) => (
            <button
              key={tab.label}
              className={`flex flex-col items-center gap-1 ${
                tab.active ? "text-[#1f2937]" : ""
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {showRecordPrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[#1f2937]">
              Recording already saved
            </h3>
            <p className="mt-2 text-sm text-[#6b7280]">
              Do you want to keep the existing recording and add a new one, or
              replace it?
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => handleRecordChoice("add")}
                className="flex-1 rounded-xl bg-[#1f2937] px-4 py-2 text-sm font-semibold text-white"
              >
                Add New
              </button>
              <button
                onClick={() => handleRecordChoice("replace")}
                className="flex-1 rounded-xl border border-[#eceff4] px-4 py-2 text-sm font-semibold text-[#6b7280]"
              >
                Replace Existing
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {createMenuOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[var(--shadow)]">
            <h2 className="text-lg font-semibold">Create</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              What would you like to add?
            </p>
            <div className="mt-4 grid gap-3">
              <button
                onClick={() => handleCreateAction("task")}
                className="rounded-2xl border border-black/10 px-4 py-3 text-left text-sm font-semibold"
              >
                Create task
              </button>
              <button
                onClick={() => handleCreateAction("day")}
                className="rounded-2xl border border-black/10 px-4 py-3 text-left text-sm font-semibold"
              >
                Create day
              </button>
              <button
                onClick={() => handleCreateAction("reminder")}
                className="rounded-2xl border border-black/10 px-4 py-3 text-left text-sm font-semibold"
              >
                Create reminder
              </button>
              <button
                onClick={() => handleCreateAction("list")}
                className="rounded-2xl border border-black/10 px-4 py-3 text-left text-sm font-semibold"
              >
                Create list
              </button>
            </div>
            <button
              onClick={() => setCreateMenuOpen(false)}
              className="mt-4 w-full rounded-2xl bg-[#f3f4f6] px-4 py-2 text-sm font-semibold text-[#1f2937]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {createListOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[var(--shadow)]">
            <h2 className="text-lg font-semibold">New list</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Give your list a name.
            </p>
            <input
              value={createListName}
              onChange={(event) => setCreateListName(event.target.value)}
              placeholder="List name"
              className="mt-4 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setCreateListOpen(false)}
                className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                className="rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
              >
                Create list
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {doodleOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-[#eceff4] px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Doodle pad</p>
              <p className="text-xs text-[#8b8f98]">
                Draw with your finger or mouse.
              </p>
            </div>
            <button
              onClick={() => setDoodleOpen(false)}
              className="rounded-xl border border-[#eceff4] px-3 py-1 text-xs font-semibold text-[#6b7280]"
            >
              Close
            </button>
          </div>
          <div className="flex-1 bg-[#f8f9fb]">
            <canvas
              ref={canvasRef}
              className="h-full w-full touch-none"
              onPointerDown={handleDoodlePointer}
              onPointerMove={handleDoodlePointer}
              onPointerUp={handleDoodlePointer}
              onPointerLeave={handleDoodlePointer}
            />
          </div>
          <div className="flex items-center justify-between border-t border-[#eceff4] px-4 py-3">
            <button
              onClick={handleClearDoodle}
              className="rounded-xl border border-[#eceff4] px-4 py-2 text-sm font-semibold text-[#6b7280]"
            >
              Clear
            </button>
            <button
              onClick={handleSaveDoodle}
              className="rounded-xl bg-[#1f2937] px-4 py-2 text-sm font-semibold text-white"
            >
              Save &amp; Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
