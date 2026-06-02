import type { Metadata } from 'next';
import { LegalShell } from '@/components/legal/legal-shell';
import { LEGAL_ENTITY as E } from '@/lib/legal/entity';

export const metadata: Metadata = {
  title: 'Política de Privacidad · EUDROMIA CLUB',
  description:
    'Cómo EUDROMIA CLUB recolecta, usa y protege tus datos personales, incluidos los datos sensibles de salud, conforme a la Ley 25.326 de Protección de Datos Personales.',
};

export default function PrivacidadPage() {
  return (
    <LegalShell
      eyebrow="Tus datos"
      title="Política de Privacidad"
      sibling={{ href: '/terminos', label: 'Leer los Términos y Condiciones' }}
    >
      <p>
        En <strong>{E.brand}</strong> ({E.name}) tu privacidad es una prioridad. Por la naturaleza
        medicinal del Club tratamos <strong>datos sensibles de salud</strong>, por lo que aplicamos
        un cuidado especial. Esta Política explica qué datos recolectamos, con qué finalidad, con
        quién los compartimos y cómo podés ejercer tus derechos, conforme a la{' '}
        <strong>Ley N.º 25.326 de Protección de los Datos Personales</strong>, su Decreto
        Reglamentario N.º 1558/2001 y las normas de la Agencia de Acceso a la Información Pública
        (AAIP).
      </p>

      <h2>1. Responsable de la base de datos</h2>
      <p>
        El responsable del tratamiento de tus datos es <strong>{E.name}</strong>, CUIT {E.cuit}, con
        domicilio en {E.domicilioLegal}. Para cualquier cuestión vinculada a tus datos personales
        podés escribir a <a href={`mailto:${E.emailPrivacidad}`}>{E.emailPrivacidad}</a>.
      </p>

      <h2>2. Qué datos recolectamos</h2>
      <p>Según tu interacción con el sitio, podemos tratar las siguientes categorías de datos:</p>
      <ul>
        <li>
          <strong>Datos de identificación y contacto:</strong> nombre y apellido, DNI, fecha de
          nacimiento, correo electrónico y teléfono.
        </li>
        <li>
          <strong>Datos sensibles de salud:</strong> número de autorización REPROCANN, su fecha de
          vencimiento, datos del profesional tratante (nombre, matrícula, provincia) y el documento
          de la autorización que subas. Estos son <strong>datos sensibles</strong> en los términos
          del art. 2 de la Ley 25.326 y reciben un tratamiento reforzado (ver punto 3).
        </li>
        <li>
          <strong>Datos de los pedidos y entrega:</strong> domicilio de envío, destinatario, horario
          de entrega preferido, historial de pedidos y de consumo mensual.
        </li>
        <li>
          <strong>Datos de pago:</strong> los pagos con tarjeta o medios electrónicos se procesan a
          través de Mercado Pago. <strong>No almacenamos los datos completos de tu tarjeta;</strong>{' '}
          conservamos identificadores de la operación (por ejemplo, número de pedido y de pago) para
          la trazabilidad.
        </li>
        <li>
          <strong>Datos de uso y técnicos:</strong> datos de navegación, dirección IP y cookies
          necesarias para el funcionamiento del sitio (ver punto 9).
        </li>
        <li>
          <strong>Leads / interesados:</strong> si dejás tus datos en el formulario de Experiencias,
          tratamos tu nombre, email y teléfono con el único fin de contactarte.
        </li>
      </ul>

      <h2>3. Tratamiento de los datos sensibles de salud</h2>
      <p>
        Los datos vinculados al REPROCANN se recolectan con tu <strong>consentimiento expreso</strong>
        y con la única finalidad de verificar tu condición de paciente y habilitar tu acceso al Club,
        conforme a la Ley 27.350. Se tratan con estricta confidencialidad, con acceso restringido al
        personal autorizado, y <strong>no se ceden a terceros</strong> salvo obligación legal o
        requerimiento de autoridad competente. Podés solicitar su supresión cuando dejes de ser
        socio, sin perjuicio de los plazos de conservación legalmente exigibles.
      </p>

      <h2>4. Para qué usamos tus datos</h2>
      <ul>
        <li>Verificar tu identidad, tu edad y tu autorización REPROCANN.</li>
        <li>Crear y administrar tu cuenta de socio y gestionar el flujo de aprobación.</li>
        <li>Procesar pedidos, pagos, envíos y el control de cupo mensual.</li>
        <li>Enviarte comunicaciones operativas (bienvenida, estado del pedido, despacho, avisos).</li>
        <li>Brindar soporte y responder tus consultas.</li>
        <li>Cumplir obligaciones legales, contables y regulatorias, y prevenir fraudes.</li>
        <li>Mejorar la seguridad y el funcionamiento del sitio.</li>
      </ul>
      <p>
        No utilizamos tus datos para finalidades distintas de las informadas ni los comercializamos.
        No tomamos decisiones automatizadas que produzcan efectos jurídicos sobre vos sin
        intervención humana.
      </p>

      <h2>5. Base legal del tratamiento</h2>
      <p>
        El tratamiento se sustenta en tu consentimiento (especialmente para los datos sensibles), en
        la ejecución de la relación de socio, en el cumplimiento de obligaciones legales y en el
        interés legítimo del Club para operar y dar seguridad al servicio, en los términos de la Ley
        25.326.
      </p>

      <h2>6. Con quién compartimos tus datos</h2>
      <p>
        No vendemos tus datos. Los compartimos únicamente con prestadores que actúan como{' '}
        <strong>encargados de tratamiento</strong> por nuestra cuenta y bajo confidencialidad, en la
        medida necesaria para prestar el servicio:
      </p>
      <ul>
        <li>
          <strong>Mercado Pago</strong> — procesamiento de pagos.
        </li>
        <li>
          <strong>Vercel</strong> — alojamiento del sitio y almacenamiento de los documentos que
          subís (Vercel Blob).
        </li>
        <li>
          <strong>Proveedor de base de datos en la nube</strong> — almacenamiento de la información
          de la plataforma.
        </li>
        <li>
          <strong>Resend</strong> — envío de los correos transaccionales.
        </li>
        <li>
          <strong>Transportistas / servicios de logística</strong> — solo los datos necesarios para
          concretar la entrega.
        </li>
      </ul>
      <p>
        También podremos divulgar datos cuando lo exija una ley, una orden judicial o un
        requerimiento de autoridad competente.
      </p>

      <h2>7. Transferencia internacional de datos</h2>
      <p>
        Algunos de los prestadores mencionados pueden almacenar o procesar datos en servidores
        ubicados fuera de la República Argentina. En esos casos adoptamos los recaudos exigidos por
        el art. 12 de la Ley 25.326 para garantizar un nivel adecuado de protección de tus datos.
      </p>

      <h2>8. Conservación de los datos</h2>
      <p>
        Conservamos tus datos mientras mantengas tu cuenta de socio y, luego de su baja, durante el
        plazo necesario para cumplir obligaciones legales, contables e impositivas o para atender
        eventuales reclamos. Cumplidos esos plazos, los datos se suprimen o anonimizan de forma
        segura.
      </p>

      <h2>9. Cookies y tecnologías similares</h2>
      <p>
        Utilizamos cookies estrictamente necesarias para el funcionamiento del sitio, entre ellas:
      </p>
      <ul>
        <li>Cookie de sesión para mantener tu inicio de sesión seguro.</li>
        <li>Cookie de verificación de edad (+18).</li>
        <li>Cookie para recordar un cupón aplicado en tu carrito.</li>
      </ul>
      <p>
        El proceso de pago en Mercado Pago puede instalar sus propias cookies, regidas por la
        política de privacidad de ese servicio. Podés gestionar o bloquear las cookies desde la
        configuración de tu navegador, teniendo en cuenta que ello puede afectar el funcionamiento
        del sitio.
      </p>

      <h2>10. Seguridad de la información</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger tus datos: las
        contraseñas se almacenan cifradas (hash), las conexiones viajan sobre canales seguros (HTTPS),
        el acceso a los datos sensibles está restringido y los pagos se validan del lado del
        servidor. Ningún sistema es 100% infalible, pero trabajamos para minimizar los riesgos y
        actuar con rapidez ante cualquier incidente.
      </p>

      <h2>11. Tus derechos como titular de los datos</h2>
      <p>
        Tenés derecho a <strong>acceder, rectificar, actualizar y suprimir</strong> tus datos
        personales, así como a oponerte a determinados tratamientos, en los términos de los arts. 14
        a 16 de la Ley 25.326. Para ejercerlos, escribinos a{' '}
        <a href={`mailto:${E.emailPrivacidad}`}>{E.emailPrivacidad}</a> acreditando tu identidad.
        Responderemos dentro de los plazos legales.
      </p>
      <p>
        <strong>
          El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los
          mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un
          interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley
          N.º 25.326.
        </strong>
      </p>
      <p>
        <strong>
          La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la
          Ley N.º 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan
          quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en
          materia de protección de datos personales.
        </strong>
      </p>

      <h2>12. Menores de edad</h2>
      <p>
        El sitio y los servicios están dirigidos exclusivamente a personas mayores de 18 años. No
        recolectamos de forma consciente datos de menores. Si detectamos que se cargaron datos de un
        menor, los eliminaremos.
      </p>

      <h2>13. Cambios en esta Política</h2>
      <p>
        Podemos actualizar esta Política para reflejar cambios legales o en nuestros procesos. La
        versión vigente es la publicada en esta página, con su fecha de última actualización. Si los
        cambios son sustanciales, procuraremos comunicártelo por los medios disponibles.
      </p>

      <h2>14. Contacto</h2>
      <p>
        Por cualquier consulta sobre el tratamiento de tus datos personales podés escribir a{' '}
        <a href={`mailto:${E.emailPrivacidad}`}>{E.emailPrivacidad}</a>. Responsable: {E.name}, CUIT{' '}
        {E.cuit}, domicilio en {E.domicilioLegal}.
      </p>
    </LegalShell>
  );
}
