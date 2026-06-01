import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

// Multiple images per car keyed by car id
const carImages = {
  1: [ // Mercedes GLE
    { url: "https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=1200&q=80", label: "Exterior Front" },
    { url: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80", label: "Exterior Side" },
    { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80", label: "Interior Cabin" },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80", label: "Front Seats" },
    { url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80", label: "Dashboard" },
    { url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80", label: "Rear Seats" },
    { url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80", label: "Engine Bay" },
  ],
  2: [ // Land Cruiser
    { url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80", label: "Exterior Front" },
    { url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80", label: "Side View" },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80", label: "Interior" },
    { url: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=1200&q=80", label: "Rear View" },
    { url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80", label: "Dashboard" },
    { url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80", label: "Seats" },
  ],
  3: [ // BMW X5
    { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80", label: "Exterior Front" },
    { url: "https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=1200&q=80", label: "Exterior Side" },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80", label: "Interior Cabin" },
    { url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80", label: "Dashboard & Controls" },
    { url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80", label: "Front Leather Seats" },
    { url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80", label: "Rear Passenger Area" },
    { url: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80", label: "Boot / Cargo Space" },
    { url: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=1200&q=80", label: "Wheels & Tyres" },
  ],
  4: [
    { url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80", label: "Exterior" },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80", label: "Interior" },
    { url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80", label: "Dashboard" },
    { url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80", label: "Seats" },
    { url: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=1200&q=80", label: "Rear View" },
  ],
  5: [
    { url: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1200&q=80", label: "Exterior" },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80", label: "Interior" },
    { url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80", label: "Dashboard" },
    { url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80", label: "Seats" },
    { url: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=1200&q=80", label: "Rear" },
    { url: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80", label: "Side" },
  ],
  6: [
    { url: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80", label: "Exterior" },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80", label: "Interior" },
    { url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80", label: "Dashboard" },
    { url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80", label: "Seats" },
    { url: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=1200&q=80", label: "Rear" },
  ],
  7: [
    { url: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80", label: "Exterior" },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80", label: "Interior" },
    { url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80", label: "Dashboard" },
    { url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80", label: "Seats" },
    { url: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=1200&q=80", label: "Side" },
    { url: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80", label: "Rear" },
  ],
};

const defaultImages = [
  { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80", label: "Exterior" },
  { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80", label: "Interior" },
  { url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80", label: "Dashboard" },
  { url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80", label: "Seats" },
  { url: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=1200&q=80", label: "Side" },
];

export function getCarImages(carId) {
  return carImages[carId] || defaultImages;
}

export default function CarImageGallery({ carId, onClose }) {
  const images = getCarImages(carId);
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  return (
    <>
      {/* Main gallery */}
      <div className="relative rounded-xl overflow-hidden bg-black mb-3">
        <img
          src={images[current].url}
          alt={images[current].label}
          className="w-full h-64 object-cover cursor-zoom-in"
          onClick={() => setLightbox(true)}
        />
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        {/* Image label + counter */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">{images[current].label}</span>
          <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">{current + 1} / {images.length}</span>
        </div>
        {/* Zoom icon */}
        <button
          onClick={() => setLightbox(true)}
          className="absolute top-3 left-3 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === current ? "border-orange-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <img src={img.url} alt={img.label} className="w-16 h-12 object-cover" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white" onClick={() => setLightbox(false)}>
            <X className="w-5 h-5" />
          </button>
          <button className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white" onClick={e => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img src={images[current].url} alt={images[current].label} className="max-w-5xl max-h-[85vh] object-contain rounded-xl" onClick={e => e.stopPropagation()} />
          <button className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white" onClick={e => { e.stopPropagation(); next(); }}>
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-1.5 rounded-full">
            {images[current].label} — {current + 1} of {images.length}
          </div>
        </div>
      )}
    </>
  );
}