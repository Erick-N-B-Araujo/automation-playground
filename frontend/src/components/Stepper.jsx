export default function Stepper({ steps = [], active = 0 }) {
    return (
        <div className="stepper">
            {steps.map((s, i) => (
                <div key={s} className={`step ${i === active ? 'active' : ''}`}>{i + 1}. {s}</
                div>
            ))}
        </div>
    );
}