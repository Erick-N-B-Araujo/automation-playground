import { useMemo, useState } from 'react';
import Stepper from '../components/Stepper';
import { http } from '../api';
import { useNavigate } from 'react-router-dom';
export default function Checkout() {
    const [step, setStep] = useState(0);
    const [address, setAddress] = useState('');
    const [payment, setPayment] = useState('credit');
    const nav = useNavigate();
    const steps = useMemo(() => ['Endereço', 'Pagamento', 'Confirmação'], []);
    const confirm = async () => {
        const r = await http.post('/checkout', { address, payment });
        nav('/profile', { state: { orderId: r.data.order.id } });
    };
    return (
        <div className="section">
            <h2>Checkout</h2>
            <Stepper steps={steps} active={step} />
            {step === 0 && (
                <div className="form">
                    <input className="input" placeholder="Endereço completo"
                        value={address} onChange={e => setAddress(e.target.value)} />
                    <button className="btn" onClick={() => setStep(1)}>Continuar</button>
                </div>
            )}
            {step === 1 && (
                <div className="form">
                    <select className="input" value={payment}
                        onChange={e => setPayment(e.target.value)}>
                        <option value="credit">Cartão de Crédito</option>
                        <option value="pix">PIX</option>
                        <option value="boleto">Boleto</option>
                    </select>
                    <button className="btn" onClick={() => setStep(2)}>Revisar pedido</
                    button>
                </div>
            )}
            {step === 2 && (
                <div>
                    <div className="alert">Revise os dados e confirme.</div>
                    <button className="btn" onClick={confirm}>Confirmar compra</button>
                </div>
            )}
        </div>
    );
}