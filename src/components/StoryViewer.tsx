import React, { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./StoryViewer.css";

interface MediaItem {
  src: string;
  type: "image" | "video";
}

export interface StoryProps {
  media: MediaItem[];
  icon: string;
}

interface StoryViewerProps extends StoryProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onNextStory: () => void;
  onPrevStory: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  media,
  icon,
  isOpen,
  onOpen,
  onClose,
  onNextStory,
  onPrevStory
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (media[currentIndex].type === "image") {
      const duration = 3000;
      let start = Date.now();
      setProgress(0);

      timerRef.current = setInterval(() => {
        let timeElapsed = Date.now() - start;
        setProgress((timeElapsed / duration) * 100);

        if (timeElapsed >= duration) {
          clearInterval(timerRef.current!);
          goToNext();
        }
      }, 50);
    } else {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          const duration = videoRef.current!.duration * 1000;
          let start = Date.now();
          setProgress(0);

          timerRef.current = setInterval(() => {
            let timeElapsed = Date.now() - start;
            setProgress((timeElapsed / duration) * 100);

            if (timeElapsed >= duration) {
              clearInterval(timerRef.current!);
              goToNext();
            }
          }, 50);
        };
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isOpen]);

  const goToNext = () => {
    if (currentIndex < media.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    if (difference > 50) {
      onNextStory();
    } else if (difference < -50) {
      onPrevStory();
    }

    touchStartX.current = null;
  };

  return (
    <div className="story-item">
      <img src={icon} alt="Story Icon" className="story-icon" onClick={onOpen} />

      {isOpen && (
        <Modal open={isOpen} footer={null} onCancel={onClose} centered width={"100vw"} closable={false} className="custom-modal">
          <div className="story-modal-content" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <button className="close-btn" onClick={onClose}>
              <CloseOutlined />
            </button>

            <div className="progress-bar">
              {media.map((_, index) => (
                <div key={index} className="progress-segment">
                  <div
                    className={`progress-fill ${index <= currentIndex ? "active" : ""}`}
                    style={{ width: index === currentIndex ? `${progress}%` : index < currentIndex ? "100%" : "0%" }}
                  ></div>
                </div>
              ))}
            </div>

            <div className="media-container">
              {media[currentIndex].type === "image" ? (
                <img src={media[currentIndex].src} alt="Story" className="full-screen-media" />
              ) : (
                <video src={media[currentIndex].src} autoPlay controls ref={videoRef} className="full-screen-media" />
              )}

              <button className="nav-btn left" onClick={goToPrev}></button>
              <button className="nav-btn right" onClick={goToNext}></button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StoryViewer;
