
import { Star } from "lucide-react";

const packages = [
  {
    name: "Basic Package",
    price: "$120",
    description: "Includes a custom 2-page website with responsive design.",
    image: "https://via.placeholder.com/150", // Replace with a real image URL
    review: "Great service! My website looks amazing and works perfectly.",
    reviewer: "John Doe",
    rating: 5,
  },
  {
    name: "Standard Package",
    price: "$300",
    description: "Includes up to 5 custom pages, mobile-friendly design, and SEO setup.",
    image: "https://via.placeholder.com/150", // Replace with a real image URL
    review: "The team was very professional and delivered on time.",
    reviewer: "Jane Smith",
    rating: 5,
  },
  {
    name: "Premium Package",
    price: "$650",
    description: "Includes up to 10 pages, animations, SEO, and e-commerce functionality.",
    image: "https://via.placeholder.com/150", // Replace with a real image URL
    review: "Absolutely fantastic! My online store is now thriving.",
    reviewer: "Michael Brown",
    rating: 5,
  },
];

const Packages = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center text-white mb-12">Our Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-lg p-6 shadow-lg hover:shadow-xl transition"
          >
            <img
              src={pkg.image}
              alt={`${pkg.name} client`}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-2xl font-semibold text-white text-center mb-2">{pkg.name}</h3>
            <p className="text-center text-purple-400 font-bold text-lg mb-4">{pkg.price}</p>
            <p className="text-white/70 text-center mb-6">{pkg.description}</p>
            <div className="flex justify-center items-center mb-4">
              {[...Array(pkg.rating)].map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-white/80 italic text-center mb-2">
              "{pkg.review}"
            </blockquote>
            <p className="text-white/60 text-center">- {pkg.reviewer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;