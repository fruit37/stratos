import { APIResource } from '../store/types/api.types';
import { IApp, IOrganization, ISpace } from './cf-api.types';
import { StringLiteral } from 'typescript';

export interface ILastOperation {
  type: string;
  state: string;
  description: string;
  updated_at: string;
  created_at: string;
}

export interface IServiceBinding {
  app_guid: string;
  service_instance_guid: string;
  credentials: any;
  binding_options: any;
  gateway_data?: any;
  gateway_name: string;
  syslog_drain_url?: any;
  volume_mounts: any[];
  app_url: string;
  app?: APIResource<IApp>;
  service_instance_url: string;
  service_instance?: APIResource<IServiceInstance>;
  guid?: string;
  cfGuid?: string;
}

export interface IServiceInstance {
  guid?: string;
  cfGuid?: string;
  name?: string;
  credentials?: any;
  service_plan_guid: string;
  space_guid: string;
  gateway_data?: any;
  dashboard_url: string;
  type: string;
  last_operation?: ILastOperation;
  tags?: string[];
  service_guid: string;
  space_url?: string;
  space?: APIResource<ISpace>;
  service_plan_url: string;
  service_plan?: APIResource<IServicePlan>;
  service_bindings_url: string;
  service_bindings?: APIResource<IServiceBinding>[];
  service_keys_url: string;
  routes_url: string;
  service_url: string;
  service?: APIResource<IService>;
}

export interface IServicePlan {
  name: string;
  free: boolean;
  description: string;
  service_guid: string;
  extra: string; // stringified IServiceExtra
  extraTyped?: IServicePlanExtra; // TODO: RC Populate
  unique_id: string;
  public: boolean;
  bindable: number | boolean;
  active: boolean;
  service_url: string;
  service_instances_url: string;
  service?: APIResource<IService>;
  guid?: string;
  cfGuid?: string;
}

export interface IServicePlanExtra {
  displayName: string;
  bullets: string[];
  costs: IServicePlanCost[];
}

export interface IServicePlanCost {
  amount: {
    [key: string]: number;
  };
  unit: string;
}
export interface IService {
  label: string;
  description: string;
  active: number | boolean;
  bindable: number | boolean;
  unique_id: string;
  extra: string; // stringified IServiceExtra object
  tags: string[];
  requires: string[];
  service_broker_guid: string;
  plan_updateable: number | boolean;
  service_plans_url: string;
  service_plans: APIResource<IServicePlan>[];
  cfGuid?: string;
  guid?: string;
  // deprecated properties
  provider?: string;
  url?: string;
  long_description?: string;
  version?: string;
  info_url?: string;
  documentation_url?: string;

}

export interface IServiceExtra {
  displayName: string;
  imageUrl: string;
  longDescription: string;
  providerDisplayName: string;
  documentationUrl: string;
  supportUrl: string;
}
export interface IServicePlanVisibility {
  service_plan_guid: string;
  organization_guid: string;
  service_plan_url?: string;
  organization_url?: string;
  organization?: APIResource<IOrganization>;
  service_plan?: APIResource<IServicePlan>;
}

export interface IServiceBroker {
  name: string;
  broker_url: string;
  auth_username: string;
  space_guid?: string;
  guid?: string;
  cfGuid?: string;
}
