import { useEffect } from "react";
import toast from "react-hot-toast";
import { FoodItem } from "../store/fridgeContentsSlice";
import {
  categorizeItemsByExpiration,
  formatExpirationMessage,
} from "../utils/expirationUtils";

export const useExpirationNotifications = (items: FoodItem[]) => {
  useEffect(() => {
    const checkExpirations = () => {
      const { expired, expiringSoon } = categorizeItemsByExpiration(items);

      // Show notifications for expired items
      expired.forEach(item => {
        const message = formatExpirationMessage(item);
        toast.error(message, {
          id: `expired-${item.id}`, // Prevent duplicate toasts
          duration: 6000,
          icon: "🗑️",
        });
      });

      // Show notifications for items expiring soon
      expiringSoon.forEach(item => {
        const message = formatExpirationMessage(item);
        toast(message, {
          id: `expiring-${item.id}`, // Prevent duplicate toasts
          duration: 5000,
          icon: "⚠️",
          style: {
            background: "#FEF3C7",
            color: "#92400E",
            border: "1px solid #F59E0B",
          },
        });
      });
    };

    // Only check if there are items
    if (items.length > 0) {
      checkExpirations();
    }
  }, [items]);

  return { categorizeItemsByExpiration };
};
