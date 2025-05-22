export type RelationSip<K extends string> = {
  type: "in" | "out";
  key: K;
  target: string;
};

export type SipTrunk<K extends string> = {
  type?: string;
  host: string;
  port?: number;
  trunkname?: string;
  context?: string;
  relations: RelationSip<K>[];
};

export type SipUser<K extends string> = {
  type?: string;
  callerid?: string;
  context?: string;
  relations: RelationSip<K>[];
};

export type SipTrunkMap<Key extends string> = Map<string, SipTrunk<Key>>;
export type SipUserMap<Key extends string> = Map<string, SipUser<Key>>;

export type RelationDial<K extends string> = {
  key: K;
  target: string;
  options?: string[];
};

export type DialContext<K extends string> = {
  dial?: string;
  mixMonitor?: boolean;
  include?: string[];
  relations: RelationDial<K>[];
};

export type DialExten<K extends string> = {
  dial?: string;
  mixMonitor?: boolean;
  relations: RelationDial<K>[];
};

export type DialContextMap<Key extends string> = Map<string, DialContext<Key>>;
export type DialExtenMap<Key extends string> = Map<string, DialExten<Key>>;
