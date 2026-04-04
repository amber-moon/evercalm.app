import React, { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [screen, setScreen] = useState('home'); // 'home', 'immersion'
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
    },
    {
      id: 'meditation',
      title: 'Regulate your nervous system',
      description: 'Guided or self-paced meditation and breath work',
    },
    {
      id: 'prompts',
      title: 'Explore your inner world',
      description: 'Reflective and creative prompts for mind-wandering',
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

  // HOME SCREEN - Only show if no session selected
  if (screen === 'home' && !selectedSession) {
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
        }}
      >
        {/* Logo */}
        <img
          src="/LogoTransparent.jpg"
          alt="Evercalm"
          style={{
            height: '360px',
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
          <p
            style={{
              fontSize: '0.9rem',
              letterSpacing: '1px',
              color: '#d4af37',
              marginBottom: '2rem',
              textTransform: 'uppercase',
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            What do you seek?
          </p>

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

  // SELECTION FLOW SCREEN - Shows after session is selected
  if (screen === 'home' && selectedSession) {
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

        {/* Main Selection Box */}
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
          {/* "What do you seek?" - Always visible */}
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

          {/* Step 1: Show selected session */}
          {flowStep === 1 && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 400,
                  letterSpacing: '1px',
                  marginBottom: '1rem',
                  color: '#e8e6f0',
                }}
              >
                {sessionTypes.find((s) => s.id === selectedSession)?.title}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#d0d0d0',
                  marginBottom: '2rem',
                }}
              >
                {sessionTypes.find((s) => s.id === selectedSession)?.description}
              </p>
            </div>
          )}

          {/* Step 2: Audio Mode Selection (Meditation only) */}
          {flowStep === 2 && selectedSession === 'meditation' && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 400,
                  letterSpacing: '1px',
                  marginBottom: '2rem',
                  color: '#e8e6f0',
                  textTransform: 'uppercase',
                }}
              >
                Session type
              </h3>
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
                      background: 'rgba(0, 0, 0, 0.4)',
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
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
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
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 400,
                  letterSpacing: '1px',
                  marginBottom: '2rem',
                  color: '#e8e6f0',
                  textTransform: 'uppercase',
                }}
              >
                Choose your scenery
              </h3>
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
                      background: 'rgba(0, 0, 0, 0.4)',
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
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {scenery.name}
                  </button>
                ))}
              </div>
              {/* Start Button */}
              <button
                onClick={() => selectedScenery ? null : alert('Please select a scenery')}
                disabled={!selectedScenery}
                style={{
                  padding: '1rem 2rem',
                  background: selectedScenery ? 'rgba(212, 175, 55, 0.3)' : 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '6px',
                  color: '#d4af37',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  letterSpacing: '1px',
                  cursor: selectedScenery ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  opacity: selectedScenery ? 1 : 0.5,
                }}
                onMouseEnter={(e) => {
                  if (selectedScenery) {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.5)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedScenery) {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                Start
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // IMMERSION SCREEN
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
              color: '#9b92b8',
            }}
          >
            {sessionTypes.find((s) => s.id === selectedSession)?.title}
          </p>
        </div>
      </div>
    );
  }
}
