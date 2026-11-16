import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { PokeApiService } from '../../services/pokeapi';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.html',
  styleUrl: './buscador.css',
})
export class Buscador implements OnInit {
  private api = inject(PokeApiService);

  readonly cargando = input(false);
  readonly buscar = output<string>();

  readonly texto = signal('');
  readonly sugerencias = signal<string[]>([]);

  async ngOnInit() {
    try {
      this.sugerencias.set(await this.api.getNombres());
    } catch {
      // Las sugerencias son opcionales; el buscador sigue funcionando sin ellas.
    }
  }

  enviar(evento?: Event) {
    evento?.preventDefault();
    const valor = this.texto().trim();
    if (valor) this.buscar.emit(valor);
  }

  aleatorio() {
    const id = Math.floor(Math.random() * 1025) + 1;
    this.texto.set(String(id));
    this.buscar.emit(String(id));
  }
}
