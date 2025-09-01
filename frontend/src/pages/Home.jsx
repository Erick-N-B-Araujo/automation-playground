import { useEffect, useState } from 'react';
import { http } from '../api';
import ProductCard from '../components/ProductCard';
export default function Home({ searchParams, onAdd }) {
    const [items, setItems] = useState([]);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    useEffect(() => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (category) params.set('category', category);
        http.get(`/products?${params.toString()}`).then(r => setItems(r.data));
    }, [q, category]);
    return (
        <>
            <div className="section">
                <h2>Ofertas</h2>
                <div className="grid">
                    {items.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} />)}
                </div>
            </div>
        </>
    );
}