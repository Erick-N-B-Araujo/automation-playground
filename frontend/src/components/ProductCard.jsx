import { Link } from 'react-router-dom';
export default function ProductCard({ p, onAdd }) {
    return (
        <div className="card">
            <img src={`https://placehold.co/400x240?text=${encodeURIComponent(p.name)}`} alt={p.name} />
            <h4>{p.name}</h4>
            <div className="price">R$ {p.price.toFixed(2)}</div>
            <div style={{ display: 'flex', gap: 8 }}>
                <Link className="btn secondary" to={`/product/${p.id}`}>Detalhes</Link>
                <button className="btn" onClick={() => onAdd?.(p.id)}>Adicionar</button>
            </div>
        </div>
    );
}