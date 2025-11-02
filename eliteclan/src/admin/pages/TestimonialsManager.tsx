import { Testimonials } from '../../components/Testimonials';
import type { Testimonial } from '../../services/api';
import { deleteTestimonial, fetchTestimonials, saveTestimonial } from '../../services/api';
import { ResourceManager, type FieldDefinition } from '../components/ResourceManager';

const fields: FieldDefinition<Testimonial>[] = [
  { name: 'title', label: 'Título interno', type: 'text', required: true },
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  { name: 'role', label: 'Cargo', type: 'text' },
  { name: 'company', label: 'Compañía', type: 'text' },
  { name: 'quote', label: 'Cita', type: 'textarea', required: true },
  { name: 'avatar', label: 'Avatar URL', type: 'url' },
  { name: 'status', label: 'Estado', type: 'status' },
];

export default function TestimonialsManagerPage() {
  return (
    <ResourceManager<Testimonial>
      title="Testimonios"
      description="Gestiona testimonios de clientes y aliados."
      fetchItems={fetchTestimonials}
      saveItem={saveTestimonial}
      deleteItem={deleteTestimonial}
      initialValue={() => ({
        id: '',
        title: '',
        name: '',
        role: '',
        company: '',
        quote: '',
        avatar: '',
        status: 'draft',
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })}
      fields={fields}
      renderPreview={(item) => <Testimonials items={[item]} />}
    />
  );
}
