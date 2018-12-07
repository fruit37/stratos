import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IServicePlan } from '../../../../../core/cf-api-svc.types';
import { CurrentUserPermissionsService } from '../../../../../core/current-user-permissions.service';
import { getServicePlanName } from '../../../../../features/service-catalog/services-helper';
import { ListView } from '../../../../../store/actions/list.actions';
import { AppState } from '../../../../../store/app-state';
import { APIResource } from '../../../../../store/types/api.types';
import { ServiceActionHelperService } from '../../../../data-services/service-action-helper.service';
import { IListDataSource } from '../../data-sources-controllers/list-data-source-types';
import { ITableColumn } from '../../list-table/table.types';
import { defaultPaginationPageSizeOptionsTable, IListConfig, ListViewTypes } from '../../list.component.types';
import { ServicePlansDataSource } from './service-plans-data-source';
import { ServicesService } from '../../../../../features/service-catalog/services.service';

/**
 * Service instance list shown for `service / service instances` component
 *
 * @export
 * @class ServicePlansListConfigService
 */
@Injectable()
export class ServicePlansListConfigService implements IListConfig<APIResource<IServicePlan>> {

  viewType = ListViewTypes.TABLE_ONLY;
  pageSizeOptions = defaultPaginationPageSizeOptionsTable;
  dataSource: IListDataSource<APIResource<IServicePlan>>;
  defaultView = 'table' as ListView;
  text = {
    title: null,
    filter: null,
    noEntries: 'There are no service plans'
  };


  protected columns: ITableColumn<APIResource<IServicePlan>>[] = [
    {
      columnId: 'name',
      headerCell: () => 'Name',
      cellDefinition: {
        getValue: (row) => getServicePlanName(row.entity)
      },
      cellFlex: '2'
    },
    {
      columnId: 'description',
      headerCell: () => 'Description',
      cellDefinition: {
        valuePath: 'entity.description'
      },
      cellFlex: '1'
    },
    // {
    //   columnId: 'public',
    //   headerCell: () => 'Public',
    //   cellComponent: TableCellServiceNameComponent,
    //   cellFlex: '1'
    // },
    // {
    //   columnId: 'Cost',
    //   headerCell: () => 'Cost',
    //   cellComponent: TableCellServicePlanComponent,
    //   cellFlex: '1'
    // },
    // {
    //   columnId: 'addInfo',
    //   headerCell: () => 'Additional Information',
    //   cellComponent: TableCellServiceInstanceTagsComponent,
    //   cellFlex: '2'
    // },
    // {
    //   columnId: 'creation', headerCell: () => 'Creation Date',
    //   cellDefinition: {
    //     getValue: (row: APIResource) => `${this.datePipe.transform(row.metadata.created_at, 'medium')}`
    //   },
    //   sort: {
    //     type: 'sort',
    //     orderKey: 'creation',
    //     field: 'metadata.created_at'
    //   },
    //   cellFlex: '2'
    // },
  ];


  constructor(
    protected store: Store<AppState>,
    protected datePipe: DatePipe,
    protected currentUserPermissionsService: CurrentUserPermissionsService,
    private servicesService: ServicesService,
    private serviceActionHelperService: ServiceActionHelperService
  ) {
    this.dataSource = new ServicePlansDataSource(servicesService.cfGuid, servicesService.serviceGuid, store, this);
  }


  getGlobalActions = () => [];
  getMultiActions = () => [];
  getSingleActions = () => [];
  getMultiFiltersConfigs = () => [];
  getColumns = () => this.columns;
  getDataSource = () => this.dataSource;
}
