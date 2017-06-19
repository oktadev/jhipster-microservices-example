import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { BlogTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { ProductDetailComponent } from '../../../../../../main/webapp/app/entities/product/product-detail.component';
import { ProductService } from '../../../../../../main/webapp/app/entities/product/product.service';
import { Product } from '../../../../../../main/webapp/app/entities/product/product.model';

describe('Component Tests', () => {

    describe('Product Management Detail Component', () => {
        let comp: ProductDetailComponent;
        let fixture: ComponentFixture<ProductDetailComponent>;
        let service: ProductService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [BlogTestModule],
                declarations: [ProductDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    ProductService,
                    JhiEventManager
                ]
            }).overrideTemplate(ProductDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Product(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.product).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
