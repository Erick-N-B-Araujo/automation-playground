import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
export default function Header({ onSearch, user, onLogout }) {
    const [term, setTerm] = useState('');
    const nav = useNavigate();
    return (
        <header className="header">
            <div className="container header-top">
                <Link to="/" className="logo">Automation Playground</Link>
                <div className="search">
                    <input placeholder="Busque por produtos" value={term}
                        onChange={e => setTerm(e.target.value)} />
                    <button onClick={() => onSearch?.(term)}>Buscar</button>
                </div>
                <nav>
                    {user ? (
                        <>
                            <Link to="/cart" className="btn secondary">Carrinho</Link>
                            <Link to="/profile" className="btn secondary" style={{
                                marginLeft:
                                    8
                            }}>Minha Conta</Link>
                            <button className="btn" style={{ marginLeft: 8 }} onClick={() => {
                                onLogout?.(); nav('/');
                            }}>Sair</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn secondary">Entrar</Link>
                            <Link to="/register" className="btn" style={{ marginLeft: 8 }}
                            >Cadastrar</Link>
                        </>
                    )}
                </nav>
            </div>
            <div className="nav">
                <div className="container">
                    <ul>
                        <li><Link to="/?category=TVs">TVs</Link></li>
                        <li><Link to="/?category=Notebooks">Notebooks</Link></li>
                        <li><Link to="/?category=Acessórios">Acessórios</Link></li>
                        <li><Link to="/admin">Admin</Link></li>
                    </ul>
                </div>
            </div>
        </header>
    );
}