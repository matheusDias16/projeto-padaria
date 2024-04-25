import { Component, OnInit } from '@angular/core';
import { ComandasAbertas } from 'src/app/model/comanda/comandas-abertas';
import { GeralService } from 'src/app/service/geral.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Produtos } from 'src/app/model/produtos/produtos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  arrayComandas: ComandasAbertas[] = [];
  arrayProdutos: Produtos[] = [];
  modalAberto: boolean = false;
  modalAdicionar: boolean = false;
  idComandaSelecionada: number = 0;
  formComanda: FormGroup = new FormGroup({
    idProduto: new FormControl('', Validators.required),
    quantidade: new FormControl('', Validators.required)
  })
  formFechar: FormGroup = new FormGroup({
    numComanda: new FormControl('', Validators.required)
  })

  constructor(
    private api: GeralService,
    private router: Router
  ){}

  ngOnInit(): void{
    this.getProdutos()
    this.getComandas()
  }

  getComandas(): void{
    this.api.getTodasComandas().subscribe((resp) => {
      this.arrayComandas = resp
    })
  }

  getProdutos(): void{
    this.api.getTodosProdutos().subscribe((resp) => {
      this.arrayProdutos = resp
    })
  }

  criarComanda(): void{
    // Acionando um SWAL para o usuário confirmar se quer abrir uma comanda
    Swal.fire({
      title: 'Criar uma nova comanda?', // Define o texto principal
      icon: 'question', // Define o ícone do SWAL
      showDenyButton: true, // Define se o botão de negar sera mostrado
      confirmButtonText: 'Sim!', // Define o texto do botão de confirmar
      denyButtonText: 'Não!' // Define o texto do botão de negar
    }).then((resultado) => { // Uma função para quando uma ação dentro do SWAL for tomada
      console.log(resultado)
      if(resultado.isConfirmed){ // Caso o usuário confirme a criação
        this.api.postCriarComanda(new ComandasAbertas()).subscribe((resp) => {
          this.getComandas()
        })
      }
    })
  }

  fecharModal(): void{
    this.modalAberto = false
  }

  abriModalAdicionar(idComandaClicada: number): void{
    this.idComandaSelecionada = idComandaClicada
    this.modalAberto = true
    this.modalAdicionar = true
  }

  adicionaProduto(): void{
    this.api.getComandaPorId(this.idComandaSelecionada).subscribe((comandaResp) => {
      let comandaModificada = comandaResp

      // Flag (Aviso) que fica true se o produto ja existir na comanda
      let jaTemOProduto = false

      // Checagem se o produto ja existe na comanda
      for(let prod of comandaModificada.produtos){
        if(prod.idProduto == this.formComanda.value.idProduto){
          prod.quantidade += this.formComanda.value.quantidade
          // Se existe muda a Flag para true
          jaTemOProduto = true
        }
      }

      // Checar a Flag, caso for FALSE entra no IF
      if(!jaTemOProduto){
        comandaModificada.produtos.push({
          idProduto: Number(this.formComanda.value.idProduto),
          quantidade: this.formComanda.value.quantidade
        })
      }
      
      this.api.putEditaComanda(comandaModificada).subscribe((resp) => {
        this.getComandas()
        this.modalAberto = false
      })

    })
  }

  abrirModalFecharComanda(): void{
    this.modalAberto = true
    this.modalAdicionar = false
  }

  fecharComanda(): void{
   
    let comandaExiste = false
    
    for(let comanda of this.arrayComandas){

      if(this.formFechar.value.numComanda == comanda.id){
        comandaExiste = true
      }

    }

    // Checa se a comanda NÃO existe
    if(!comandaExiste){
      alert('COMANDA INEXISTENTE')
      this.modalAberto = false
      return
    }

    this.router.navigateByUrl(`fechar/${this.formFechar.value.numComanda}`)
  }
  fecharComandaSwal():void{
    Swal.fire({
      title:"Insira o número da comanda",
      input:"text",
      inputLabel:"digite aqui",

    }).then((resposta) => {
      console.log(resposta)
      let comandaExiste = false
    
      for(let comanda of this.arrayComandas){
  
        if(resposta.value == comanda.id){
          comandaExiste = true
        }
  
      }
      
      if(!comandaExiste){
        Swal.fire('COMANDA INEXISTENTE')
        this.modalAberto = false
        return
      }
  
      this.router.navigateByUrl(`fechar/${resposta.value}`)
    })

  }
  
}