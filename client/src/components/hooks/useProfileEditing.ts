import { useState, useEffect } from "react";
import { User } from "../../@types";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

export function useProfileEditing(user: User | null) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.bio) {
      setBio(user.bio);
    }
  }, [user]);

  const handleUpdateProfile = async (
    id: string,
    profilePictureFile: File | null
  ) => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();

      // Only append if file exists
      if (profilePictureFile) {
        formData.append("image", profilePictureFile);
      }

      // Always append bio if it exists (even empty string to clear bio)
      formData.append("bio", bio);

      const response = await fetch(API_ENDPOINTS.AUTH.UPDATE_PROFILE(id), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      setIsEditing(false);
      setPreviewUrl(null);

      updateUser({
        ...user,
        profilePicture: data.user?.profilePicture || user?.profilePicture,
        bio: data.user?.bio || bio,
      });

      return data.user;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setPreviewUrl(null);
    if (user?.bio) {
      setBio(user.bio);
    } else {
      setBio("");
    }
  };

  return {
    isEditing,
    setIsEditing,
    bio,
    setBio,
    previewUrl,
    error,
    setError,
    loading,
    handleUpdateProfile,
    cancelEditing,
  };
}
