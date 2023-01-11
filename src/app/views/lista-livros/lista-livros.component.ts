import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, filter, map, of, Subscription, switchMap, tap, throwError } from 'rxjs';
import { Item, Livro, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/services/livro.service';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultados: LivrosResultado;

  constructor(private service: LivroService) { }
  totalDeLivros$ = this.campoBusca.valueChanges
  .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('Fluxo inicial')),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      map(resultado => this.livrosResultados = resultado),
      catchError(erro => {
          console.log(erro)
          return of()
      })
  )
  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(res => res.items),
    map((res) => this.livrosRes(res)),
    catchError(err => {
      console.log('erro')
      return throwError(() => new Error(this.mensagemErro = 'Ops, ocorreu um Erro!'))
    })
    )
  

  livrosRes(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item);
    })
  }

}



