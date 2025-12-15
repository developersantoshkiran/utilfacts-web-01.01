import { Projects, Users, Services, Groups, Entities, EntityServices, entityServiceRelations, EntityConsumption, bills } from "@/db/schema";

export interface OTPResponse {
  profile: Profile;
  properties?: PropertiesEntity[] | null;
  name?: string
}
export interface Profile {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
}
export interface PropertiesEntity {
  id: string;
  type: string;
  property: string;
  status: string;
  primary: boolean;
  servicesEnabled?: string[] | null;
  consumptions?: ConsumptionsEntity[] | null;
}
export interface ConsumptionsEntity {
  id: string;
  service: string;
  amount: number;
  consumption: number;
  measurement: string;
  currentBillingCycle: string;
  paymentMode: string;
}

export type signUpResponse = {
  id?: string;
  reference?: string;
  expiresInSeconds: number;
};

export type signinResponse = signUpResponse

export type User = typeof Users.$inferSelect;
export type Projects = typeof Projects.$inferSelect;
export type Entities = typeof Entities.$inferSelect;
export type Groups = typeof Groups.$inferSelect;
export type EntityServices = typeof EntityServices.$inferSelect;
export type Services = typeof Services.$inferSelect;
export type entityConsumption = typeof EntityConsumption.$inferSelect;
export type bills = typeof bills.$inferSelect;

type userwithOutProjectAdmins =  Omit<User, "projectAdmins" | "UserEntities">
export type entity = {
  entity: string;
  group: string;
  status: string;
  project: string;
  id: string;
  projectid: string;
  primary: boolean;
  serviceIds?: Array<{id:string, name: string}>;
  ownerShipType: string;
}
export type Session = userwithOutProjectAdmins
  & { admin: Array<Projects>, selectedAdminProject: Projects }
  & {
    entities: Array<entity>,selectedUserEntity?:entity | null
  } | null

