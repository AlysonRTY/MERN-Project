import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FunnyModal } from "./FunnyModal";
import { API_ENDPOINTS } from "../config/api";

interface LikeButtonProps {
  duckId: string;
  initialLikes: number;
  isAuthenticated: boolean;
  className?: string;
  uploadedBy: string;
}

export function LikeButton({
  duckId,
  initialLikes,
  isAuthenticated,
  className = "",
  uploadedBy,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(API_ENDPOINTS.DUCKS.CHECK_LIKES, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ duckIds: [duckId] }),
        });

        if (response.ok) {
          const data = await response.json();
          const likedStatus = data.likedStatus.find(
            (item: any) => item.duckId === duckId
          );
          setIsLiked(likedStatus?.liked || false);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [duckId, isAuthenticated]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setModalMessage("You need to log in/register to like this cute duck!");
      setShowModal(true);
      return;
    }

    if (user && user.id === uploadedBy) {
      setModalMessage("You can't like your own ducks!");
      setShowModal(true);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        isLiked
          ? API_ENDPOINTS.DUCKS.UNLIKE(duckId)
          : API_ENDPOINTS.DUCKS.LIKE(duckId),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
      }
    } catch (error) {
      console.error("Error liking duck:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleLike}
        className={`flex items-center space-x-1 ${className} ${
          isLiked ? "text-red-500" : "text-gray-400"
        } ${isLoading ? "opacity-50" : ""}`}
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
        <span>{likes}</span>
      </button>

      <FunnyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        playQuack={true}
      >
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800 mb-2">
            🦆 <span className="text-blue-500">Quack Alert!</span> 🦆
          </p>
          <p className="text-sm text-gray-600">{modalMessage}</p>
          <button
            onClick={() => setShowModal(false)}
            className="mt-4 px-4 py-1 rounded-full bg-blue-400 text-white text-sm hover:bg-blue-300 transition-colors"
          >
            Okay!
          </button>
        </div>
      </FunnyModal>
    </>
  );
}
