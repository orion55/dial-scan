export type SipTrunk = {
  type: string;
  context: string;
  isPattern: boolean;
};

export type SipUser = {
  isPattern: boolean;
  username: string;
  callerid: string;
  context: string;
};

export type SipTrunkMap = Map<string, SipTrunk[]>;
export type SipUserMap = Map<string, SipUser[]>;
