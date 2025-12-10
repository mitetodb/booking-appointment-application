import React, { createContext, useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../hooks/useAuth';

export const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter((n) => n && !n.read).length 
    : 0;

  const loadNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      const data = await notificationService.getMyNotifications();
      
      // Defensive check: ensure data is an array
      if (Array.isArray(data)) {
        setNotifications(data);
      } else if (data && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      } else if (data && Array.isArray(data.data)) {
        setNotifications(data.data);
      } else {
        console.warn('Unexpected notifications response format:', data);
        setNotifications([]);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        console.debug('Notifications not available (403 Forbidden)');
        setNotifications([]);
        return;
      }
      console.error('Failed to load notifications', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    if (!id) {
      console.warn('Cannot mark notification as read: ID is missing');
      return;
    }

    try {
      await notificationService.markAsRead(id);
      setNotifications((items) =>
        items.map((n) => (n && n.id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
      // Optionally show user-friendly error, but don't crash
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((items) => items.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadNotifications();
    const intervalId = setInterval(loadNotifications, 60_000); // 60 seconds interval
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    loading,
    reload: loadNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
