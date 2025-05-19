import { Sip, SipMap } from "../types/telephony.types";

export const loadSip = async (settings: string[]): Promise<SipMap> => {
  const sipMap: SipMap = new Map<string, Sip[]>();

  /*for (const url of settings) {
    const authorLibrary = await parseBooks(url);
    const { authorId, books } = authorLibrary;
    booksMap.set(authorId, books);
  }*/

  return sipMap;
};
