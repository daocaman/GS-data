export class SanPham {

    maSP: string;
    nhom: string;
    khuon: string;
    defaultSize: number;
    minSize: number;
    lop1: string;
    lop2: string;
    lop3: string;

    defaultPrice: number;
    listPrice: Array<any>;

    constructor(data: any) {
        this.maSP = data[0];
        this.nhom = data[1];
        this.khuon = data[2];
        this.defaultSize = data[3];
        this.minSize = data[4];
        this.lop1 = data[5].toLowerCase();
        this.lop1 = this.lop1.charAt(0).toUpperCase() + this.lop1.slice(1);
        this.lop2 = data[6].toLowerCase();
        this.lop2 = this.lop2.charAt(0).toUpperCase() + this.lop2.slice(1);
        this.lop3 = data[7].toLowerCase();
        this.lop3 = this.lop3.charAt(0).toUpperCase() + this.lop3.slice(1);
        this.defaultPrice = data[10];
        this.listPrice = data.slice(11, data.length);
       
    }

    price(size: any) {
        if (size) {
            let result = this.defaultPrice;
            switch (parseInt(size) ) {
                case 11:{
                    result = this.listPrice[0];
                    break;
                }
                case 16:{
                    result = this.listPrice[1];
                    break;
                }
                    
                case 18:{
                    result = this.listPrice[2];
                    break;
                }
                case 20:{
                    result = this.listPrice[3];
                    break;
                }
                case 22:{
                    result = this.listPrice[4];
                    break;
                }
                case 24:{
                    result = this.listPrice[5];
                    break;
                }
                case 26:{
                    result = this.listPrice[6];
                    break;
                }
                case 28:{
                    result = this.listPrice[7];
                    break;
                }
                case 30:{
                    result = this.listPrice[8];
                    break;
                }
            }
            return result;

        } else {
            return this.defaultPrice;
        }
    }
}
