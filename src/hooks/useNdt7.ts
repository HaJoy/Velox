import { useState } from "react";
import ndt7 from "@m-lab/ndt7";
import type {
  ClientMeasurementMsg,
  LastClientMeasurement,
  LastServerMeasurement,
  ServerMeasurementMsg
} from "@/types/ndt7";
import {
  isClientMeasurementMsg,
  isCompleteMsg,
  isLastClientMeasurement,
  isLastServerMeasurement, isNdt7Message,
  isServerMeasurementMsg
} from "@/guards/ndt7.guard";

/**
 * Utiliza la API de NDT7 (M-lab) para realizar una prueba de velocidad de red.
 * @returns Resultado de la prueba
 */
export const useNdt7 = () => {

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
        // Muestra un log cuando la medicion de descarga comience
        downloadStart: function () {
          console.log('Initializing download speed measurement...');
        },
        // Medir velocidad de descarga
        downloadMeasurement: function (data: ClientMeasurementMsg) {
          if (isNdt7Message(data)) {
            // Este if va separado ya que en cada medicion hay respuestas
            // que no necesariamente son del cliente, no afectan la medicion.
            if (isClientMeasurementMsg(data)) {
              const msg = data.Data?.MeanClientMbps ?? 0;
              setDownloadSpeed(msg.toFixed(2) + ' Mb/s');
            }
          } else {
            console.error('The client response was not an object in this sample.');
          }
        },
        // Tomar la ultima medicion realizada al completar el test
        downloadComplete: function (data: LastClientMeasurement) {
          // Si la siguiente condicion no se cumple, el resultado que se mostrara
          // en pantalla sera el mismo que la ultima medicion de downloadMeasurment
          // que es el mismo que LastClientMeasurement, por lo que no hay problemas.
          if (isCompleteMsg(data) && isLastClientMeasurement(data.LastClientMeasurement)) {
              const clientGoodPut = data.LastClientMeasurement.MeanClientMbps;
              setDownloadSpeed(clientGoodPut?.toFixed(2) + ' Mb/s');
          } else {
            console.warn('The last measurement could not be found when completing the test. Using the last measurement during-test to prevent \'undefined\'');
          }
          console.log('Download speed measurement completed.')
        },
        
        // Mostrar un log cuando la medicion de subida comience
        uploadStart: function () {
          console.log('Initializing upload speed measurement...')
        },
        // Medir velocidad de subida
        uploadMeasurement: function (data: ServerMeasurementMsg) {
          if (isNdt7Message(data)) {
            if (isServerMeasurementMsg(data)) {
              const measurementData = data.Data.TCPInfo;
              setUploadSpeed(
                ((measurementData.BytesReceived / measurementData.ElapsedTime) * 8)
                .toFixed(2) + ' Mb/s'
              );
            }
          } else {
            console.error('The server response was not an object in this sample.')
          }
        },
        // Tomar la ultima medicion realizada al completar el test.
        uploadComplete: function (data: LastServerMeasurement) {
          // Evitar bug undefined en UI
          if (isCompleteMsg(data) && isLastServerMeasurement(data.LastServerMeasurement)) {
            const msg = data.LastServerMeasurement.TCPInfo;
            const bytesReceived = msg ? msg.BytesReceived : 0;
            const elapsed = msg ? msg.ElapsedTime : 0;
            const throughput = elapsed > 0 ? (bytesReceived * 8) / elapsed : 0;
            setUploadSpeed(throughput.toFixed(2) + ' Mb/s');
          } else {
            // Si el if no se cumple, avisar.
            // No altera la medicion, el valor retornado por esta funcion es el mismo
            // que el ultimo valor de uploadMeasurement.
            console.warn('The last measurement could not be found when completing the test. Using the last measurement during-test to prevent \'undefined\'');
          }
          console.log('Upload speed measurement completed.');
        },
        error: function (err: Error) {
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
  return { downloadSpeed, uploadSpeed, complete, testTime, startTest };
}
