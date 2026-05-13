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

export default function CookiePolicy() {
  usePageTitle("Política de Cookies");
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-10">

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-10">

          {/* Cabecera */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Política de Cookies</h1>
            <p className="text-xs text-gray-400">Última actualización: 1 de mayo de 2026</p>
          </div>

          <Section title="1. ¿Qué son las cookies?">
            <p>
              Una cookie es un pequeño fichero de texto que se almacena en su navegador cuando visita casi cualquier página web. Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página.
            </p>
            <p>
              Las cookies suelen almacenar información de carácter técnico, preferencias personales, personalización de contenidos, estadísticas de uso, enlaces a redes sociales, acceso a cuentas de usuario, etc.
            </p>
          </Section>

          <Section title="2. Tipos de cookies utilizadas">
            <p>Siguiendo las directrices de la Agencia Española de Protección de Datos, procedemos a detallar el uso de cookies que hace esta Plataforma:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <span className="font-medium">Cookies técnicas:</span> Son las más elementales y permiten, entre otras cosas, saber cuándo está navegando un humano o una aplicación automatizada, o cuándo navega un usuario anónimo y uno registrado. Son tareas básicas para el funcionamiento de <span className="italic font-medium">ARIT</span>.
              </li>
              <li>
                <span className="font-medium">Cookies de personalización:</span> Permiten al usuario acceder al servicio con algunas características de carácter general predefinidas (como el idioma o la configuración del mapa).
              </li>
              <li>
                <span className="font-medium">Cookies de análisis:</span> Son aquellas que, tratadas por nosotros o por terceros, permiten cuantificar el número de usuarios y realizar la medición y análisis estadístico de la utilización que hacen los usuarios de la plataforma.
              </li>
            </ul>
          </Section>

          <Section title="3. Cookies de terceros">
            <p>
              Esta Plataforma utiliza servicios de terceros que pueden instalar cookies para mejorar la experiencia de usuario. Entre ellos:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <span className="font-medium">Mapas (OpenStreetMap/Leaflet):</span> Se utilizan para la visualización y geolocalización de las incidencias reportadas.
              </li>
              <li>
                <span className="font-medium">Análisis:</span> Podemos utilizar herramientas como Google Analytics para entender cómo los ciudadanos interactúan con la aplicación y mejorar su rendimiento.
              </li>
            </ul>
          </Section>

          <Section title="4. Desactivación o eliminación de cookies">
            <p>
              En cualquier momento podrá ejercer su derecho de desactivación o eliminación de cookies de este sitio web. Estas acciones se realizan de forma diferente en función del navegador que esté usando:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Configuración de cookies para <span className="font-medium">Google Chrome</span>.</li>
              <li>Configuración de cookies para <span className="font-medium">Mozilla Firefox</span>.</li>
              <li>Configuración de cookies para <span className="font-medium">Apple Safari</span>.</li>
              <li>Configuración de cookies para <span className="font-medium">Microsoft Edge</span>.</li>
            </ul>
            <p className="mt-2 italic text-xs text-gray-500">
              Nota: La desactivación de las cookies técnicas puede afectar al correcto funcionamiento de las herramientas de reporte de incidencias de ARIT.
            </p>
          </Section>

          <Section title="5. Consentimiento">
            <p>
              Omni-Tech S.L. solicita su consentimiento para el uso de cookies no esenciales mediante un banner informativo al acceder por primera vez a la Plataforma. El usuario puede aceptar todas las cookies, rechazarlas o configurar sus preferencias.
            </p>
          </Section>

          <Section title="6. Notas adicionales">
            <p>
              Ni esta web ni sus representantes legales se hacen responsables ni del contenido ni de la veracidad de las políticas de privacidad que puedan tener los terceros mencionados en esta política de cookies.
            </p>
            <p>
              Los navegadores web son las herramientas encargadas de almacenar las cookies y desde este lugar debe efectuar su derecho a la eliminación o desactivación de las mismas.
            </p>
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