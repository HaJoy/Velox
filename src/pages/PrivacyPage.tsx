

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  { id: "resumen", label: "Resumen" },
  { id: "datos", label: "Datos recopilados" },
  { id: "ndt7", label: "NDT7 y M-Lab" },
  { id: "uso", label: "Uso y conservación" },
  { id: "derechos", label: "Tus derechos" },
];

export const PrivacyPage = () => {

  return (
    <main className="mx-auto w-full max-w-5xl text-left">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Button variant="ghost" asChild className="-ml-3 gap-2">
          <Link to="/">
            <ArrowLeft aria-hidden="true" />
            Volver al inicio
          </Link>
        </Button>
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Velox / Privacidad</span>
      </div>

      <section className="mb-8 grid gap-6 md:grid-cols-[1fr_220px] md:items-end">
        <div>
          <div className="mb-4 flex items-center gap-2 text-cyan-400">
            <ShieldCheck aria-hidden="true" size={20} />
            <span className="text-sm font-semibold uppercase tracking-widest">Transparencia de datos</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">Política de privacidad</h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">Última actualización: 26 de agosto de 2026. Esta política explica qué información utiliza Velox al medir tu conexión y con qué finalidad.</p>
        </div>
        <div className="border-l-2 border-cyan-400/60 pl-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">En resumen</p>
          <p className="mt-1">Medimos tu conexión, generamos estadísticas y enviamos datos técnicos a los servicios necesarios para ejecutar la prueba.</p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[180px_1fr]">
        <nav aria-label="Contenido de la política" className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">En esta página</p>
          <div className="flex flex-col gap-3 overflow-x-auto pb-2 lg:flex-row lg:block lg:space-y-2 lg:overflow-visible">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="block whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-cyan-400">{section.label}</a>
            ))}
          </div>
        </nav>

        <div className="space-y-6">
          <Card id="resumen" className="scroll-mt-24 border-white/10 bg-[#111116]">
            <CardHeader>
              <CardTitle>1. A qué estás dando consentimiento</CardTitle>
              <CardDescription>El consentimiento es necesario para iniciar una medición.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 leading-7 text-muted-foreground">
              <p>Al aceptar esta política, autorizas a Velox a recopilar y tratar los datos técnicos descritos abajo con fines estadísticos, de análisis del rendimiento de redes y de mejora de la aplicación.</p>
              <p>También reconoces que la prueba utiliza la API NDT7 de Measurement Lab (M-Lab). Durante la prueba, parte de la información puede ser procesada por M-Lab conforme a sus propias condiciones y política de privacidad.</p>
            </CardContent>
          </Card>

          <Card id="datos" className="scroll-mt-24 border-white/10 bg-[#111116]">
            <CardHeader><CardTitle>2. Datos que podemos recopilar</CardTitle></CardHeader>
            <CardContent className="leading-7 text-muted-foreground">
              <ul className="list-disc space-y-2 pl-5">
                <li><strong className="text-foreground">Conexión:</strong> dirección IP pública, proveedor de internet (ISP), país o ubicación aproximada derivada de la IP y datos técnicos de red.</li>
                <li><strong className="text-foreground">Medición:</strong> velocidades de descarga y subida, latencia, RTT, duración, fecha y resultado de la prueba.</li>
                <li><strong className="text-foreground">Cuenta:</strong> si te registras, identificador y correo electrónico necesarios para autenticarte y asociar tu historial. No recopilamos contraseñas en texto plano.</li>
              </ul>
              <p className="mt-4">No solicitamos datos sensibles ni utilizamos la información para publicidad personalizada, venta de perfiles o decisiones automatizadas.</p>
            </CardContent>
          </Card>

          <Card id="ndt7" className="scroll-mt-24 border-white/10 bg-[#111116]">
            <CardHeader><CardTitle>3. NDT7 y Measurement Lab</CardTitle></CardHeader>
            <CardContent className="space-y-4 leading-7 text-muted-foreground">
              <p>Velox integra el protocolo NDT7 para realizar las pruebas de rendimiento. Esta tecnología es proporcionada por M-Lab, una organización independiente que recopila datos de mediciones para investigación pública sobre Internet.</p>
              <p>Al ejecutar una prueba, aceptas también las condiciones aplicables de M-Lab. Consulta su documentación directamente para conocer qué datos reciben, cómo los publican y cuánto tiempo los conservan:</p>
              <a className="inline-flex items-center gap-2 text-cyan-400 hover:underline" href="https://www.measurementlab.net/privacy/" target="_blank" rel="noreferrer">Política de privacidad de Measurement Lab <ExternalLink aria-hidden="true" size={15} /></a>
            </CardContent>
          </Card>

          <Card id="uso" className="scroll-mt-24 border-white/10 bg-[#111116]">
            <CardHeader><CardTitle>4. Cómo usamos y conservamos los datos</CardTitle></CardHeader>
            <CardContent className="space-y-4 leading-7 text-muted-foreground">
              <p>Usamos los resultados para calcular métricas, mostrar tu historial cuando inicias sesión, detectar errores y elaborar estadísticas agregadas. Limitamos el acceso a la información a los servicios necesarios para estas funciones.</p>
              <p>Conservamos los datos mientras sean necesarios para prestar el servicio o mientras mantengas tu cuenta. Puedes solicitar su eliminación; los datos que M-Lab haya recibido están sujetos a sus propios plazos y controles.</p>
              <p>Aplicamos medidas razonables de seguridad, pero ningún servicio en Internet puede garantizar seguridad absoluta durante la transmisión o el almacenamiento.</p>
            </CardContent>
          </Card>

          <Card id="derechos" className="scroll-mt-24 border-white/10 bg-[#111116]">
            <CardHeader><CardTitle>5. Tus derechos y contacto</CardTitle></CardHeader>
            <CardContent className="space-y-4 leading-7 text-muted-foreground">
              <p>Puedes solicitar acceso, corrección o eliminación de los datos asociados a tu cuenta, así como retirar tu consentimiento. Para hacerlo, contacta al responsable del proyecto a través del canal que se te haya proporcionado.</p>
              <p>Retirar el consentimiento no afecta al tratamiento realizado antes de ese momento, pero impedirá iniciar nuevas mediciones que requieran estos datos.</p>
              <p className="text-sm">Esta política debe adaptarse a la jurisdicción, responsable legal y datos de contacto reales del proyecto antes de publicarse en producción.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};
