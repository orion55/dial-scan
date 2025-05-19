type SingleField<K extends string> = K extends K ? { [P in K]: string } : never;

type Relations<InKey extends string, OutKey extends string> = {
  incoming: SingleField<InKey>[];
  outgoing: SingleField<OutKey>[];
};

export type SipTrunk<InKey extends string, OutKey extends string> = {
  type?: "friend" | "peer" | "user";
  host: string;
  port: number;
  context: string;
  relations: Relations<InKey, OutKey>;
};

export type SipUser<InKey extends string, OutKey extends string> = {
  type?: "friend" | "peer" | "user";
  username: string;
  callerId: string;
  context: string;
  relations: Relations<InKey, OutKey>;
};

export type SipTrunkMap<InKey extends string, OutKey extends string> = Map<
  string,
  SipTrunk<InKey, OutKey>
>;

export type SipUserMap<InKey extends string, OutKey extends string> = Map<
  string,
  SipUser<InKey, OutKey>
>;
