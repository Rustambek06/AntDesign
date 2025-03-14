import React, { useState } from "react";
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
    icon: "1.png"
  },
  {
    media: [
      { src: "photo2.png", type: "image" },
      { src: "photo1.png", type: "image" }
    ],
    icon: "3.png"
  },
  {
    media: [
      { src: "photo3.png", type: "image" }
    ],
    icon: "15.png"
  },
  {
    media: [
      { src: "video1.mp4", type: "video" }
    ],
    icon: "4.png"
  }
];

const StoryList: React.FC = () => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
  };

  const goToNextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      closeStory();
    }
  };

  const goToPrevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    } else {
      closeStory();
    }
  };

  return (
    <div className="story-list">
      {stories.map((story, index) => (
        <StoryViewer
          key={index}
          {...story}
          isOpen={activeStoryIndex === index}
          onOpen={() => openStory(index)}
          onClose={closeStory}
          onNextStory={goToNextStory}
          onPrevStory={goToPrevStory}
        />
      ))}
    </div>
  );
};

export default StoryList;
