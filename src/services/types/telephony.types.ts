export type SipTrunk = {
  type: string;
  context: string;
  isParent: boolean;
  parent?: string;
};

export type SipUser = {
  username: string;
  callerId: string;
  context: string;
  isParent: boolean;
  parent?: string;
};

export type SipTrunkMap = Map<string, SipTrunk[]>;
export type SipUserMap = Map<string, SipUser[]>;
