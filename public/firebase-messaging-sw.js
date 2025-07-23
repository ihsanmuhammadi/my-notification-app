importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "BAloOInZ-IqzN0VG2sVLbsq4UFMGMHJzhB66QFiVSPPr_itK4Wx8vN-vYbQgTM8fv8CsDTtINFIN1ckWq-juBdI",
  authDomain: "klinik-ku-khaki.firebaseapp.com",
  projectId: "klinik-ku-khaki",
  storageBucket: "klinik-ku-khaki.appspot.com",
  messagingSenderId: "424366713858",
  appId: "1:424366713858:web:2d8f2edccd2fa7ad334b1b",
  measurementId: "G-6LRN3JYLPE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[FCM SW] Received background message:", payload);

  let notificationTitle = "Notifikasi Baru";
  let notificationOptions = {
    body: "Ada notifikasi baru.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    data: payload.data || {},
  };

  fetch(notificationOptions.icon, { method: "HEAD" }).catch(() => {
    notificationOptions.icon = "/favicon.ico";
  });
  fetch(notificationOptions.badge, { method: "HEAD" }).catch(() => {
    notificationOptions.badge = "/favicon.ico";
  });

  if (payload.notification) {
    notificationTitle = payload.notification.title || notificationTitle;
    notificationOptions.body = payload.notification.body || notificationOptions.body;
    notificationOptions.icon = payload.notification.icon || notificationOptions.icon;
    notificationOptions.badge = payload.notification.badge || notificationOptions.badge;
  } else if (payload.data && payload.data.title) {
    notificationTitle = payload.data.title;
    notificationOptions.body = payload.data.body || notificationOptions.body;
  }

  console.log("[FCM SW] Showing notification:", notificationTitle, notificationOptions);
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  // Handle notification click
  const urlToOpen = new URL("/notifications", self.location.origin).href;
  
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});