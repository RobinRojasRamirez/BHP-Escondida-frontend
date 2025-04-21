import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './UI/pages/index-instructions/index-instructions.component'
      ).then((m) => m.IndexInstructionsComponent),
  },
  {
    path: 'create',
    data: {
      slug: 'create',
      title: 'Configurar instructivo',
      breadcrumb_children: {
        icon: 'fi-rr-edit',
        label: 'Crear',
      },
    },
    loadComponent: () =>
      import('./UI/pages/form-instructions/form-instructions.component').then(
        (m) => m.FormInstructionsComponent
      ),
  },
  {
    path: 'edit/:id',
    data: {
      slug: 'edit',
      title: 'Editar instructivo',
      breadcrumb_children: {
        icon: 'fi-rr-edit',
        label: 'Editar',
      },
    },
    loadComponent: () =>
      import('./UI/pages/form-instructions/form-instructions.component').then(
        (m) => m.FormInstructionsComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructionsRoutingModule {}