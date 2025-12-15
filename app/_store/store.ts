import { atom } from "jotai";
import { OTPResponse, Profile, PropertiesEntity } from "../_types/types";


export const  userProfileAtom = atom<OTPResponse | null>(null);


