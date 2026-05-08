"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Beat = {
  title: string;
  genre: string;
  bpm: number;
  mood: string;
  price: string;
  audio: string;
  cover: string;
};

const licenseOptions = [
  {
    name: "Basic Lease",
    price: "$29",
  },
  {
    name: "Premium Lease",
    price: "$79",
  },
  {
    name: "Exclusive",
    price: "$299",
  },
];

export default function HomePage() {
  const [beats, setBeats] = useState<Beat[]>([]);

  const [selectedLicenses, setSelectedLicenses] =
    useState<Record<string, string>>({});

  useEffect(() => {
    async function loadBeats() {
      const { data, error } = await supabase
        .from("beats")
        .select("*");

      if (error) {
        console.error(error);
        return;
      }

      setBeats(data || []);
    }

    loadBeats();
  }, []);

  function getLicenseForBeat(beat: Beat) {
    return (
      selectedLicenses[beat.audio] ||
      "Basic Lease"
    );
  }

  function getPriceForLicense(
    licenseName: string
  ) {
    return (
      licenseOptions.find(
        (license) =>
          license.name === licenseName
      )?.price || "$29"
    );
  }

  async function buyBeat(beat: Beat) {
    const licenseType =
      getLicenseForBeat(beat);

    const price =
      getPriceForLicense(licenseType);

    const res = await fetch(
      "/api/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
  beatTitle: beat.title,
  licenseType,
}),
});

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <main className="site">
      <nav className="nav">
        <div className="brand">
          TRIFEBEATS
        </div>

        <div className="navLinks">
          <a href="#beats">Beats</a>
          <a href="#licenses">
            Licenses
          </a>
          <a href="#contact">
            Contact
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="heroSmoke"></div>

        <div className="heroContent">
          <p className="eyebrow">
            Silence × Spontaneous
          </p>

          <h1>
            TRIFE<span>BEATS</span>
          </h1>

          <p className="tagline">
            Industry-Ready Beats. No
            Industry Price.
          </p>

          <a
            href="#beats"
            className="goldButton"
          >
            Browse Beats
          </a>
        </div>
      </section>

      <section
        id="beats"
        className="section"
      >
        <div className="sectionTop">
          <div>
            <h2>Featured Beats</h2>

            <p>
              Pick a vibe, press play,
              and start writing.
            </p>
          </div>

          <button className="outlineButton">
            View All Beats
          </button>
        </div>

        <div className="beatGrid">
          {beats.map((beat) => {
            const licenseType =
              getLicenseForBeat(beat);

            const licensePrice =
              getPriceForLicense(
                licenseType
              );

            return (
              <div
                className="beatCard"
                key={beat.audio}
              >
                <div className="coverWrap">
                  <img
                    src={
                      beat.cover ||
                      "/cover.png"
                    }
                    alt={beat.title}
                  />
                </div>

                <h3>{beat.title}</h3>

                <p className="meta">
                  {beat.genre} •{" "}
                  {beat.bpm} BPM
                </p>

                <p className="mood">
                  {beat.mood}
                </p>

                <audio controls>
                  <source
                    src={beat.audio}
                    type="audio/mpeg"
                  />
                </audio>

                <select
                  className="licenseSelect"
                  value={licenseType}
                  onChange={(e) =>
                    setSelectedLicenses({
                      ...selectedLicenses,
                      [beat.audio]:
                        e.target.value,
                    })
                  }
                >
                  {licenseOptions.map(
                    (license) => (
                      <option
                        key={license.name}
                        value={
                          license.name
                        }
                      >
                        {license.name} —{" "}
                        {
                          license.price
                        }
                      </option>
                    )
                  )}
                </select>

                <div className="cardBottom">
                  <strong>
                    {licensePrice}
                  </strong>

                  <button
                    onClick={() =>
                      buyBeat(beat)
                    }
                  >
                    Buy Lease
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="licenses"
        className="section"
      >
        <h2>License Options</h2>

        <div className="licenseGrid">
          <div className="licenseCard">
            <h3>Basic Lease</h3>

            <strong>$29</strong>

            <p>
              MP3 file,
              non-exclusive use.
            </p>
          </div>

          <div className="licenseCard">
            <h3>Premium Lease</h3>

            <strong>$79</strong>

            <p>
              MP3 + WAV delivery.
            </p>
          </div>

          <div className="licenseCard">
            <h3>Exclusive</h3>

            <strong>$299</strong>

            <p>
              Full exclusive rights.
            </p>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="contactBox"
      >
        <div>
          <h2>
            Ready to Build Your Next
            Track?
          </h2>

          <p>
            Contact TrifeBeats for
            custom beats, exclusives,
            or artist packages.
          </p>
        </div>

        <button>
          Contact TrifeBeats
        </button>
      </section>
    </main>
  );
}