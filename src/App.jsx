import React, { useState, useEffect, useMemo } from "react";
import { Search, ShoppingCart, X, Plus, Minus, Star, ChevronRight, Check, Menu } from "lucide-react";

function NexoraMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="navmark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C9A227" />
          <stop offset="1" stopColor="#E08D3C" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="96" height="96" rx="24" fill="url(#navmark)" />
      <path d="M30,28 L52,50 L30,72" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M46,22 L72,50 L46,78" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Design tokens ----
const COLORS = {
  bg: "#FBF8F2",
  ink: "#1A1A1A",
  gold: "#D4A017",
  goldDeep: "#A97A0A",
  green: "#1B4332",
  red: "#C1121F",
  line: "#E7E0D0",
  card: "#FFFFFF",
};

const CATEGORIES = ["All", "Phones & Tech", "Fashion", "Home & Kitchen", "Beauty", "Groceries"];

const PRODUCTS = [
  { id: 1, name: "Wireless Earbuds Pro X", cat: "Phones & Tech", price: 189, rating: 4.5, reviews: 812, badge: "Hot Deal", color: "#2B2D42", seller: "TechHive GH" },
  { id: 2, name: "Kente-Trim Ankara Dress", cat: "Fashion", price: 145, rating: 4.8, reviews: 340, badge: "New", color: "#C1121F", seller: "Adepa Styles" },
  { id: 3, name: "Non-Stick Cookware Set (7pc)", cat: "Home & Kitchen", price: 260, rating: 4.6, reviews: 501, color: "#1B4332", seller: "HomeBase Kumasi" },
  { id: 4, name: "Shea Butter Body Cream 500ml", cat: "Beauty", price: 38, rating: 4.9, reviews: 1204, badge: "Bestseller", color: "#D4A017", seller: "PureShea Naturals" },
  { id: 5, name: "20W Fast Charger + Cable", cat: "Phones & Tech", price: 45, rating: 4.3, reviews: 267, color: "#4361EE", seller: "TechHive GH" },
  { id: 6, name: "Men's Kente Print Shirt", cat: "Fashion", price: 98, rating: 4.4, reviews: 156, color: "#A97A0A", seller: "Adepa Styles" },
  { id: 7, name: "5L Rice — Premium Long Grain", cat: "Groceries", price: 72, rating: 4.7, reviews: 980, badge: "Hot Deal", color: "#606C38", seller: "Nexora Foods" },
  { id: 8, name: "Bluetooth Speaker — 12hr Battery", cat: "Phones & Tech", price: 130, rating: 4.2, reviews: 190, color: "#1A1A1A", seller: "TechHive GH" },
  { id: 9, name: "Black Soap & Loofah Set", cat: "Beauty", price: 29, rating: 4.7, reviews: 645, color: "#3A5A40", seller: "PureShea Naturals" },
  { id: 10, name: "Stainless Steel Water Bottle 1L", cat: "Home & Kitchen", price: 55, rating: 4.5, reviews: 210, badge: "New", color: "#588157", seller: "HomeBase Kumasi" },
  { id: 11, name: "Women's Leather Sandals", cat: "Fashion", price: 110, rating: 4.6, reviews: 302, color: "#7F5539", seller: "Adepa Styles" },
  { id: 12, name: "Palm Oil 2L (Cold Pressed)", cat: "Groceries", price: 48, rating: 4.8, reviews: 415, color: "#BC6C25", seller: "Nexora Foods" },
];

function StampBadge({ text }) {
  const color = text === "Hot Deal" ? COLORS.red : text === "Bestseller" ? COLORS.goldDeep : COLORS.green;
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        transform: "rotate(-6deg)",
        border: `2px solid ${color}`,
        color,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        padding: "3px 8px",
        borderRadius: 3,
        textTransform: "uppercase",
        background: "rgba(255,255,255,0.9)",
      }}
    >
      {text}
    </div>
  );
}

