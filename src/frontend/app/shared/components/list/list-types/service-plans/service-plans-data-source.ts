import { Store } from '@ngrx/store';

import { IServicePlan } from '../../../../../core/cf-api-svc.types';
import { getRowMetadata } from '../../../../../features/cloud-foundry/cf.helpers';
import { GetServicePlansForService } from '../../../../../store/actions/service.actions';
import { AppState } from '../../../../../store/app-state';
import { entityFactory, serviceInstancesSchemaKey, servicePlanSchemaKey } from '../../../../../store/helpers/entity-factory';
import { createEntityRelationPaginationKey } from '../../../../../store/helpers/entity-relations/entity-relations.types';
import { APIResource } from '../../../../../store/types/api.types';
import { ListDataSource } from '../../data-sources-controllers/list-data-source';
import { IListConfig } from '../../list.component.types';

export class ServicePlansDataSource extends ListDataSource<APIResource<IServicePlan>> {
  constructor(cfGuid: string, serviceGuid: string, store: Store<AppState>, listConfig: IListConfig<APIResource>) {



    const paginationKey = createEntityRelationPaginationKey(serviceInstancesSchemaKey, serviceGuid);
    const action = new GetServicePlansForService(serviceGuid, cfGuid, paginationKey, []);

    super({
      store,
      action,
      schema: entityFactory(servicePlanSchemaKey),
      getRowUniqueId: getRowMetadata,
      paginationKey,
      isLocal: true,
      transformEntities: [
        // (entities: APIResource[], paginationState: PaginationEntityState) => {
        //   return entities.filter(e => e.entity.service_guid === serviceGuid);
        // }
      ],
      listConfig
    });
  }
}
