/**
 * ----------------------------------------------------
 * Este codigo es solo para referencia, el archivo sera
 * eliminado una vez la app funcione correctamente.
 * 
 * El codigo base fue extraido de Medium para servir
 * como referencia y se le ha agregado tipado y mayor
 * legibilidad, se seguira modificando mientras sirva
 * para pruebas del funcionamiento.
 * 
 * fuente: https://medium.com/@nikhiladigaz/measure-your-internet-speed-programmatically-aad49f3f4738
 * Creditos al autor.
 * ----------------------------------------------------
 */

import { useState } from "react";
import ndt7 from "@m-lab/ndt7";
import { Button } from "@/components/ui/button";
import type { ClientMeasurementMsg, ServerMeasurementMsg } from "@/types/ndt7";

export const RefPage = () => {

  const [downloadSpeed, setDownloadSpeed] = useState<string>('0');
  const [uploadSpeed, setUploadSpeed] = useState<string>('0');
  const [complete, setComplete] = useState<boolean>(true);
  const [testTime, setTestTime] = useState<number>(0);

  const startTest = () => {

    // Reiniciar variables de estado
    setDownloadSpeed('0');
    setUploadSpeed('0');
    setComplete(false);
    setTestTime(0);

    const startTime = Date.now();

    // Proceso de medicion
    ndt7.test(

      // Primer argumento: configuracion inicial del speedtest
      {
        userAcceptedDataPolicy: true,
        downloadworkerfile: '../ndt7-download-worker.min.js',
        uploadworkerfile: '../ndt7-upload-worker.min.js',
        metadata: {
          client_name: 'speedtest-sample',
        }
      },

      // Segundo argumento: objeto con callbacks para cada momento
      // de la medicion
      {
        // Medir velocidad de descarga
        downloadMeasurement: function (data: ClientMeasurementMsg) {
          if (typeof data === "object" && data != null && 'Source' in data) {
            if (data.Source === 'client') {
              console.log('Initiating download measurement...');
              const msg = data.Data?.MeanClientMbps ?? 0;
              setDownloadSpeed(msg.toFixed(2) + ' Mb/s');
            }
          } else {
            console.error('The server response was not an object');
          }
          
        },
        downloadComplete: function (data: ClientMeasurementMsg) {
          console.log('Download measurement finished.')
          const clientGoodPut = data.LastClientMeasurement?.MeanClientMbps;
          setDownloadSpeed(clientGoodPut?.toFixed(2) + ' Mb/s');
        },

        // Medir velocidad de subida
        uploadMeasurement: function (data: ServerMeasurementMsg) {
          if (data.Source === 'server') {
            const measurementData = data.Data.TCPInfo;
            setUploadSpeed(
              ((measurementData.BytesReceived / measurementData.ElapsedTime) * 8)
              .toFixed(2) + ' Mb/s'
            );
          }
        },
        uploadComplete: function (data: ServerMeasurementMsg) {
          console.log('Upload measurement completed.');
          const msg = data.LastServerMeasurement?.TCPInfo;
          const bytesReceived = msg ? msg.BytesReceived : 0;
          const elapsed = msg ? msg.ElapsedTime : 0;
          const throughput = elapsed > 0 ? (bytesReceived * 8) / elapsed : 0;
          setUploadSpeed(throughput.toFixed(2) + ' Mb/s');
        },
        error: function (err:Error) {
          console.log('Error while running upload test: ', err.message);
          setComplete(false);
        }
      },
    )
    .then((exitcode: number) => {
      setTestTime((Date.now() - startTime) / 1000);
      setComplete(true);
    })
  };
  return (
    <div>
      <Button onClick={startTest} disabled={!complete}>
        {complete ? 'Iniciar' : 'Calculando...'}
      </Button>

      <h2>Velocidad de descarga</h2>
      {downloadSpeed || '0 Mb/s'}

      <h2>Velocidad de subida</h2>
      {uploadSpeed || '0 Mb/s'}

      <div className="m-2">
        <h3>Duracion del test</h3>
        {`${testTime || 0} segundos`}
      </div>
    </div>
  )
}
