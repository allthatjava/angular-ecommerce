export class PageProduct {

    content:{id:string,
        sku:string,
        name:string,
        description:string,
        unitPrice:number,
        imageUrl:string,
        active:boolean,
        unitsInStock:number,
        dateCreated:Date,
        lastUpdated:Date}[];
    
    pageable:{pageNumber:number,
        pageSize:number,
        size:number
    }

    totalElements:number
}
