import React, { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [screen, setScreen] = useState('home'); // 'home', 'session-select', 'immersion'
  const [selectedSession, setSelectedSession] = useState(null); // 'affirmations', 'meditation', 'prompts'
  const [selectedAudioMode, setSelectedAudioMode] = useState(null); // 'guided', 'self-paced' (meditation only)
  const [selectedScenery, setSelectedScenery] = useState(null); // 'fireplace', 'forest'
  const [fadeIn, setFadeIn] = useState(true);
  const [flowStep, setFlowStep] = useState(1); // 1: session select, 2: audio mode (if meditation), 3: scenery
  
  const videoRef = useRef(null);
  const ambientSoundsRef = useRef(null);
  const meditationMusicRef = useRef(null);
  const voiceRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const sceneries = [
    {
      id: 'fireplace',
      name: 'Fireplace',
      videoUrl: 'https://res.cloudinary.com/dekamm1rd/video/upload/v1775071900/FireplaceTest_r92s3l.mov?dl=1',
      ambientSoundsUrl: 'https://placeholder-audio.example.com/fireplace-crackle.mp3',
      meditationMusicUrl: 'https://placeholder-audio.example.com/meditation-music.mp3',
    },
    {
      id: 'forest',
      name: 'Forest',
      videoUrl: 'https://placeholder-videos.example.com/forest.mp4',
      ambientSoundsUrl: 'https://placeholder-audio.example.com/forest-birdsong.mp3',
      meditationMusicUrl: 'https://placeholder-audio.example.com/meditation-music.mp3',
    },
  ];

  const sessionTypes = [
    {
      id: 'affirmations',
      title: 'Building self-compassion',
      description: 'Confidence building affirmations',
      shortDesc: 'Boost your inner strength with guided affirmations',
    },
    {
      id: 'meditation',
      title: 'Regulate your nervous system',
      description: 'Guided or self-paced meditation and breath work',
      shortDesc: 'Calm your mind and body with meditation',
    },
    {
      id: 'prompts',
      title: 'Explore your inner world',
      description: 'Reflective and creative prompts for mind-wandering',
      shortDesc: 'Activate your default mode network',
    },
  ];

  // Fade transition for flow steps
  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [flowStep]);

  const handleSessionSelect = (sessionId) => {
    setSelectedSession(sessionId);
    // If meditation, go to audio mode selection; otherwise go straight to scenery
    if (sessionId === 'meditation') {
      setFlowStep(2);
    } else {
      setFlowStep(3);
    }
  };

  const handleAudioModeSelect = (mode) => {
    setSelectedAudioMode(mode);
    setFlowStep(3); // Go to scenery selection
  };

  const handleScenerySelect = (sceneryId) => {
    setSelectedScenery(sceneryId);
    setScreen('immersion');
  };

  const handleBackButton = () => {
    if (flowStep === 2) {
      // Back from audio mode to session select
      setFlowStep(1);
      setSelectedSession(null);
    } else if (flowStep === 3) {
      // Back from scenery to previous step
      if (selectedSession === 'meditation') {
        setFlowStep(2);
        setSelectedScenery(null);
      } else {
        setFlowStep(1);
        setSelectedSession(null);
        setSelectedScenery(null);
      }
    }
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
    setSelectedSession(null);
    setSelectedAudioMode(null);
    setSelectedScenery(null);
    setFlowStep(1);
  };

  useEffect(() => {
    if (screen === 'immersion' && !isPlaying) {
      const currentScenery = sceneries.find((s) => s.id === selectedScenery);
      
      if (videoRef.current) {
        videoRef.current.src = currentScenery.videoUrl;
        videoRef.current.play().catch((err) => {
          console.warn('Video playback failed:', err);
        });
      }

      if (ambientSoundsRef.current) {
        ambientSoundsRef.current.src = currentScenery.ambientSoundsUrl;
        ambientSoundsRef.current.volume = 0.4;
        ambientSoundsRef.current.play().catch((err) => {
          console.warn('Ambient sounds playback failed:', err);
        });
      }

      if (meditationMusicRef.current) {
        meditationMusicRef.current.src = currentScenery.meditationMusicUrl;
        meditationMusicRef.current.volume = 0.3;
        meditationMusicRef.current.play().catch((err) => {
          console.warn('Meditation music playback failed:', err);
        });
      }

      // Play voice only for meditation/affirmations
      if ((selectedSession === 'meditation' || selectedSession === 'affirmations') && voiceRef.current) {
        let voiceUrl;
        if (selectedSession === 'meditation') {
          voiceUrl = selectedAudioMode === 'guided'
            ? 'https://placeholder-audio.example.com/meditation-10min.mp3'
            : 'https://placeholder-audio.example.com/self-paced-meditation-10min.mp3';
        } else if (selectedSession === 'affirmations') {
          voiceUrl = 'https://placeholder-audio.example.com/affirmations-10min.mp3';
        }
        voiceRef.current.src = voiceUrl;
        voiceRef.current.volume = 0.8;
        voiceRef.current.play().catch((err) => {
          console.warn('Voice playback failed:', err);
        });
      }

      setIsPlaying(true);
    }
  }, [screen, selectedSession, selectedAudioMode, selectedScenery, isPlaying]);

  // Home Screen
  if (screen === 'home') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundImage: 'url(/Background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          color: '#e8e6f0',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <img
          src="/Transparent_Logo_Light_Text.png"
          alt="Evercalm"
          style={{
            height: '200px',
            marginBottom: '2rem',
          }}
        />

        {/* Tagline */}
        <p
          style={{
            fontSize: '1rem',
            letterSpacing: '1px',
            color: '#e8e6f0',
            marginBottom: '2rem',
            textTransform: 'uppercase',
            fontStyle: 'italic',
            textAlign: 'center',
            maxWidth: '600px',
          }}
        >
          A space to reconnect with yourself, designed by psychology
        </p>

        {/* Description Box */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '700px',
            marginBottom: '3rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: '1.6',
              color: '#e8e6f0',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Science-backed meditation and affirmations to boost self-compassion, calm your nervous system, and explore your inner world. With guided or self-paced 10-minute sessions in ambient environments bringing calm to modern life.
          </p>
        </div>

        {/* Session Selection */}
        <div
          style={{
            width: '100%',
            maxWidth: '900px',
          }}
        >

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              width: '100%',
            }}
          >
            {sessionTypes.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSessionSelect(session.id)}
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  padding: '2rem 1.5rem',
                  cursor: 'pointer',
                  color: '#e8e6f0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    margin: '0 0 0.5rem 0',
                    color: '#d4af37',
                    textAlign: 'left',
                  }}
                >
                  {session.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: '#d0d0d0',
                    margin: 0,
                    textAlign: 'left',
                  }}
                >
                  {session.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Selection Flow Screen (Session → Audio Mode → Scenery)
  if (screen === 'home' && selectedSession) {
    return null; // Handled below
  }

  // Dynamic Selection Flow (Replaces home screen after session select)
  if (screen === 'home' && selectedSession) {
    // This will be rendered as overlay, see below
  }

  // Render selection flow as modal overlay on home screen
  if (selectedSession && screen === 'home') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          color: '#e8e6f0',
          overflow: 'hidden',
        }}
      >
        {/* Back Button */}
        <button
          onClick={handleBackButton}
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: '#d4af37',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            zIndex: 100,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
          }}
        >
          ← Back
        </button>

        {/* Flow Content - Fades in/out */}
        <div
          style={{
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '700px',
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '8px',
            padding: '3rem 2rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          <h2
            style={{
              fontSize: '1.2rem',
              fontWeight: 400,
              letterSpacing: '1px',
              marginBottom: '2rem',
              color: '#d4af37',
              textTransform: 'uppercase',
            }}
          >
            What do you seek?
          </h2>
          
          {/* Step 1: Session Selected (Show confirmation) */}
          {flowStep === 1 && (
            <div style={{ textAlign: 'center' }}>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 300,
                  letterSpacing: '1px',
                  marginBottom: '1rem',
                  color: '#d4af37',
                  textTransform: 'uppercase',
                }}
              >
                {sessionTypes.find((s) => s.id === selectedSession)?.title}
              </h3>
            </div>
          )}

            {/* Step 2: Audio Mode Selection (Meditation only) */}
            {flowStep === 2 && selectedSession === 'meditation' && (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <h2
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    letterSpacing: '1px',
                    marginBottom: '2rem',
                    color: '#d4af37',
                    textTransform: 'uppercase',
                  }}
                >
                  Session type
                </h2>
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  {['guided', 'self-paced'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleAudioModeSelect(mode)}
                      style={{
                        flex: '1 1 150px',
                        padding: '1.2rem 1rem',
                        background: 'rgba(0, 0, 0, 0.5)',
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
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {mode === 'guided' ? 'Guided' : 'Self-paced'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Scenery Selection */}
            {flowStep === 3 && (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <h2
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    letterSpacing: '1px',
                    marginBottom: '2rem',
                    color: '#d4af37',
                    textTransform: 'uppercase',
                  }}
                >
                  Choose your scenery
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    width: '100%',
                    marginBottom: '2rem',
                  }}
                >
                  {sceneries.map((scenery) => (
                    <button
                      key={scenery.id}
                      onClick={() => handleScenerySelect(scenery.id)}
                      style={{
                        padding: '2rem 1.5rem',
                        background: 'rgba(0, 0, 0, 0.5)',
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
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {scenery.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
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

        <audio ref={ambientSoundsRef} loop />
        <audio ref={meditationMusicRef} loop />
        <audio ref={voiceRef} />

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
            zIndex: 100,
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
            zIndex: 100,
          }}
        >
          <p style={{ margin: 0 }}>
            {sceneries.find((s) => s.id === selectedScenery)?.name}
          </p>
          <p
            style={{
              margin: '0.3rem 0 0 0',
              fontSize: '0.8rem',
              color: '#d0d0d0',
            }}
          >
            {sessionTypes.find((s) => s.id === selectedSession)?.title}
          </p>
        </div>
      </div>
    );
  }
}
