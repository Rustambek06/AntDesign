import React, { useRef } from "react";
import StoryViewer from "./StoryViewer";
import { StoryProps } from "./StoryViewer";
import "./StoryViewer.css"; // Подключаем стили

const stories: StoryProps[] = [
  {
    media: [
      { src: "photo1.png", type: "image" },
      { src: "photo2.png", type: "image" },
      { src: "video1.mp4", type: "video" }
    ],
    icon: "1.png",
    onNextStory: () => {},
    onPrevStory: () => {}
  },
  {
    media: [
      { src: "photo2.png", type: "image" },
      { src: "photo1.png", type: "image" }
    ],
    icon: "3.png",
    onNextStory: () => {},
    onPrevStory: () => {}
  },
  {
    media: [
      { src: "photo3.png", type: "image" }
    ],
    icon: "15.png",
    onNextStory: () => {},
    onPrevStory: () => {}
  },
  {
    media: [
      { src: "video1.mp4", type: "video" }
    ],
    icon: "4.png",
    onNextStory: () => {},
    onPrevStory: () => {}
  },
  {
    media: [
      { src: "photo1.png", type: "image" }
    ],
    icon: "5.png",
    onNextStory: () => {},
    onPrevStory: () => {}
  },
  {
    media: [
      { src: "photo2.png", type: "image" }
    ],
    icon: "6.png",
    onNextStory: () => {},
    onPrevStory: () => {}
  }
];

const StoryList: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Обработчик колесика мыши для горизонтального скролла
  const handleWheel = (event: React.WheelEvent) => {
    if (containerRef.current) {
      event.preventDefault();
      containerRef.current.scrollBy({ left: event.deltaY, behavior: "smooth" });
    }
  };

  // Начало свайпа
  const handleTouchStart = (event: React.TouchEvent) => {
    if (containerRef.current) {
      isDragging.current = true;
      startX.current = event.touches[0].clientX;
      scrollLeft.current = containerRef.current.scrollLeft;
    }
  };

  // Обновление свайпа
  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const deltaX = event.touches[0].clientX - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - deltaX;
  };

  // Завершение свайпа
  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="story-list"
      ref={containerRef}
      onWheel={handleWheel} // Поддержка скролла колесом мыши
      onTouchStart={handleTouchStart} // Начало свайпа
      onTouchMove={handleTouchMove} // Движение пальцем
      onTouchEnd={handleTouchEnd} // Конец свайпа
    >
      {stories.map((story, index) => (
        <StoryViewer key={index} {...story} />
      ))}
    </div>
  );
};

export default StoryList;
