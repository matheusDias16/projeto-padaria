import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComandasAbertas } from '../model/comanda/comandas-abertas';
import { Produtos } from '../model/produtos/produtos';

@Injectable({
  providedIn: 'root'
})
export class GeralService {

  constructor(private http: HttpClient) { }
  readonly urlDaApi: string = 'http://localhost:3000';

 
  // Pega todas as comandas
  getTodasComandas(): Observable<ComandasAbertas[]> {
    return this.http.get<ComandasAbertas[]>(`${this.urlDaApi}/comandasAbertas`)
  }
  // Pega comanda por id
  getComandaPorId(idDaComanda: number): Observable<ComandasAbertas> {
    return this.http.get<ComandasAbertas>(`${this.urlDaApi}/comandasAbertas/${idDaComanda}`)
  }
  // Criar nova comanda
  postCriarComanda(novaComanda: ComandasAbertas): Observable<ComandasAbertas>{
    return this.http.post<ComandasAbertas>(`${this.urlDaApi}/comandasAbertas`, novaComanda)
  }
  // Edita comanda por id
  putEditaComanda(comandaAlterada: ComandasAbertas): Observable<ComandasAbertas>{
    return this.http.put<ComandasAbertas>(`${this.urlDaApi}/comandasAbertas/${comandaAlterada.id}`, comandaAlterada)
  }
  //Deleta a comanda por id
  deleteComanda(idDaComanda:number):Observable<ComandasAbertas>{
    return this.http.delete<ComandasAbertas>(`${this.urlDaApi}/comandasAbertas/${idDaComanda}`)
  }

  // Pega todos os produtos
  getTodosProdutos(): Observable<Produtos[]>{
    return this.http.get<Produtos[]>(`${this.urlDaApi}/produtos`)
  }
  getProdutoPorId(idDoProduto: number): Observable<Produtos[]>{
    return this.http.get<Produtos[]>(`${this.urlDaApi}/produtos/${idDoProduto}`)
  }
 
}
