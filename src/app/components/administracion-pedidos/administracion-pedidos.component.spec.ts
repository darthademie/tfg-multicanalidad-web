import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionPedidosComponent } from './administracion-pedidos.component';

describe('AdministracionPedidosComponent', () => {
  let component: AdministracionPedidosComponent;
  let fixture: ComponentFixture<AdministracionPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministracionPedidosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministracionPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
