import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { http } from '../api';
export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const loc = useLocation();
    useEffect(() => {
        http.get('/me').then(r => setProfile(r.data));
        http.get('/orders').then(r => setOrders(r.data));
    }, []);
    const save = async () => {
        const r = await http.put('/me', profile);
        alert(r.data.message);
    };
    if (!profile) return <div className="section">Carregando...</div>;
    return (
        <div className="section">
            <h2>Minha Conta</h2>
            {loc.state?.orderId && <div className="alert">Pedido {loc.state.orderId}
                confirmado!</div>}
            <h3>Dados</h3>
            <div className="form" style={{ maxWidth: 480 }}>
                <input className="input" value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Nome" /
                >
                <input className="input" value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Email" />
                <input className="input" value={profile.address}
                    onChange={e => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Endereço" />
                <button className="btn" onClick={save}>Salvar</button>
            </div>
            <h3 style={{ marginTop: 16 }}>Pedidos</h3>
            {!orders.length ? <div>Nenhum pedido.</div> : (
                <table className="table">
                    <thead>
                        <tr><th>ID</th><th>Itens</th><th>Total</th><th>Data</th></tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td>{o.id}</td>
                                <td>{o.items.map(i => i.name).join(', ')}</td>
                                <td>R$ {o.total.toFixed(2)}</td>
                                <td>{new Date(o.createdAt).toLocaleString('pt-BR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}