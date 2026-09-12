// src/components/modals/KrishiWorldVideoModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../../styles/KrishiWorldVideoModal.css';

const KrishiWorldVideoModal = ({ isOpen, onClose, onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsFadingOut(false);
      
      // Attempt fullscreen (browsers may block this without user gesture, but we try)
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(() => {});
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen().catch(() => {});
        }
      } catch (err) {
        console.log("Fullscreen request error:", err);
      }

      // Autoplay logic
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        // Setting muted first increases chances of autoplay working on load
        videoRef.current.muted = true;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log("Autoplay error:", err);
          });
        }
      }
    }
  }, [isOpen]);

  // Handle ESC key as a hidden safeguard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleFinish = () => {
    setIsFadingOut(true);
    // Exit fullscreen if active
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (err) {
      console.log("Exit fullscreen error:", err);
    }

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (onComplete) onComplete();
      if (onClose) onClose();
      setIsFadingOut(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className={`krishi-cinematic-overlay ${isFadingOut ? 'fade-out-exit' : ''}`}>
      <div className="krishi-3d-cinema-viewport">
        <video
          ref={videoRef}
          className="krishi-3d-fullscreen-video"
          autoPlay
          muted
          playsInline
          onEnded={handleFinish}
        >
          <source src="/ui_ux_vid.mp4" type="video/mp4" />
          <source src="/ui_ux_vid.m4v" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <button className="krishi-skip-video-btn" onClick={handleFinish}>
          Skip Video
        </button>
      </div>
    </div>
  );
};

export default KrishiWorldVideoModal;
