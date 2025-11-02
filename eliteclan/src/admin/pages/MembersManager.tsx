import type { Member } from '../../services/api';
import { deleteMember, fetchMembers, saveMember } from '../../services/api';
import { ResourceManager, type FieldDefinition } from '../components/ResourceManager';

const fields: FieldDefinition<Member>[] = [
  { name: 'title', label: 'Nombre', type: 'text', required: true },
  { name: 'role', label: 'Rol', type: 'text', required: true },
  { name: 'bio', label: 'Biografía', type: 'textarea', required: true },
  { name: 'avatar', label: 'Avatar URL', type: 'url' },
  { name: 'status', label: 'Estado', type: 'status' },
];

export default function MembersManagerPage() {
  return (
    <ResourceManager<Member>
      title="Integrantes"
      description="Administra el equipo creativo y técnico del colectivo."
      fetchItems={fetchMembers}
      saveItem={saveMember}
      deleteItem={deleteMember}
      initialValue={() => ({
        id: '',
        title: '',
        role: '',
        bio: '',
        avatar: '',
        social: [],
        status: 'draft',
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })}
      fields={fields}
      renderPreview={(item) => <MemberPreview member={item} />}
    />
  );
}

function MemberPreview({ member }: { member: Member }) {
  return (
    <article className="card" style={{ display: 'grid', gap: '1rem', textAlign: 'center' }}>
      {member.avatar && (
        <img
          src={member.avatar}
          alt={member.title}
          style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', justifySelf: 'center' }}
        />
      )}
      <div>
        <h3 style={{ marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>{member.title}</h3>
        <span style={{ color: 'var(--color-text-muted)' }}>{member.role}</span>
      </div>
      <p style={{ color: 'var(--color-text-muted)' }}>{member.bio}</p>
    </article>
  );
}
