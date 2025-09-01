import { useState } from 'react';
import { http, setToken } from '../api';
import { Link, useNavigate } from 'react-router-dom';
export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();
    const submit = async () => {
        try {
            const r = await http.post('/auth/login', { username, password });
            localStorage.setItem('token', r.data.token);
            localStorage.setItem('username', r.data.username);
            setToken(r.data.token);
            onLogin?.({ username: r.data.username });
            nav('/');
        } catch {
            alert('Credenciais inválidas');
        }
    };
    return (
        <div className="section">
            <h2>Entrar</h2>
            <div className="form">
                <input className="input" placeholder="Usuário" value={username}
                    onChange={e => setUsername(e.target.value)} />
                <input className="input" type="password" placeholder="Senha"
                    value={password} onChange={e => setPassword(e.target.value)} />
                <button className="btn" onClick={submit}>Login</button>
                <div>
                    <Link to="/recover">Esqueci minha senha</Link>
                </div>
            </div>
        </div>
    );
}