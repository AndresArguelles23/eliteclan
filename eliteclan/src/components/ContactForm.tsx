import { type FormEvent, useState } from 'react';
import { CTAButton } from './Button';
import '../App.css';

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
  date: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  company: '',
  message: '',
  date: '',
};

export const ContactForm = () => {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (nextValues: FormState) => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!nextValues.name.trim()) nextErrors.name = 'Ingresa tu nombre.';
    if (!nextValues.email.match(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/)) nextErrors.email = 'Ingresa un correo válido.';
    if (!nextValues.message.trim() || nextValues.message.length < 20)
      nextErrors.message = 'Cuéntanos más sobre tu proyecto (mínimo 20 caracteres).';
    if (!nextValues.date) nextErrors.date = 'Selecciona una fecha tentativa.';
    return nextErrors;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setValues(initialState);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="card"
      style={{ display: 'grid', gap: '1.5rem', background: 'rgba(17,24,39,0.8)' }}
    >
      <div className="section-header" style={{ marginBottom: 0 }}>
        <div className="chip">Booking</div>
        <h2 style={{ fontSize: '2rem' }}>Agenda tu próximo show</h2>
        <p>Comparte la visión de tu evento y coordinaremos un kickoff en menos de 24 horas.</p>
      </div>
      <div className="grid" style={{ gap: '1.25rem' }}>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          Nombre completo*
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span id="name-error" role="alert" style={{ color: 'var(--color-warning)' }}>
              {errors.name}
            </span>
          )}
        </label>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          Correo electrónico*
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" role="alert" style={{ color: 'var(--color-warning)' }}>
              {errors.email}
            </span>
          )}
        </label>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          Empresa o colectivo
          <input
            type="text"
            name="company"
            value={values.company}
            onChange={(event) => setValues((prev) => ({ ...prev, company: event.target.value }))}
          />
        </label>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          Fecha tentativa*
          <input
            type="date"
            name="date"
            value={values.date}
            onChange={(event) => setValues((prev) => ({ ...prev, date: event.target.value }))}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {errors.date && (
            <span id="date-error" role="alert" style={{ color: 'var(--color-warning)' }}>
              {errors.date}
            </span>
          )}
        </label>
        <label style={{ display: 'grid', gap: '0.35rem', gridColumn: '1 / -1' }}>
          Cuéntanos sobre la experiencia*
          <textarea
            name="message"
            rows={4}
            value={values.message}
            onChange={(event) => setValues((prev) => ({ ...prev, message: event.target.value }))}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <span id="message-error" role="alert" style={{ color: 'var(--color-warning)' }}>
              {errors.message}
            </span>
          )}
        </label>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <CTAButton type="submit">Enviar briefing</CTAButton>
        <CTAButton href="https://wa.me/5215512345678" target="_blank" rel="noreferrer" variant="secondary">
          WhatsApp directo
        </CTAButton>
        <CTAButton href="mailto:hola@eliteclan.com" variant="secondary">
          Enviar correo
        </CTAButton>
      </div>
      {submitted && (
        <p role="status" style={{ color: 'var(--color-accent)' }}>
          ¡Gracias! Nuestro equipo te contactará muy pronto.
        </p>
      )}
    </form>
  );
};
