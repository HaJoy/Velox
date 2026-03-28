/**
 * Types for messages emitted by @m-lab/ndt7 workers (download / upload).
 * Keep these conservative (optional fields) because messages vary by MsgType/Source.
 */

export type TCPInfo = {
  BytesReceived: number;     // bytes
  ElapsedTime: number;       // seconds
  MinRTT: number;
  [key: string]: unknown;
};

export type ClientData = {
  MeanClientMbps?: number;
  TCPInfo?: TCPInfo;
  [key: string]: unknown;
};

export type LastClientMeasurement = {
  MeanClientMbps?: number;
  [key: string]: unknown;
};

export type LastServerMeasurement = {
  TCPInfo?: TCPInfo;
  [key: string]: unknown;
};

export type CompleteMsg = {
  LastClientMeasurement: LastClientMeasurement;
  LastServerMeasurement: LastServerMeasurement;
};

/** Generic base for messages */
export interface BaseNdt7Msg {
  MsgType?: string;
  Test?: string;
  Source?: string;
  [key: string]: unknown;
}

/** Message emitted by the client side (e.g. periodic client measurements) */
export interface ClientMeasurementMsg extends BaseNdt7Msg {
  Source: "client";
  Data?: ClientData;
  LastClientMeasurement?: LastClientMeasurement;
}

/** Message emitted by the server side (e.g. server-side TCP info) */
export interface ServerMeasurementMsg extends BaseNdt7Msg {
  Source: "server";
  Data: {
    TCPInfo: TCPInfo;
    [key: string]: unknown;
  };
  LastServerMeasurement?: LastServerMeasurement;
};

/** Union of possible messages received in callbacks */
export type Ndt7Message =
  | ClientMeasurementMsg
  | ServerMeasurementMsg
  | CompleteMsg
  | BaseNdt7Msg;