import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';
import { SortButtonsState } from './components/SortButtons';

export type Ticket = {
    id: string,
    title: string,
    content: string,
    creationTime: number,
    userEmail: string,
    labels?: string[],
    hide?: boolean,
    showLess?: boolean;
}

export type ApiClient = {
    getTickets: (pageNumber: number,sortField:SortButtonsState,searchWord:string) => Promise<Ticket[]>;
    postTicket: (ticket: Ticket) => Promise<Boolean>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (pageNumber:number, sortField: SortButtonsState,searchWord:string) => {
            return axios.get(`${APIRootPath}?page=${pageNumber}&sortBy=${sortField && sortField.name}&desc=${sortField &&  !sortField.isAscending}&superSearch=${searchWord}`,{}).then((res) => res.data);
        },
        postTicket: (ticket: Ticket) =>{
            return axios.post(`${APIRootPath}`,ticket);
        }
    }
}