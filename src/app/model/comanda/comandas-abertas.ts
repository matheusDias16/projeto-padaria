import { ProdutoComanda } from "./produtos"

export class ComandasAbertas {
    public id : number
    public produtos : ProdutoComanda[]

    constructor(){
        this.id = 0
        this.produtos = []
    }

}
