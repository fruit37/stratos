import { Component, Input, OnDestroy } from '@angular/core';

import { IServicePlan } from '../../../core/cf-api-svc.types';
import { CreateServiceInstanceHelperServiceFactory } from '../add-service-instance/create-service-instance-helper-service-factory.service';
import { getServicePlanAccessibilityCardStatus } from '../../../features/service-catalog/services-helper';
import { APIResource } from '../../../store/types/api.types';
import { Observable } from 'rxjs';
import { CardStatus } from '../application-state/application-state.service';
import { map } from 'rxjs/operators';
import { ServicesService } from '../../../features/service-catalog/services.service';

@Component({
  selector: 'app-service-plan-public',
  templateUrl: './service-plan-public.component.html',
  styleUrls: ['./service-plan-public.component.scss']
})
export class ServicePlanPublicComponent implements OnDestroy {

  @Input() servicePlan: IServicePlan;

  // @Input()
  // get dateTime() {
  //   return this.dateTimeValue;
  // }

  // set dateTime(dateTime: moment.Moment) {
  //   const empty = !dateTime && this.dateTimeValue !== dateTime;
  //   const validDate = dateTime && dateTime.isValid() && (!this.dateTimeValue || !dateTime.isSame(this.dateTimeValue));
  //   if (empty || validDate) {
  //     this.dateTimeValue = dateTime;
  //     this.dateTimeChange.emit(this.dateTimeValue);
  //   }
  // }

  isYesOrNo = val => val ? 'yes' : 'no';
  isPublic = (selPlan: IServicePlan) => selPlan.public ? 'yes' : 'no';

  getPlanAccessibility = (servicePlan: APIResource<IServicePlan>): Observable<CardStatus> => {
    return getServicePlanAccessibilityCardStatus(servicePlan, this.servicesService.getServicePlanVisibilities());
  }

  getAccessibilityMessage = (servicePlan: APIResource<IServicePlan>): Observable<string> => {
    return getServicePlanAccessibilityCardStatus(servicePlan, this.servicesService.getServicePlanVisibilities()).pipe(
      map(o => {
        if (o === CardStatus.WARNING) {
          return 'Service Plan has limited visibility';
        } else if (o === CardStatus.ERROR) {
          return 'Service Plan has no visibility';
        }
      })
    );
  }

  getAccessibilityMessage = (servicePlan: APIResource<IServicePlan>): Observable<string> => {

    return this.getPlanAccessibility(servicePlan).pipe(
      map(o => {
        if (o === CardStatus.WARNING) {
          return 'Service Plan has limited visibility';
        } else if (o === CardStatus.ERROR) {
          return 'Service Plan has no visibility';
        }
      })
    );
  }

  constructor(
    private servicesService: ServicesService
  ) {
  }


  ngOnDestroy() {
  }
}
