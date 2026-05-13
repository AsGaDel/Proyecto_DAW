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

export default function PrivacyPolicy() {
  usePageTitle("Política de Privacidad");
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-10">

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-10">
 
          {/* Cabecera */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Política de Privacidad</h1>
            <p className="text-xs text-gray-400">Última actualización: 1 de mayo de 2026</p>
          </div>

          <Section title="1. Responsable del tratamiento">
            <ul className="list-disc list-inside space-y-1">
              <li><span className="font-medium">Identidad:</span> Omni-Tech S.L.</li>
              <li><span className="font-medium">CIF:</span> B-12345678</li>
              <li><span className="font-medium">Domicilio:</span> Avenida de La Asunción, 12, 38111 Santa Cruz de Tenerife, España</li>
              <li><span className="font-medium">Correo electrónico:</span> privacidad@omni-tech.es</li>
              <li><span className="font-medium">Delegado de Protección de Datos (DPD):</span> dpd@omni-tech.es</li>
            </ul>
          </Section>

          <Section title="2. Datos que recopilamos">
            <p>A través de la Plataforma ARIT recopilamos las siguientes categorías de datos personales:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><span className="font-medium">Datos de registro:</span> nombre completo, nombre de usuario y contraseña cifrada.</li>
              <li><span className="font-medium">Datos de contacto:</span> dirección de correo electrónico.</li>
              <li><span className="font-medium">Datos de uso:</span> incidencias reportadas, comentarios, votos y suscripciones realizadas en la Plataforma.</li>
              <li><span className="font-medium">Datos de ubicación:</span> coordenadas geográficas asociadas a las incidencias reportadas, con el consentimiento expreso del usuario.</li>
              <li><span className="font-medium">Datos técnicos:</span> dirección IP, tipo de dispositivo, navegador y sistema operativo, recabados de forma automática para el correcto funcionamiento de la Plataforma.</li>
            </ul>
          </Section>

          <Section title="3. Finalidad y base jurídica del tratamiento">
            <p>Tratamos sus datos con las siguientes finalidades y bases jurídicas:</p>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700">Finalidad</th>
                    <th className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700">Base jurídica</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Gestión del registro y acceso a la cuenta",             "Ejecución del contrato (Art. 6.1.b RGPD)"],
                    ["Publicación y gestión de incidencias",                  "Ejecución del contrato (Art. 6.1.b RGPD)"],
                    ["Envío de notificaciones relacionadas con la Plataforma","Interés legítimo (Art. 6.1.f RGPD)"],
                    ["Geolocalización de incidencias",                        "Consentimiento del usuario (Art. 6.1.a RGPD)"],
                    ["Cumplimiento de obligaciones legales",                  "Obligación legal (Art. 6.1.c RGPD)"],
                    ["Mejora del servicio y análisis de uso",                 "Interés legítimo (Art. 6.1.f RGPD)"],
                  ].map(([fin, base]) => (
                    <tr key={fin} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-200">{fin}</td>
                      <td className="px-3 py-2 border border-gray-200 text-gray-500">{base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="4. Conservación de los datos">
            <p>Los datos personales se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recabados y mientras el usuario mantenga su cuenta activa en la Plataforma.</p>
            <p>Una vez eliminada la cuenta, los datos serán bloqueados y conservados durante los plazos legalmente establecidos, tras los cuales serán definitivamente suprimidos. Los datos asociados a incidencias podrán conservarse de forma anonimizada con fines estadísticos.</p>
          </Section>

          <Section title="5. Destinatarios y transferencias internacionales">
            <p>Los datos personales no serán cedidos a terceros salvo obligación legal o cuando sea estrictamente necesario para la prestación del servicio. En tal caso, los destinatarios podrán ser:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Administraciones públicas locales, en el marco de la gestión de incidencias urbanas.</li>
              <li>Proveedores tecnológicos (servidores, bases de datos, servicios de correo electrónico) vinculados contractualmente y con garantías adecuadas de protección de datos.</li>
            </ul>
            <p>No se realizan transferencias internacionales de datos fuera del Espacio Económico Europeo.</p>
          </Section>

          <Section title="6. Derechos del usuario">
            <p>El usuario puede ejercer en cualquier momento los siguientes derechos reconocidos por el RGPD y la LOPDGDD:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><span className="font-medium">Acceso:</span> conocer qué datos personales tratamos sobre usted.</li>
              <li><span className="font-medium">Rectificación:</span> solicitar la corrección de datos inexactos o incompletos.</li>
              <li><span className="font-medium">Supresión:</span> solicitar la eliminación de sus datos cuando ya no sean necesarios.</li>
              <li><span className="font-medium">Oposición:</span> oponerse al tratamiento de sus datos en determinadas circunstancias.</li>
              <li><span className="font-medium">Limitación:</span> solicitar la restricción del tratamiento de sus datos.</li>
              <li><span className="font-medium">Portabilidad:</span> recibir sus datos en un formato estructurado y legible por máquina.</li>
              <li><span className="font-medium">Retirada del consentimiento:</span> retirar en cualquier momento el consentimiento prestado, sin que ello afecte a la licitud del tratamiento previo.</li>
            </ul>
            <p className="mt-2">Para ejercer estos derechos, el usuario puede dirigirse a <span className="font-medium">privacidad@omni-tech.es</span>, adjuntando copia de su documento de identidad. Asimismo, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).</p>
          </Section>

          <Section title="7. Seguridad">
            <p>Omni-Tech S.L. ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado, teniendo en cuenta el estado de la tecnología, la naturaleza de los datos y los riesgos a los que están expuestos.</p>
            <p>Las contraseñas se almacenan cifradas mediante algoritmos de hashing seguros y nunca son accesibles en texto plano.</p>
          </Section>
 
          <Section title="8. Cookies">
            <p>La Plataforma utiliza cookies propias y de terceros para garantizar su correcto funcionamiento, analizar el tráfico y mejorar la experiencia del usuario. Para más información sobre las cookies utilizadas y cómo gestionarlas, consulte nuestra <a href="/cookies" className="text-blue-600 cursor-pointer hover:underline">Política de Cookies</a>.</p>
          </Section>
 
          <Section title="9. Modificaciones">
            <p>Omni-Tech S.L. se reserva el derecho a actualizar esta Política de Privacidad para adaptarla a cambios legislativos o modificaciones en la Plataforma. Se notificará al usuario de cualquier cambio relevante a través del correo electrónico registrado o mediante aviso en la propia Plataforma.</p>
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