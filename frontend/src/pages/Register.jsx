import { useState } from 'react';
import { http } from '../api';
export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const submit = async () => {
        try {
            const r = await http.post('/auth/register', {
                username, email,
                password
            });
            alert(r.data.message || 'Registrado!');
        } catch (e) {
            alert(e.response?.data?.message || 'Erro ao registrar');
        }
    };
    return (
        <div className="section">
            <h2>Criar conta</h2>
            <div className="form">
                <input className="input" placeholder="Usuário" value={username}
                    onChange={e => setUsername(e.target.value)} />
                <input className="input" placeholder="Email" value={email}
                    onChange={e => setEmail(e.target.value)} />
                <input className="input" type="password" placeholder="Senha"
                    value={password} onChange={e => setPassword(e.target.value)} />
                <button className="btn" onClick={submit}>Cadastrar</button>
                <div className="alert">Teste cenários: falta de email, duplicidade,
                    mensagens de erro.</div>
            </div>
        </div>
    );
}