import { Max, Min } from "class-validator";

export enum ORDER_OPTIONS {
    ASC = 'ASC',
    DESC = 'DESC'
}

export class PageOptionsDto {
    @Min(1)
    readonly pageNumber?: number = 1;
    @Min(1)
    @Max(50)
    readonly pageSize?: number = 10;
    readonly order?: ORDER_OPTIONS = ORDER_OPTIONS.ASC;
}
