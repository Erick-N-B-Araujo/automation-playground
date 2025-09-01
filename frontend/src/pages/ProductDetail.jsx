import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../api';
import Breadcrumbs from '../components/Breadcrumbs';
export default function ProductDetail({ onAdd }) {
    const { id } = useParams();
    const [p, setP] = useState(null);
    useEffect(() => { http.get(`/products/${id}`).then(r => setP(r.data)); }, [id]);
    if (!p) return <div className="section">Carregando...</div>;
    return (
        < div className="section" >
            <Breadcrumbs items={[{ to: '/', label: 'Home' }, { label: p.category },
            { label: p.name }]} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <img src={`https://placehold.co/640x360?text=$
{encodeURIComponent(p.name)}`} alt={p.name} />
                <div>
                    <h2>{p.name}</h2>
                    <p>{p.desc}</p>
                    <div className="price">R$ {p.price.toFixed(2)}</div>
                    <button className="btn" onClick={() => onAdd?.(p.id)}>Adicionar ao
                        carrinho</button>
                </div>
            </div>
        </div >
    );
}