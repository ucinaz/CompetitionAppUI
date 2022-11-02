// tslint:disable-next-line: class-name
export class dataResult<dataClass> {
    pageSize: number = 50;
    page: number = 1;
    itemCount: number = 0;
    totalItemCount: number = 0;
    items: dataClass[] = [];
}

// tslint:disable-next-line: class-name
export class serviceResponse<dataClass> {
    success: boolean = false;
    httpCode: number = 0;
    code: number = 0;
    message: string = '';
    internalMessage: string = '';
    data: dataResult<dataClass>;
    public constructor() {
        this.data = new dataResult<dataClass>();
    }

}