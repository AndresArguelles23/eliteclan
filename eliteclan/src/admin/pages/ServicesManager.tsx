import { ServiceList } from '../../components/ServiceList';
import type { Service } from '../../services/api';
import { deleteService, fetchServices, saveService } from '../../services/api';
import { ResourceManager, type FieldDefinition } from '../components/ResourceManager';

const fields: FieldDefinition<Service>[] = [
  { name: 'title', label: 'Título', type: 'text', required: true },
  { name: 'description', label: 'Descripción', type: 'textarea', required: true },
  {
    name: 'features',
    label: 'Características (una por línea)',
    type: 'list',
    helperText: 'Cada línea se convierte en un bullet dentro del listado.',
    required: true,
  },
  { name: 'ctaLabel', label: 'Texto del CTA', type: 'text', required: true },
  { name: 'ctaHref', label: 'URL del CTA', type: 'url', required: true },
  { name: 'status', label: 'Estado', type: 'status' },
];

export default function ServicesManagerPage() {
  return (
    <ResourceManager<Service>
      title="Servicios"
      description="Administra los servicios ofrecidos por EliteClan y controla su publicación en el sitio público."
      fetchItems={fetchServices}
      saveItem={saveService}
      deleteItem={deleteService}
      initialValue={() => ({
        id: '',
        title: '',
        description: '',
        features: [],
        ctaLabel: 'Solicitar info',
        ctaHref: '/contact',
        status: 'draft',
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })}
      fields={fields}
      renderPreview={(item) => <ServiceList services={[item]} />}
    />
  );
}
