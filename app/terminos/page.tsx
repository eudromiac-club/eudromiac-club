import type { Metadata } from 'next';
import { LegalShell } from '@/components/legal/legal-shell';
import { LEGAL_ENTITY as E } from '@/lib/legal/entity';

export const metadata: Metadata = {
  title: 'Términos y Condiciones · EUDROMIA CLUB',
  description:
    'Términos y condiciones de uso de EUDROMIA CLUB — club de socios pacientes en el marco de la Ley 27.350 de uso medicinal de la planta de cannabis.',
};

export default function TerminosPage() {
  return (
    <LegalShell
      eyebrow="Marco legal"
      title="Términos y Condiciones"
      sibling={{ href: '/privacidad', label: 'Leer la Política de Privacidad' }}
    >
      <p>
        Los presentes Términos y Condiciones (en adelante, los <strong>“Términos”</strong>) regulan
        el acceso y la utilización del sitio web {E.url} y de los servicios ofrecidos por{' '}
        <strong>{E.name}</strong> (CUIT {E.cuit}), con domicilio en {E.domicilioLegal}, que opera
        bajo el nombre de fantasía <strong>{E.brand}</strong> (en adelante, indistintamente, “el
        Club”, “la Fundación”, “nosotros”).
      </p>
      <p>
        El acceso al sitio y/o la creación de una cuenta de socio implican la aceptación plena, sin
        reservas, de estos Términos y de la{' '}
        <a href="/privacidad">Política de Privacidad</a>, que forma parte integrante de los mismos.
        Si no estás de acuerdo con alguno de sus puntos, te pedimos que no utilices el sitio ni los
        servicios.
      </p>

      <h2>1. Naturaleza del servicio y marco legal</h2>
      <p>
        {E.brand} es un espacio privado de socios pacientes que se desarrolla en el marco de la{' '}
        <strong>Ley N.º 27.350</strong> de “Investigación médica y científica del uso medicinal de
        la planta de cannabis y sus derivados”, su Decreto Reglamentario N.º 883/2020 y las normas
        complementarias que regulan el <strong>REPROCANN</strong> (Registro del Programa de Cannabis
        del Ministerio de Salud de la Nación).
      </p>
      <p>
        El Club tiene una finalidad <strong>exclusivamente medicinal, terapéutica y de
        acompañamiento</strong> entre pacientes registrados. <strong>No se trata de comercio o
        promoción de uso recreativo</strong>, ni de una oferta abierta al público general. El acceso
        es restringido, nominal y sujeto a la verificación de los requisitos descriptos en estos
        Términos.
      </p>
      <p>
        Las contribuciones que realizan los socios tienen por objeto sostener los costos asociados al
        cultivo, conservación, logística y funcionamiento del Club, conforme a su naturaleza de
        entidad sin fines de lucro.
      </p>

      <h2>2. Requisitos para ser socio</h2>
      <p>Para registrarse y operar como socio es condición necesaria y excluyente:</p>
      <ul>
        <li>
          Ser <strong>mayor de 18 años</strong>. El sitio incluye una verificación de edad; declarar
          una edad falsa habilita la baja inmediata de la cuenta.
        </li>
        <li>
          Contar con una <strong>autorización REPROCANN vigente</strong> a tu nombre, o encontrarte
          en proceso de tramitarla y haberlo informado al momento del registro. El Club puede
          requerir, revisar y conservar la documentación que lo acredite.
        </li>
        <li>
          Aportar <strong>datos veraces, completos y actualizados</strong> (identidad, DNI, fecha de
          nacimiento, contacto y domicilio de entrega). El socio es responsable de la veracidad de la
          información que carga.
        </li>
        <li>Aceptar estos Términos y la Política de Privacidad.</li>
      </ul>
      <p>
        El Club se reserva el derecho de aprobar, rechazar, suspender o dar de baja una solicitud o
        cuenta cuando no se cumplan los requisitos, cuando la documentación esté vencida o sea
        inconsistente, o ante un uso indebido de la plataforma, sin que ello genere derecho a
        indemnización alguna.
      </p>

      <h2>3. REPROCANN y uso medicinal</h2>
      <p>
        El socio declara conocer y aceptar que el acceso a las genéticas y productos del Club está
        condicionado a su condición de paciente registrado. <strong>Es responsabilidad exclusiva del
        socio</strong> mantener vigente su autorización REPROCANN, respetar el cultivo y la tenencia
        dentro de los límites que dicha autorización le confiere, y dar a los productos un uso
        personal, medicinal e intransferible.
      </p>
      <p>
        El Club <strong>no presta servicios de diagnóstico médico</strong> ni reemplaza la consulta
        con profesionales de la salud. La información disponible en el sitio (descripciones de
        genéticas, perfiles, contenidos sobre bienestar) tiene carácter informativo y no constituye
        consejo, prescripción ni indicación médica. Ante cualquier duda sobre tu tratamiento,
        consultá a tu equipo médico.
      </p>

      <h2>4. Cuenta de socio y seguridad</h2>
      <p>
        El acceso se realiza mediante una cuenta personal protegida por contraseña. El socio es
        responsable de la confidencialidad de sus credenciales y de toda actividad realizada con su
        cuenta. Debe notificarnos de inmediato ante cualquier uso no autorizado. La cuenta es
        personal e intransferible; está prohibido cederla, compartirla o permitir su uso por
        terceros.
      </p>

      <h2>5. Aportes, precios y disponibilidad</h2>
      <ul>
        <li>
          Los valores se expresan en <strong>pesos argentinos (ARS)</strong> e incluyen los
          impuestos que correspondan, salvo indicación en contrario.
        </li>
        <li>
          El Club puede modificar valores, genéticas disponibles y stock en cualquier momento. El
          valor aplicable a un pedido es el vigente al momento de confirmarlo.
        </li>
        <li>
          La disponibilidad está sujeta a stock real. Puede aplicarse un{' '}
          <strong>límite máximo por pedido</strong> por genética y un{' '}
          <strong>cupo mensual de consumo</strong> acorde a la autorización del socio. Si un pedido
          supera el cupo o el stock, el Club podrá ajustarlo o cancelarlo, informándolo al socio.
        </li>
        <li>
          El Club podrá ofrecer cupones o beneficios promocionales, sujetos a sus propias condiciones
          de vigencia y uso, y revocables sin previo aviso.
        </li>
      </ul>

      <h2>6. Medios de pago</h2>
      <p>El Club acepta los siguientes medios, según se habiliten en el sitio:</p>
      <ul>
        <li>
          <strong>MercadoPago</strong> (Checkout Pro). El pago se procesa en el entorno de Mercado
          Pago, sujeto a sus propios términos y políticas. El Club no almacena los datos completos de
          tarjetas ni medios de pago.
        </li>
        <li>
          <strong>Efectivo contra entrega</strong>, cuando esté disponible. El pedido queda pendiente
          hasta que se efectiviza el cobro en el momento de la entrega.
        </li>
      </ul>
      <p>
        Los montos, totales y estados de pago se <strong>validan del lado del servidor</strong>. El
        Club se reserva el derecho de no confirmar un pedido ante inconsistencias en el pago,
        sospechas de fraude o falta de verificación del socio.
      </p>

      <h2>7. Envíos y entregas</h2>
      <p>
        La entrega se realiza únicamente a domicilio, dentro de las zonas que el Club habilite, al
        domicilio que el socio indica en el checkout. Es responsabilidad del socio cargar una
        dirección correcta y completa, y elegir un horario de entrega preferido cuando se solicite.
      </p>
      <p>
        Los plazos de entrega son estimados y pueden variar por factores logísticos ajenos al Club.
        Cuando el envío se realiza a través de un transportista, se podrá informar el medio y el
        número de seguimiento. El riesgo se transmite al socio con la recepción del pedido en el
        domicilio indicado.
      </p>

      <h2>8. Derecho de revocación (botón de arrepentimiento)</h2>
      <p>
        Conforme al artículo 34 de la <strong>Ley N.º 24.240 de Defensa del Consumidor</strong> y a
        la Resolución N.º 424/2020 de la entonces Secretaría de Comercio Interior, el socio que opera
        a distancia puede <strong>revocar la aceptación dentro de los 10 (diez) días corridos</strong>{' '}
        contados a partir de la entrega, sin necesidad de expresar motivo y sin penalidad,
        notificándolo a {E.emailContacto}.
      </p>
      <p>
        Este derecho no resulta aplicable, entre otros supuestos previstos por la normativa, a los
        productos que por su naturaleza no puedan ser devueltos, que puedan deteriorarse con rapidez,
        o que por razones de salubridad e higiene hayan sido abiertos o desprecintados luego de la
        entrega. Para ejercer la revocación, el producto debe estar sin uso y en las mismas
        condiciones en que fue recibido.
      </p>

      <h2>9. Cancelaciones y devoluciones</h2>
      <p>
        El socio puede solicitar la cancelación de un pedido mientras no haya sido despachado,
        escribiendo a {E.emailContacto}. Una vez en preparación o en tránsito, la cancelación queda
        sujeta a evaluación. Las devoluciones por producto defectuoso o error en el pedido se
        gestionan conforme a la Ley de Defensa del Consumidor; en esos casos el Club repondrá el
        producto o reintegrará el aporte, según corresponda.
      </p>

      <h2>10. Conducta del socio y usos prohibidos</h2>
      <p>El socio se obliga a no:</p>
      <ul>
        <li>
          Revender, ceder, transferir o entregar a terceros, a título oneroso o gratuito, los
          productos obtenidos a través del Club.
        </li>
        <li>Facilitar el acceso a menores de edad o a personas sin autorización REPROCANN.</li>
        <li>
          Utilizar el sitio con fines ilícitos, fraudulentos o contrarios a la Ley N.º 27.350 y su
          reglamentación.
        </li>
        <li>
          Vulnerar la seguridad del sitio, intentar accesos no autorizados, extraer datos de forma
          automatizada o interferir con su funcionamiento.
        </li>
        <li>Publicar o transmitir contenido falso, ofensivo o que infrinja derechos de terceros.</li>
      </ul>
      <p>
        El incumplimiento habilita al Club a suspender o dar de baja la cuenta y, de corresponder, a
        efectuar las denuncias pertinentes ante las autoridades competentes.
      </p>

      <h2>11. Propiedad intelectual</h2>
      <p>
        Todos los contenidos del sitio —marca, logotipo, textos, imágenes, videos, diseño y
        software— son propiedad de la Fundación o de sus licenciantes y están protegidos por la
        legislación de propiedad intelectual. Queda prohibida su reproducción, distribución o uso
        comercial sin autorización previa y por escrito.
      </p>

      <h2>12. Disponibilidad del servicio y limitación de responsabilidad</h2>
      <p>
        El Club procura mantener el sitio disponible y seguro, pero no garantiza la ausencia de
        interrupciones, errores o demoras derivadas de mantenimiento, fallas técnicas o causas de
        fuerza mayor. En la máxima medida permitida por la ley aplicable, el Club no será responsable
        por daños indirectos o lucro cesante derivados del uso o la imposibilidad de uso del sitio.
        Nada en estos Términos limita los derechos que la Ley de Defensa del Consumidor reconoce al
        socio.
      </p>

      <h2>13. Protección de datos personales</h2>
      <p>
        El tratamiento de los datos personales de los socios, incluidos los <strong>datos sensibles
        de salud</strong> vinculados al REPROCANN, se rige por la{' '}
        <a href="/privacidad">Política de Privacidad</a> y por la Ley N.º 25.326 de Protección de los
        Datos Personales.
      </p>

      <h2>14. Modificaciones</h2>
      <p>
        El Club puede actualizar estos Términos en cualquier momento. Los cambios rigen desde su
        publicación en el sitio, con indicación de la fecha de última actualización. El uso
        continuado del sitio luego de una modificación implica su aceptación.
      </p>

      <h2>15. Ley aplicable y jurisdicción</h2>
      <p>
        Estos Términos se rigen por las leyes de la República Argentina. Para toda controversia será
        competente la justicia ordinaria con asiento en {E.jurisdiccion}, sin perjuicio de la
        jurisdicción que la Ley de Defensa del Consumidor reconozca al socio en su carácter de
        consumidor. El consumidor puede asimismo iniciar su reclamo ante la autoridad de aplicación
        en materia de defensa del consumidor o a través del Servicio de Conciliación Previa en las
        Relaciones de Consumo (COPREC), cuando corresponda.
      </p>

      <h2>16. Contacto</h2>
      <p>
        Por consultas sobre estos Términos podés escribirnos a{' '}
        <a href={`mailto:${E.emailContacto}`}>{E.emailContacto}</a>. Entidad responsable:{' '}
        {E.name}, CUIT {E.cuit}, domicilio en {E.domicilioLegal}.
      </p>
    </LegalShell>
  );
}
