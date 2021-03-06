import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Service } from './service.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ServiceService {

    private resourceUrl = SERVER_API_URL + 'api/services';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(service: Service): Observable<Service> {
        const copy = this.convert(service);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(service: Service): Observable<Service> {
        const copy = this.convert(service);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Service> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Service.
     */
    private convertItemFromServer(json: any): Service {
        const entity: Service = Object.assign(new Service(), json);
        entity.startDate = this.dateUtils
            .convertDateTimeFromServer(json.startDate);
        entity.dueDate = this.dateUtils
            .convertDateTimeFromServer(json.dueDate);
        entity.completedDate = this.dateUtils
            .convertDateTimeFromServer(json.completedDate);
        return entity;
    }

    /**
     * Convert a Service to a JSON which can be sent to the server.
     */
    private convert(service: Service): Service {
        const copy: Service = Object.assign({}, service);

        copy.startDate = this.dateUtils.toDate(service.startDate);

        copy.dueDate = this.dateUtils.toDate(service.dueDate);

        copy.completedDate = this.dateUtils.toDate(service.completedDate);
        return copy;
    }
}
