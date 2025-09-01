import { useEffect, useState } from 'react';
import { http } from '../api';
export default function Admin() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        name: '', price: '', brand: '', category: '',
        desc: ''
    });
    const load = () => http.get('/admin/products').then(r => setItems(r.data));
    useEffect(() => { load(); }, []);
    const createP = async () => {
        const r = await http.post('/admin/products', {
            ...form, price:
                Number(form.price)
        });
        setForm({ name: '', price: '', brand: '', category: '', desc: '' });
        load();
    };
    const updateP = async (id, patch) => {
        await http.put(`/admin/products/${id}`, patch);
        load();
    };
    const deleteP = async (id) => {
        await http.delete(`/admin/products/${id}`);
        load();
    };
    return (
        <div className="section">
            <h2>Admin: Produtos</h2>
            <div className="form" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)', gap: 8
            }}>
                <input className="input" placeholder="Nome" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                <input className="input" placeholder="Preço" value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })} />
                <input className="input" placeholder="Marca" value={form.brand}
                    onChange={e => setForm({ ...form, brand: e.target.value })} />
                <input className="input" placeholder="Categoria" value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })} />
                <input className="input" placeholder="Descrição" value={form.desc}
                    onChange={e => setForm({ ...form, desc: e.target.value })} />
                <button className="btn" onClick={createP}>Criar</button>
            </div>
            <table className="table" style={{ marginTop: 12 }}>
                <thead>
                    <tr><th>ID</th><th>Nome</th><th>Preço</th><th>Categoria</
                    th><th>Ações</th></tr>
                </thead>
                <tbody>
                    {items.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>R$ {Number(p.price).toFixed(2)}</td>
                            <td>{p.category}</td>
                            <td style={{ display: 'flex', gap: 8 }}>
                                <button className="btn secondary" onClick={() => updateP(p.id, {
                                    price: Number(p.price) + 10
                                })}>+R$10</button>
                                <button className="btn" onClick={() => deleteP(p.id)}>Apagar</
                                button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}