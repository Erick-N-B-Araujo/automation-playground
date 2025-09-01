import { Link } from 'react-router-dom';
export default function Breadcrumbs({ items = [] }) {
    return (
        <div className="breadcrumbs">
            {items.map((it, i) => (
                <span key={i}>
                    {i > 0 && ' / '}
                    {it.to ? <Link to={it.to}>{it.label}</Link> : it.label}
                </span>
            ))}
        </div>
    );
}