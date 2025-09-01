import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../api';
export default function Cart() {
    const [items, setItems] = useState([]);
    const [zip, setZip] = useState('');
    const [shipping, setShipping] = useState(0);
    const nav = useNavigate();
    const subtotal = useMemo(() => items.reduce((a, i) => a + i.price * i.qty, 0),
        [items]);
    const total = subtotal + shipping;
    const load = () => http.get('/cart').then(r => setItems(r.data));
    useEffect(() => { load(); }, []);
    const remove = async (id) => {
        const r = await http.post('/cart/remove', { productId: id });
        setItems(r.data.cart || r.data);
    };
    const calc = async () => {
        const r = await http.post('/shipping/calc', { zipcode: zip, subtotal });
        setShipping(r.data.shipping);
    };
    return (
        <div className="section">
            <h2>Carrinho</h2>
            {!items.length ? <div>Seu carrinho está vazio.</div> : (
                <table className="table">
                    <thead>
                        <tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Ações</th></tr>
                    </thead>
                    <tbody>
                        {items.map(i => (
                            <tr key={i.id}>
                                <td>{i.name}</td>
                                <td>{i.qty}</td>
                                <td>R$ {(i.price * i.qty).toFixed(2)}</td>
                                <td><button className="btn secondary" onClick={() => remove(i.id)}
                                >Remover</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
                <input className="input" style={{ maxWidth: 180 }} placeholder="CEP"
                    value={zip} onChange={e => setZip(e.target.value)} />
                <button className="btn" onClick={calc}>Calcular frete</button>
                <div>Frete: <b>R$ {shipping.toFixed(2)}</b></div>
            </div>
            <div style={{ marginTop: 12 }}>Subtotal: <b>R$ {subtotal.toFixed(2)}</b> |
                Total: <b>R$ {total.toFixed(2)}</b></div>
            <button disabled={!items.length} className="btn" style={{ marginTop: 12 }}
                onClick={() => nav('/checkout')}>Continuar para pagamento</button>
        </div>
    );
}