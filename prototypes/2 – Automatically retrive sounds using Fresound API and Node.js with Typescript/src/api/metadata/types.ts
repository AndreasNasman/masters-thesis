export const LIMIT_VALUE_MAXIMUM = 100;
export const LIMIT_VALUE_MINIMUM = 0;
export interface Limit {
  max: number;
  min: number;
}

export interface Filter {
  ac_boominess: Limit;
  ac_brightness: Limit;
  ac_depth: Limit;
  ac_hardness: Limit;
  ac_roughness: Limit;
  ac_sharpness: Limit;
  ac_warmth: Limit;
}

export interface Metadata {
  id: number;
  name: string;
  type: string;
  download: string;
  ac_analysis: {
    ac_tempo_confidence: number;
    ac_note_confidence: number;
    ac_depth: number;
    ac_note_midi: number;
    ac_temporal_centroid: number;
    ac_warmth: number;
    ac_loop: boolean;
    ac_hardness: number;
    ac_loudness: number;
    ac_reverb: boolean;
    ac_roughness: number;
    ac_log_attack_time: number;
    ac_boominess: number;
    ac_note_frequency: number;
    ac_tempo: number;
    ac_brightness: number;
    ac_sharpness: number;
    ac_tonality_confidence: number;
    ac_dynamic_range: number;
    ac_note_name: string;
    ac_tonality: string;
    ac_single_event: boolean;
  };
  pack_name?: string;
}

export interface ResponsePack {
  id: number;
  url: string;
  description: string;
  created: string;
  name: string;
  username: string;
  num_sounds: number;
  sounds: string;
  num_downloads: number;
}

export type ResponsePackSound = Metadata;

export interface ResponsePackSounds {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pick<Metadata, "id">[];
}

export interface ResponseSearch {
  count: number;
  next: string | null;
  previous: string | null;
  results: Metadata[];
}
