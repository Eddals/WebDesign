import { useState, useEffect } from "react";

interface Purchase {
  name: string;
  location: string;
  plan: string;
  image: string;
  review: string;
}

const Notification = () => {
  const [notification, setNotification] = useState<Purchase | null>(null);

  const purchases = [
    {
      name: "John Doe",
      location: "New York, USA",
      plan: "Premium Package",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      review: "This changed my life! Absolutely love it.",
    },
    {
      name: "Jane Smith",
      location: "London, UK",
      plan: "Standard Package",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      review: "Exactly what I needed. Thank you!",
    },
    {
      name: "Carlos Silva",
      location: "São Paulo, Brazil",
      plan: "Basic Package",
      image: "https://randomuser.me/api/portraits/men/85.jpg",
      review: "Great start for my journey. So happy!",
    },
    {
      name: "Emily Johnson",
      location: "Toronto, Canada",
      plan: "Premium Package",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      review: "Worth every penny. Amazing experience!",
    },
    {
      name: "Akira Tanaka",
      location: "Tokyo, Japan",
      plan: "Standard Package",
      image: "https://randomuser.me/api/portraits/men/29.jpg",
      review: "Exceeded my expectations. Fantastic!",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomPurchase = purchases[Math.floor(Math.random() * purchases.length)];
      setNotification(randomPurchase);

      setTimeout(() => setNotification(null), 7000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!notification) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 border border-purple-500/50 shadow-xl rounded-xl p-4 flex items-center gap-4 animate-slide-in text-white relative">
      <button
        onClick={() => setNotification(null)}
        className="absolute top-2 right-2 text-white/70 hover:text-white text-sm"
      >
        ✕
      </button>
      <img
        src={notification.image}
        alt={notification.name}
        className="w-12 h-12 rounded-full border border-purple-500/50"
      />
      <div>
        <p className="font-bold">{notification.name}</p>
        <p className="text-sm">
          from <span className="font-medium">{notification.location}</span> got the{" "}
          <span className="text-purple-300 font-semibold">{notification.plan}</span>.
        </p>
        <blockquote className="italic mt-2 text-purple-200">"{notification.review}"</blockquote>
      </div>
    </div>
  );
};

export default Notification;