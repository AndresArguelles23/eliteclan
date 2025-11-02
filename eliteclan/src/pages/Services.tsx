import { ServiceList } from '../components/ServiceList';
import { useServices } from '../data/hooks';
import '../App.css';

export default function ServicesPage() {
  const services = useServices();
  return (
    <section className="section">
      <div className="site-container" style={{ display: 'grid', gap: '2.5rem' }}>
        <div className="section-header">
          <div className="chip">Servicios</div>
          <h2>Soluciones end-to-end para shows inmersivos</h2>
          <p>
            Desde la visión creativa hasta la operación técnica, habilitamos experiencias memorables con equipos expertos y
            procesos centrados en la audiencia.
          </p>
        </div>
        <ServiceList services={services} />
      </div>
    </section>
  );
}
