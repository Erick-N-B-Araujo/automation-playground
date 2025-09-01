import { useState } from 'react';
import { http } from '../api';
export default function Recover() {
    const [email, setEmail] = useState('');
    const submit = async () => {
        const r = await http.post('/auth/recover', { email });
        alert(r.data.message);
    };
    return (
        <div className="section">
            <h2>Recuperar senha</h2>
            <div className="form">
                <input className="input" placeholder="Email" value={email}
                    onChange={e => setEmail(e.target.value)} />
                <button className="btn" onClick={submit}>Enviar</button>
            </div>
        </div>
    );
}