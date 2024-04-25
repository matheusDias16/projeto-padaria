import { Component, OnInit } from '@angular/core';
import { GeralService } from 'src/app/service/geral.service';
import { ComandasAbertas } from 'src/app/model/comanda/comandas-abertas';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProdutoComanda } from 'src/app/model/comanda/produtos';
import { Produtos } from 'src/app/model/produtos/produtos';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-fechar-comanda',
  templateUrl: './fechar-comanda.component.html',
  styleUrls: ['./fechar-comanda.component.scss']
})
export class FecharComandaComponent implements OnInit {
  arrayComandas: ComandasAbertas = new ComandasAbertas()
  idComandaSelecionada: number = 0;
  idDaUrl: number = 0
  arrayProdutos: Produtos[] = []


  constructor(
    private api: GeralService,
    private rotaAtiva: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.idDaUrl = Number(this.rotaAtiva.snapshot.params['id'])
    this.getComandas()
    this.getProdutos()
  }

  getComandas(): void {
    this.api.getComandaPorId(this.idDaUrl).subscribe((resp) => {
      this.arrayComandas = resp
    })
  }

  getProdutos(): void {
    this.api.getTodosProdutos().subscribe((resp) => {
      this.arrayProdutos = resp
    })
  }
  findProduto(id: number): any {
    let prod = this.arrayProdutos.find((obj) => obj.id == id)
    if (prod) {
      return prod
    } else {
      return ''
    }
  }
  precoTotal(): number {
    let preco = 0
    for (let item of this.arrayComandas.produtos) {
      preco += (this.findProduto(item.idProduto).preco * item.quantidade
      )
    }
    return preco
  }
  fechaComanda(): void {
    Swal.fire({
     title:"Fechar comanda",
     icon:"warning",
     confirmButtonText:"sim",
     denyButtonText:"não",
     showDenyButton: true
     

    }).then(resultado => {
      console.log(resultado)
      if(resultado.value){
        this.api.deleteComanda(this.idDaUrl).subscribe((resp) => {
          Swal.fire('Comanda fechada!!!').then(()=>{
            location.href = "http://localhost:4200"
          })
          
           })
      }
    })
    
  }
}

