// Datos de la entidad usados en los documentos legales (/terminos y /privacidad)
// y en el footer. Los campos marcados con [COMPLETAR: ...] tiene que llenarlos
// el cliente con datos reales antes de salir a producción — ver la lista al
// final de esta sesión en .claude/HANDOFF.md.
//
// IMPORTANTE: estos documentos son un borrador completo y a medida del proyecto,
// pero NO reemplazan el asesoramiento de un abogado/a matriculado/a. Por tratarse
// de un club de cannabis medicinal (datos de salud = datos sensibles, Ley 25.326)
// se recomienda revisión legal profesional antes de publicarlos.

export const LEGAL_ENTITY = {
  /** Razón social de la entidad responsable. */
  name: 'Fundación Argentina California 2030',
  /** Nombre de fantasía / marca del sitio. */
  brand: 'EUDROMIA CLUB',
  /** Dominio público del sitio. */
  domain: 'eudromiac-club.vercel.app',
  url: 'https://eudromiac-club.vercel.app',

  /** Datos registrales — COMPLETAR con la información real de la Fundación. */
  cuit: '[COMPLETAR: CUIT de la Fundación]',
  domicilioLegal: '[COMPLETAR: domicilio legal de la Fundación]',

  /** Contacto general y canal para ejercer derechos sobre datos personales. */
  emailContacto: '[COMPLETAR: email de contacto]',
  emailPrivacidad: '[COMPLETAR: email para datos personales / privacidad]',
  telefono: '[COMPLETAR: teléfono de contacto (opcional)]',

  /** Jurisdicción aplicable para Defensa del Consumidor / tribunales. */
  jurisdiccion: '[COMPLETAR: ciudad y provincia de jurisdicción]',

  /** Fecha de la última actualización de los documentos (versión del texto). */
  ultimaActualizacion: '2 de junio de 2026',
} as const;
