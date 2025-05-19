import { Sip, SipMap, SipTrunk, SipTrunkMap } from "../types/telephony.types";

export const loadSip = async (settings: string[]): Promise<SipMap> => {
  const sipTrunkMap: SipTrunkMap = new Map<string, SipTrunk[]>();

  /*for (const url of settings) {
    const authorLibrary = await parseBooks(url);
    const { authorId, books } = authorLibrary;
    booksMap.set(authorId, books);
  }*/

  return sipTrunkMap;
};