function ProductImage({ color, name }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        height: 140,
        borderRadius: "10px 10px 0 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        {initials}
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexora-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {
      // no saved cart yet
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("nexora-cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Could not save cart", e);
    }
  }, [cart, loaded]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCat = activeCat === "All" || p.cat === activeCat;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [query, activeCat]);

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === Number(id)), qty }));

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.qty * i.price, 0);

  const addToCart = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setToast("Added to cart");
  };
  const changeQty = (id, delta) => {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) + delta) };
      return next;
    });
  };
  const removeItem = (id) => {
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  };

  const placeOrder = () => {
    setCheckoutStep("done");
  };

  const closeEverything = () => {
    setCartOpen(false);
    setCheckoutStep(null);
    setSelected(null);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bg, minHeight: "100vh", color: COLORS.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        button { cursor: pointer; font-family: inherit; }
        button:focus-visible, input:focus-visible { outline: 3px solid ${COLORS.gold}; outline-offset: 2px; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.line}; border-radius: 4px; }
      `}</style>

      <header style={{ background: COLORS.ink, color: "#fff", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <NexoraMark size={26} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em" }}>
              NEXORA
            </span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#2A2A2A", borderRadius: 8, padding: "0 10px" }}>
            <Search size={16} color="#999" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              style={{ background: "transparent", border: "none", color: "#fff", padding: "9px 8px", width: "100%", fontSize: 14 }}
            />
          </div>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
            style={{ position: "relative", background: "none", border: "none", color: "#fff", padding: 6, flexShrink: 0 }}
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  background: COLORS.gold,
                  color: COLORS.ink,
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: "50%",
                  width: 17,
                  height: 17,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
        <div style={{ borderTop: "1px solid #333", overflowX: "auto" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4, padding: "0 16px" }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: activeCat === c ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                  color: activeCat === c ? COLORS.gold : "#ccc",
                  padding: "10px 10px",
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div style={{ background: `linear-gradient(120deg, ${COLORS.green}, #123024)`, color: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px" }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, margin: 0, fontWeight: 700 }}>
            Everything from the market, delivered.
          </h1>
          <p style={{ margin: "6px 0 0", color: "#cfe3d8", fontSize: 14 }}>
            Verified local sellers. Fair prices. Fast checkout.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, margin: 0 }}>
            {activeCat === "All" ? "All products" : activeCat}
          </h2>
          <span style={{ fontSize: 12, color: "#777" }}>{filtered.length} items</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#777" }}>
            <p style={{ fontSize: 14 }}>No products match "{query}". Try another search.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
            {filtered.map((p) => (
              <div
                key={p.id}
                style={{
                  background: COLORS.card,
                  borderRadius: 10,
                  border: `1px solid ${COLORS.line}`,
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <button
                  onClick={() => setSelected(p)}
                  style={{ background: "none", border: "none", padding: 0, textAlign: "left", position: "relative" }}
                  aria-label={`View ${p.name}`}
                >
                  <ProductImage color={p.color} name={p.name} />
                  {p.badge && <StampBadge text={p.badge} />}
                </button>
                <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                  <button
                    onClick={() => setSelected(p)}
                    style={{ background: "none", border: "none", padding: 0, textAlign: "left" }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{p.name}</span>
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#777" }}>
                    <Star size={11} fill={COLORS.gold} color={COLORS.gold} />
                    {p.rating} · {p.reviews}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 15, marginTop: 2 }}>
                    GH₵{p.price}
                  </div>
                  <button
                    onClick={() => addToCart(p.id)}
                    style={{
                      marginTop: 6,
                      background: COLORS.gold,
                      color: COLORS.ink,
                      border: "none",
                      borderRadius: 6,
                      padding: "7px 0",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "flex-end",
            zIndex: 30,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ background: COLORS.card, borderRadius: "16px 16px 0 0", width: "100%", maxWidth: 500, margin: "0 auto", padding: 20, position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none" }}
            >
              <X size={20} />
            </button>
            <ProductImage color={selected.color} name={selected.name} />
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, margin: "12px 0 4px" }}>{selected.name}</h3>
            <div style={{ fontSize: 12, color: "#777", marginBottom: 6 }}>Sold by {selected.seller}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#777", marginBottom: 8 }}>
              <Star size={12} fill={COLORS.gold} color={COLORS.gold} />
              {selected.rating} rating · {selected.reviews} reviews
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 22, marginBottom: 14 }}>
              GH₵{selected.price}
            </div>
            <button
              onClick={() => {
                addToCart(selected.id);
                setSelected(null);
              }}
              style={{ width: "100%", background: COLORS.gold, color: COLORS.ink, border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 14 }}
            >
              Add to cart
            </button>
          </div>
        </div>
      )}

      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40, display: "flex", justifyContent: "flex-end" }} onClick={closeEverything}>
          <div
            style={{ background: COLORS.bg, width: "100%", maxWidth: 380, height: "100%", padding: 18, overflowY: "auto", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, margin: 0 }}>Your cart</h3>
              <button onClick={closeEverything} aria-label="Close cart" style={{ background: "none", border: "none" }}>
                <X size={20} />
              </button>
            </div>

            {checkoutStep === "done" ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.green, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Check size={28} />
                </div>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 6px" }}>Order placed</h4>
                <p style={{ fontSize: 13, color: "#777", margin: "0 0 20px" }}>
                  Your order total was GH₵{cartTotal}. This is a demo checkout — no real payment was processed.
                </p>
                <button
                  onClick={() => {
                    setCart({});
                    closeEverything();
                  }}
                  style={{ background: COLORS.gold, color: COLORS.ink, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700 }}
                >
                  Continue shopping
                </button>
              </div>
            ) : checkoutStep === "form" ? (
              <div>
                <p style={{ fontSize: 13, color: "#777", marginBottom: 14 }}>Delivery details (demo — no real order is sent)</p>
                <input placeholder="Full name" style={inputStyle} />
                <input placeholder="Phone number" style={inputStyle} />
                <input placeholder="Delivery address" style={inputStyle} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, margin: "14px 0", fontWeight: 700 }}>
                  <span>Total</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>GH₵{cartTotal}</span>
                </div>
                <button onClick={placeOrder} style={{ width: "100%", background: COLORS.green, color: "#fff", border: "none", borderRadius: 8, padding: "13px 0", fontWeight: 700 }}>
                  Place order
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <p style={{ fontSize: 13, color: "#777" }}>Your cart is empty. Add something you like.</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: 10, marginBottom: 14, background: COLORS.card, padding: 10, borderRadius: 8, border: `1px solid ${COLORS.line}` }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: item.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, marginTop: 2 }}>GH₵{item.price}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                        <button onClick={() => changeQty(item.id, -1)} style={qtyBtnStyle}><Minus size={12} /></button>
                        <span style={{ fontSize: 13, minWidth: 14, textAlign: "center" }}>{item.qty}</span>
     
