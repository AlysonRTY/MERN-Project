import { ReactNode, useEffect, useRef } from "react";
import quack from "../assets/sounds/quack.mp3";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  playQuack?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  playQuack = false,
  size = "md",
}: ModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!playQuack) return;

    audioRef.current = new Audio(quack);
    audioRef.current.volume = 0.8;

    return () => {
      audioRef.current?.pause();
    };
  }, [playQuack]);

  useEffect(() => {
    if (!isOpen) return;

    if (playQuack && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.log);
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, playQuack]);

  const sizeClasses = {
    sm: "max-w-xs",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`animate-[feather-drop_0.8s] bg-white/90 p-6 rounded-2xl shadow-xl ${sizeClasses[size]} w-full mx-4 border-2 border-blue-300/80 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
