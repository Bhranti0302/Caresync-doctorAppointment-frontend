import { BACKEND_BASE_URL } from "../services/api";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/uploads/"))
    return `${BACKEND_BASE_URL}${imagePath}`;
  return `${BACKEND_BASE_URL}/uploads/${imagePath}`;
};
