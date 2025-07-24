import { FoodItem } from "../store/fridgeContentsSlice";

export interface ExpirationStatus {
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysUntilExpiration: number;
}

export const getExpirationStatus = (expirationDate: string): ExpirationStatus => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  
  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  expDate.setHours(0, 0, 0, 0);
  
  const timeDiff = expDate.getTime() - today.getTime();
  const daysUntilExpiration = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const isExpired = daysUntilExpiration < 0;
  const isExpiringSoon = daysUntilExpiration >= 0 && daysUntilExpiration <= 3;
  
  return {
    isExpired,
    isExpiringSoon,
    daysUntilExpiration,
  };
};

export const categorizeItemsByExpiration = (items: FoodItem[]) => {
  const expired: FoodItem[] = [];
  const expiringSoon: FoodItem[] = [];
  const fresh: FoodItem[] = [];
  
  items.forEach(item => {
    const status = getExpirationStatus(item.expirationDate);
    
    if (status.isExpired) {
      expired.push(item);
    } else if (status.isExpiringSoon) {
      expiringSoon.push(item);
    } else {
      fresh.push(item);
    }
  });
  
  return { expired, expiringSoon, fresh };
};

export const formatExpirationMessage = (item: FoodItem): string => {
  const status = getExpirationStatus(item.expirationDate);
  
  if (status.isExpired) {
    const daysPast = Math.abs(status.daysUntilExpiration);
    return `${item.name} expired ${daysPast} day${daysPast === 1 ? '' : 's'} ago`;
  }
  
  if (status.isExpiringSoon) {
    if (status.daysUntilExpiration === 0) {
      return `${item.name} expires today!`;
    }
    return `${item.name} expires in ${status.daysUntilExpiration} day${status.daysUntilExpiration === 1 ? '' : 's'}`;
  }
  
  return `${item.name} is fresh`;
};
