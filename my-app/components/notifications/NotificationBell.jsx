import { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen((o) => !o);

  const handleItemClick = (n) => {
    if (!n.read) {
      markAsRead(n.id);
    }
  };

  if (!notifications) return null;

  return (
    <div className="notif-wrapper">
      <button className="notif-bell" onClick={toggleOpen}>
        🔔
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="link-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <ul className="notif-list">
            {notifications.length === 0 && (
              <li className="notif-empty">No notifications.</li>
            )}

            {notifications.map((n) => (
              <li
                key={n.id}
                className={`notif-item ${n.read ? 'read' : 'unread'}`}
                onClick={() => handleItemClick(n)}
              >
                <div className="notif-message">{n.message}</div>
                <div className="notif-time">
                  {new Date(n.createdOn).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
