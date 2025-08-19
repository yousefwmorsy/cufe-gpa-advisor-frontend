import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRibbonComponent } from './top-ribbon.component';

describe('TopRibbonComponent', () => {
  let component: TopRibbonComponent;
  let fixture: ComponentFixture<TopRibbonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRibbonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
