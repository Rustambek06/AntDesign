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
  onNextStory: () => void;
  onPrevStory: () => void;
}

const StoryViewer: React.FC<StoryProps> = ({ media, icon, onNextStory, onPrevStory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const openModal = () => {
    setIsOpen(true);
    setCurrentIndex(0);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentIndex(0);
    setProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const goToNext = () => {
    if (currentIndex < media.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onNextStory(); // Переключение на следующую сторис
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      onPrevStory(); // Переключение на предыдущую сторис
    }
  };

  const handleStorySwipeStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleStorySwipeEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    if (deltaX > 25) {
      onPrevStory(); // Свайп влево — предыдущая сторис
    } else if (deltaX < -25) {
      onNextStory(); // Свайп вправо — следующая сторис
    }
    touchStartX.current = null;
  };

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

  return (
    <div className="story-item" onTouchStart={handleStorySwipeStart} onTouchEnd={handleStorySwipeEnd}>
      <img src={icon} alt="Story Icon" className="story-icon" onClick={openModal} />

      <Modal open={isOpen} footer={null} onCancel={closeModal} centered width={"100vw"} closable={false} className="custom-modal">
        <div className="story-modal-content">
          <button className="close-btn" onClick={closeModal}>
            <CloseOutlined />
          </button>

          {/* Прогресс-бар */}
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

          {/* Контейнер медиа */}
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
    </div>
  );
};

export default StoryViewer;
