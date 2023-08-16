import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Product } from "src/app/interfaces/product";
import { Subscription } from 'rxjs';
import { ShopService } from "src/app/services/shop.service";

@Component({
    selector: 'insh-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    id: string = '';
    product: Product | null = null;
    quantity: number = 1;

    constructor(private route: ActivatedRoute, private shopService: ShopService) {

    }

    ngOnInit() {
        this.subscriptions.push(this.route.params.subscribe(params => {
            this.id = params['id'];
        }));

        this.subscriptions.push(this.shopService.product$(this.id).subscribe(product => {
            this.product = product;
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    decrementQuantity() {
        if (this.quantity > 1) {
            this.quantity -= 1;
        }
    }

    incrementQuantity() {
        if (this.product && this.quantity < this.product.quantity) {
            this.quantity += 1;
        }
    }
}
