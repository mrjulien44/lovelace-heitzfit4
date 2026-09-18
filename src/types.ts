export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  locale?: { language?: string };
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface Heitzfit4Activity {
  id: number | string;
  activity: string;
  start: string;
  end: string;
  placesMax: number;
  placesTaken: number;
  idActivity?: number | string;
  room: string;
  duration?: number;
  deleted?: boolean;
  booked: boolean;
}

export type Planning = Record<string, Heitzfit4Activity[]>;

export interface CardConfig {
  type: string;
  entity: string;
  days?: number;
  only_booked?: boolean;
  show_actions?: boolean;
  logo?: string;
  title?: string;
  language?: "auto" | "fr" | "en";
}
