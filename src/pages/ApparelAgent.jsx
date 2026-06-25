import { useState } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Premium Hoodie', brand: 'UrbanWear', price: 89, sizes: ['XS','S','M','L','XL'], colors: ['Black','White','Navy'], stock: 'In Stock', img: '👕', category: 'Tops', ai_score: 94 },
  { id: 2, name: 'Slim Fit Joggers', brand: 'AthleticPro', price: 65, sizes: ['S','M','L','XL'], colors: ['Gray','Black','Olive'], stock: 'In Stock', img: '👖', category: 'Bottoms', ai_score: 88 },
  { id: 3, name: 'Classic Sneakers', brand: 'StrideCo', price: 120, sizes: ['7','8','9','10','11','12'], colors: ['White','Black'], stock: 'Low Stock', img: '👟', category: 'Footwear', ai_score: 97 },
  { id: 4, name: 'Leather Belt', brand: 'LuxeLeather', price: 45, sizes: ['S','M','L'], colors: ['Brown','Black'], stock: 'In Stock', img: '🪡', category: 'Accessories', ai_score: 82 },
  { id: 5, name: 'Winter Jacket', brand: 'NordWear', price: 210, sizes: ['S','M','L','XL'], colors: ['Navy','Forest'], stock: 'In Stock', img: '🧥', category: 'Outerwear', ai_score: 91 },
  { id: 6, name: 'Baseball Cap', brand: 'CapKing', price: 35, sizes: ['One Size'], colors: ['Black','White','Red'], stock: 'In Stock', img: '🧢', category: 'Accessories', ai_score: 79 },
];

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Footwear', 'Accessories', 'Outerwear'];

export default function ApparelAgent() {
  const [filter, setFilter] = useState('All');
  const [cart, setCart] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  const filtered = PRODUCTS.filter(p =>
    (filter === 'All' || p.category === filter) &&
    p.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const aiSearch = () => {
    setSearching(true);
    setTimeout(() => setSearching(false), 1500);
  };

  const totalItems = cart.reduce((a, i) => a + i.qty, 0);
  const totalPrice = cart.reduce((a, i) => a + i.price * i.qty, 0);

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>👔 Apparel Agent</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>AI-curated fashion recommendations and smart shopping assistant.</p>
        </div>
        {totalItems > 0 && (
          <div style={{
            padding: '9px 16px',
            background: 'var(--card)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            fontSize: 13,
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}>
            🛒 {totalItems} items · <span style={{ color: '#10b981', fontWeight: 700 }}>${totalPrice}</span>
          </div>
        )}
      </div>

      {/* AI Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          placeholder="Search or describe what you're looking for..."
          style={{
            flex: 1,
            padding: '10px 14px',
            background: 'var(--card)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            color: '#e2e8f0',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          onClick={aiSearch}
          disabled={searching}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {searching ? '⏳ AI Searching...' : '🤖 AI Search'}
        </button>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: '5px 12px', borderRadius: 99,
            border: `1px solid ${filter === cat ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
            background: filter === cat ? 'rgba(99,102,241,0.15)' : 'transparent',
            color: filter === cat ? '#6366f1' : 'var(--muted)',
            cursor: 'pointer', fontSize: 12,
          }}>{cat}</button>
        ))}
      </div>

      {/* Products */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {filtered.map(p => (
          <div key={p.id} style={{
            background: 'var(--card)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              height: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 64,
              position: 'relative',
            }}>
              {p.img}
              <div style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(99,102,241,0.8)',
                borderRadius: 6,
                padding: '2px 6px',
                fontSize: 10,
                color: '#fff',
                fontWeight: 700,
              }}>AI {p.ai_score}%</div>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3 }}>{p.brand}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {p.colors.slice(0, 3).map(c => (
                  <span key={c} style={{ fontSize: 10, color: 'var(--muted)' }}>{c}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>${p.price}</span>
                <button
                  onClick={() => addToCart(p)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: 'rgba(99,102,241,0.2)',
                    color: '#6366f1',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  + Cart
                </button>
              </div>
              <div style={{ fontSize: 10, color: p.stock === 'Low Stock' ? '#f59e0b' : '#10b981', marginTop: 6 }}>
                {p.stock}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
