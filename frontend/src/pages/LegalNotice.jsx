import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { usePageTitle } from "../hooks/usePageTitle";

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
        {title}
      </h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function LegalNotice() {
  usePageTitle("Aviso Legal");
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-10">

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-10">

          {/* Cabecera */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Aviso Legal</h1>
            <p className="text-xs text-gray-400">Última actualización: 1 de mayo de 2026</p>
          </div>

          <Section title="1. Datos identificativos">
            <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa de los siguientes datos:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><span className="font-medium">Razón social:</span> Omni-Tech S.L.</li>
              <li><span className="font-medium">CIF:</span> B-12345678</li>
              <li><span className="font-medium">Domicilio social:</span> Avenida de La Asunción, 12, 38111 Santa Cruz de Tenerife, España</li>
              <li><span className="font-medium">Correo electrónico:</span> contacto@omni-tech.es</li>
              <li><span className="font-medium">Teléfono:</span> +34 954 000 000</li>
              <li><span className="font-medium">Registro Mercantil:</span> Inscrita en el Registro Mercantil de Santa Cruz de Tenerife, Tomo 123, Folio 45, Hoja SE-9876</li>
            </ul>
          </Section>

          <Section title="2. Objeto y ámbito de aplicación">
            <p>El presente aviso legal regula el uso del sitio web y la aplicación ARIT (en adelante, "la Plataforma"), titularidad de Omni-Tech S.L., cuyo objeto es facilitar la comunicación y gestión de incidencias urbanas entre ciudadanos y las administraciones locales competentes.</p>
            <p>El acceso y uso de la Plataforma implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este aviso legal, así como en la Política de Privacidad y los Términos y Condiciones de uso.</p>
          </Section>

          <Section title="3. Propiedad intelectual e industrial">
            <p>Todos los contenidos de la Plataforma, incluyendo pero no limitándose a textos, imágenes, gráficos, logotipos, iconos, código fuente, diseño y arquitectura de la aplicación, son propiedad exclusiva de Omni-Tech S.L. o de terceros que han autorizado su uso, y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial.</p>
            <p>Queda expresamente prohibida la reproducción, distribución, comunicación pública o transformación de cualquier elemento de la Plataforma sin autorización expresa y por escrito de Omni-Tech S.L.</p>
          </Section>

          <Section title="4. Condiciones de uso">
            <p>El usuario se compromete a hacer un uso lícito de la Plataforma y a no emplearla para actividades contrarias a la ley, la moral, el orden público o los derechos de terceros. En particular, queda prohibido:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Publicar incidencias falsas o con datos incorrectos de manera deliberada.</li>
              <li>Suplantar la identidad de otros usuarios o de entidades públicas.</li>
              <li>Introducir virus, malware o cualquier otro elemento dañino en la Plataforma.</li>
              <li>Intentar acceder de forma no autorizada a otros cuentas o sistemas.</li>
              <li>Publicar contenidos ofensivos, discriminatorios o que vulneren derechos fundamentales.</li>
            </ul>
          </Section>

          <Section title="5. Responsabilidad">
            <p>Omni-Tech S.L. no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran derivarse del uso incorrecto de la Plataforma, de la veracidad de las incidencias reportadas por los usuarios, ni de las decisiones que las administraciones locales adopten en relación con dichas incidencias.</p>
            <p>Omni-Tech S.L. se reserva el derecho a interrumpir el acceso a la Plataforma en cualquier momento y sin previo aviso por motivos técnicos, de seguridad o de mantenimiento.</p>
          </Section>

          <Section title="6. Protección de datos">
            <p>Los datos personales recabados a través de la Plataforma serán tratados conforme a lo establecido en el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>
            <p>El responsable del tratamiento es Omni-Tech S.L. Para más información sobre cómo tratamos sus datos, puede consultar nuestra <a href="/privacidad" className="text-blue-600 cursor-pointer hover:underline">Política de Privacidad</a>.</p>
          </Section>

          <Section title="7. Legislación aplicable y jurisdicción">
            <p>El presente aviso legal se rige por la legislación española vigente. Para la resolución de cualquier controversia derivada del acceso o uso de la Plataforma, las partes se someten, con renuncia expresa a cualquier otro fuero que pudiera corresponderles, a los Juzgados y Tribunales de la ciudad de Sevilla.</p>
          </Section>

          <Section title="8. Modificaciones">
            <p>Omni-Tech S.L. se reserva el derecho a modificar, en cualquier momento y sin previo aviso, el contenido del presente aviso legal. Se recomienda al usuario revisar periódicamente este documento para estar informado de cualquier cambio.</p>
          </Section>

          {/* Pie */}
          <div className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Omni-Tech S.L. — Todos los derechos reservados.
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}