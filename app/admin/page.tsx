"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Beat = {
  title: string;
  genre: string;
  bpm: number;
  mood: string;
  price: string;
  audio: string;
 cover: string;
};

export default function AdminPage() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    genre: "",
    bpm: "",
    mood: "",
    price: "$29",
    audio: "",
    cover: "/cover.png",
  });

  async function loadBeats() {
    setLoading(true);

    const { data, error } = await supabase
      .from("beats")
      .select("*");

    if (error) {
      alert(`Error loading beats: ${error.message}`);
      console.error(error);
    } else {
      setBeats(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBeats();
  }, []);

  async function uploadMp3(file: File) {
    setUploading(true);

    const safeFileName = file.name
      .toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll("(", "")
      .replaceAll(")", "");

    const filePath = `${Date.now()}-${safeFileName}`;

    const { error } = await supabase.storage
      .from("beats")
      .upload(filePath, file);

    if (error) {
      alert(`MP3 upload failed: ${error.message}`);
      console.error(error);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("beats")
      .getPublicUrl(filePath);

    setForm((current) => ({
      ...current,
      audio: data.publicUrl,
    }));

    setUploading(false);

    alert("MP3 uploaded successfully");
  }

  async function addBeat(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.title ||
      !form.genre ||
      !form.bpm ||
      !form.audio
    ) {
      alert("Please complete all required fields.");
      return;
    }

    const { error } = await supabase
      .from("beats")
      .insert([
        {
          title: form.title,
          genre: form.genre,
          bpm: Number(form.bpm),
          mood: form.mood,
          price: form.price,
          audio: form.audio,
          cover: form.cover,
        },
      ]);

    if (error) {
      alert(`Insert failed: ${error.message}`);
      console.error(error);
      return;
    }

    setForm({
      title: "",
      genre: "",
      bpm: "",
      mood: "",
      price: "$29",
      audio: "",
      cover: "/cover.png",
    });

    await loadBeats();

    alert("Beat added live");
  }

  async function deleteBeat(audio: string) {
    const confirmDelete = confirm("Delete this beat?");

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("beats")
      .delete()
      .eq("audio", audio);

    if (error) {
      alert(`Delete failed: ${error.message}`);
      console.error(error);
      return;
    }

    await loadBeats();

    alert("Beat deleted");
  }

  return (
    <main className="adminSite">
      <nav className="adminNav">
        <div>
          <h1>TRIFEBEATS ADMIN</h1>
          <p>Live Supabase beat manager</p>
        </div>

        <a href="/">VIEW STORE</a>
      </nav>

      <section className="adminStats">
        <div className="statCard">
          <p>Total Beats</p>
          <strong>{beats.length}</strong>
        </div>

        <div className="statCard">
          <p>Database</p>
          <strong>Live</strong>
        </div>

        <div className="statCard">
          <p>Storage</p>
          <strong>MP3</strong>
        </div>

        <div className="statCard">
          <p>Status</p>
          <strong>Active</strong>
        </div>
      </section>

      <section className="adminGrid">
        <form className="adminPanel" onSubmit={addBeat}>
          <h2>ADD NEW BEAT</h2>

          <input
            type="text"
            placeholder="Beat title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Genre"
            value={form.genre}
            onChange={(e) =>
              setForm({
                ...form,
                genre: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="BPM"
            value={form.bpm}
            onChange={(e) =>
              setForm({
                ...form,
                bpm: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Mood"
            value={form.mood}
            onChange={(e) =>
              setForm({
                ...form,
                mood: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="$29"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
          />

          <label className="uploadButton">
            {uploading
              ? "UPLOADING MP3..."
              : "CHOOSE MP3 FILE"}

            <input
              type="file"
              accept="audio/mp3,audio/mpeg"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  uploadMp3(file);
                }
              }}
            />
          </label>

          <input
            type="text"
            placeholder="Audio URL will appear here"
            value={form.audio}
            onChange={(e) =>
              setForm({
                ...form,
                audio: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="/cover.png"
            value={form.cover}
            onChange={(e) =>
              setForm({
                ...form,
                cover: e.target.value,
              })
            }
          />

          <button type="submit">
            ADD BEAT LIVE
          </button>
        </form>

        <div className="adminPanel libraryPanel">
          <div className="libraryHeader">
            <h2>BEAT LIBRARY</h2>

            <button onClick={loadBeats}>
              REFRESH
            </button>
          </div>

          {loading && (
            <p className="adminMuted">
              Loading beats...
            </p>
          )}

          {!loading && beats.length === 0 && (
            <p className="adminMuted">
              No beats found in Supabase.
            </p>
          )}

          <div className="beatList">
            {beats.map((beat) => (
              <div
                className="beatCard"
                key={beat.audio}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  marginBottom: "16px",
                  background: "#111",
                  border: "1px solid #333",
                  borderRadius: "16px",
                }}
              >
                <img
                  src={beat.cover || "/cover.png"}
                  alt={beat.title}
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: 0,
                      color: "white",
                      fontSize: "24px",
                    }}
                  >
                    {beat.title}
                  </h3>

                  <p
                    style={{
                      color: "#bbb",
                      marginTop: "6px",
                      marginBottom: "8px",
                    }}
                  >
                    {beat.genre} • {beat.bpm} BPM •{" "}
                    {beat.mood}
                  </p>

                  <span
                    style={{
                      color: "#ffd000",
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    {beat.price}
                  </span>

                  <audio
                    controls
                    style={{
                      width: "100%",
                      maxWidth: "500px",
                    }}
                  >
                    <source
                      src={beat.audio}
                      type="audio/mpeg"
                    />
                  </audio>
                </div>

                <button
                  className="deleteButton"
                  onClick={() =>
                    deleteBeat(beat.audio)
                  }
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}