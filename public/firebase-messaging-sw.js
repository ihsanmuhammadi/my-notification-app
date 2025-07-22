importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "BAloOInZ-IqzN0VG2sVLbsq4UFMGMHJzhB66QFiVSPPr_itK4Wx8vN-vYbQgTM8fv8CsDTtINFIN1ckWq-juBdI",
  authDomain: "klinik-ku-khaki.firebaseapp.com",
  projectId: "klinik-ku-khaki",
  storageBucket: "klinik-ku-khaki.firebasestorage.app",
  messagingSenderId: "424366713858",
  appId: "1:424366713858:web:2d8f2edccd2fa7ad334b1b",
  measurementId: "G-6LRN3JYLPE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    data: payload.data,
  };

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