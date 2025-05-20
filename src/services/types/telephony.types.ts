type RelationItem<K extends string> = {
  type: "in" | "out";
  key: K;
  value: string;
};

export type SipTrunk<K extends string> = {
  type?: "friend" | "peer" | "user";
  host: string;
  port: number;
  context: string;
  relations: RelationItem<K>[];
};

export type SipUser<K extends string> = {
  type?: "friend" | "peer" | "user";
  username: string;
  callerId: string;
  context: string;
  relations: RelationItem<K>[];
};

export type SipTrunkMap<Key extends string> = Map<string, SipTrunk<Key>>;

export type SipUserMap<Key extends string> = Map<string, SipUser<Key>>;
