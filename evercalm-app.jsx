import React, { useState, useRef, useEffect } from 'react';

export default function Evercalm() {
  const [screen, setScreen] = useState('home'); // 'home', 'audio-select', 'immersion'
  const [selectedScenery, setSelectedScenery] = useState(null); // 'fireplace', 'forest'
  const [selectedAudio, setSelectedAudio] = useState(null); // 'meditation', 'ambient', 'affirmations'
  const videoRef = useRef(null);
  const ambientSoundsRef = useRef(null); // Free ambient sounds (waves, crackle, birdsong)
  const meditationMusicRef = useRef(null); // Meditation music layer (plays in all modes)
  const voiceRef = useRef(null); // Your guided meditation or affirmations voice (guided modes only)
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeIn, setFadeIn] = useState(true); // Control fade in/out

  // Fade transition when screen changes
  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [screen]);

  const sceneries = [
    {
      id: 'fireplace',
      name: 'Fireplace',
      videoUrl: 'https://res.cloudinary.com/dekamm1rd/video/upload/v1775071900/FireplaceTest_r92s3l.mov',
      // ambientSoundsUrl: 'https://placeholder-audio.example.com/fireplace-crackle.mp3',
      //meditationMusicUrl: 'https://placeholder-audio.example.com/meditation-music.mp3',
    },
    {
      id: 'forest',
      name: 'Forest',
      // videoUrl: 'https://placeholder-videos.example.com/forest.mp4',
      // ambientSoundsUrl: 'https://placeholder-audio.example.com/forest-birdsong.mp3',
      // meditationMusicUrl: 'https://placeholder-audio.example.com/meditation-music.mp3',
    },
  ];

  const audioModes = [
    { id: 'meditation', label: 'Guided Meditation' },
    { id: 'ambient', label: 'Ambient Only' },
    { id: 'affirmations', label: 'Affirmations' },
  ];

  const handleScenerySelect = (sceneryId) => {
    setSelectedScenery(sceneryId);
    setScreen('audio-select');
  };

  const handleAudioSelect = (audioId) => {
    setSelectedAudio(audioId);
    setScreen('immersion');
  };

  const handleExit = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (ambientSoundsRef.current) {
      ambientSoundsRef.current.pause();
      ambientSoundsRef.current.currentTime = 0;
    }
    if (meditationMusicRef.current) {
      meditationMusicRef.current.pause();
      meditationMusicRef.current.currentTime = 0;
    }
    if (voiceRef.current) {
      voiceRef.current.pause();
      voiceRef.current.currentTime = 0;
    }
    setScreen('home');
    setSelectedScenery(null);
    setSelectedAudio(null);
  };

  useEffect(() => {
    if (screen === 'immersion' && !isPlaying) {
      const currentScenery = sceneries.find((s) => s.id === selectedScenery);
      
      // Play video
      if (videoRef.current) {
        videoRef.current.src = currentScenery.videoUrl;
        videoRef.current.play().catch((err) => {
          console.warn('Video playback failed:', err);
        });
      }

      // Play ambient sounds (free ambient sounds from your recordings)
      if (ambientSoundsRef.current) {
        ambientSoundsRef.current.src = currentScenery.ambientSoundsUrl;
        ambientSoundsRef.current.volume = 0.4; // Slightly lowered to make room for other layers
        ambientSoundsRef.current.play().catch((err) => {
          console.warn('Ambient sounds playback failed:', err);
        });
      }

      // Play meditation music (plays in all modes)
      if (meditationMusicRef.current) {
        meditationMusicRef.current.src = currentScenery.meditationMusicUrl;
        meditationMusicRef.current.volume = 0.3; // Subtle background layer
        meditationMusicRef.current.play().catch((err) => {
          console.warn('Meditation music playback failed:', err);
        });
      }

      // Play voice (meditation or affirmations) only if not in ambient-only mode
      if (selectedAudio !== 'ambient' && voiceRef.current) {
        const voiceUrl =
          selectedAudio === 'meditation'
            ? 'https://placeholder-audio.example.com/meditation-10min.mp3'
            : 'https://placeholder-audio.example.com/affirmations-10min.mp3';
        voiceRef.current.src = voiceUrl;
        voiceRef.current.volume = 0.8; // Voice is prominent but not overpowering
        voiceRef.current.play().catch((err) => {
          console.warn('Voice playback failed:', err);
        });
      }

      setIsPlaying(true);
    }
  }, [screen, selectedScenery, selectedAudio, isPlaying]);

  // Home Screen
  if (screen === 'home') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #2a1f3d 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem 1rem',
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          color: '#e8e6f0',
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '3rem', marginTop: '1rem', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 300,
              letterSpacing: '2px',
              margin: 0,
              color: '#d4af37',
              textTransform: 'uppercase',
            }}
          >
            Evercalm
          </h1>
          <p
            style={{
              fontSize: '0.85rem',
              letterSpacing: '1px',
              color: '#9b92b8',
              marginTop: '0.5rem',
              textTransform: 'uppercase',
            }}
          >
            Find your sanctuary
          </p>
        </div>

        {/* Scenery Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            maxWidth: '900px',
            width: '100%',
          }}
        >
          {sceneries.map((scenery) => (
            <button
              key={scenery.id}
              onClick={() => handleScenerySelect(scenery.id)}
              style={{
                padding: '2rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#e8e6f0',
                fontSize: '1rem',
                fontWeight: 400,
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                e.currentTarget.style.boxShadow =
                  '0 0 20px rgba(212, 175, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {scenery.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Audio Selection Screen
  if (screen === 'audio-select') {
    const sceneryName = sceneries.find((s) => s.id === selectedScenery)?.name;
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #2a1f3d 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          color: '#e8e6f0',
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => {
            setScreen('home');
            setSelectedScenery(null);
          }}
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: '#d4af37',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
            e.currentTarget.style.boxShadow =
              '0 0 15px rgba(212, 175, 55, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ← Back
        </button>

        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            color: '#d4af37',
            textTransform: 'uppercase',
          }}
        >
          {sceneryName}
        </h2>
        <p
          style={{
            fontSize: '0.9rem',
            color: '#9b92b8',
            marginBottom: '3rem',
            letterSpacing: '0.5px',
          }}
        >
          Choose your audio experience
        </p>

        {/* Audio Mode Buttons - Horizontal Flat Layout */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          {audioModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleAudioSelect(mode.id)}
              style={{
                flex: '1 1 150px',
                padding: '1.2rem 1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '6px',
                color: '#e8e6f0',
                fontSize: '0.9rem',
                fontWeight: 400,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                e.currentTarget.style.boxShadow =
                  '0 0 20px rgba(212, 175, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Immersion Screen
  if (screen === 'immersion') {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
          loop
          autoPlay
          muted
        />

        {/* Audio Elements */}
        <audio ref={ambientSoundsRef} loop />
        <audio ref={meditationMusicRef} loop />
        <audio ref={voiceRef} />

        {/* Exit Button */}
        <button
          onClick={handleExit}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 500,
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
        >
          Exit
        </button>

        {/* Scenic Info Badge */}
        <div
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            background: 'rgba(0, 0, 0, 0.4)',
            color: '#d4af37',
            padding: '1rem 1.5rem',
            borderRadius: '4px',
            fontSize: '0.9rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <p style={{ margin: 0 }}>
            {sceneries.find((s) => s.id === selectedScenery)?.name}
          </p>
          <p
            style={{
              margin: '0.3rem 0 0 0',
              fontSize: '0.8rem',
              color: '#9b92b8',
            }}
          >
            {audioModes.find((a) => a.id === selectedAudio)?.label}
          </p>
        </div>
      </div>
    );
  }
}
