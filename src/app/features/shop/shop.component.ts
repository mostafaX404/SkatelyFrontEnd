import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../shared/models/product';
import { ShopService } from '../../core/services/shop.service';
import { MatCardModule } from '@angular/material/card';
import { ProductItemComponent } from "../product-item/product-item.component"; // Import MatCardModule
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ShopParams } from '../../shared/models/shopParams';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [MatCardModule, ProductItemComponent,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    FormsModule

  ], // Use MatCardModule instead of MatCard
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'], // Fix typo from `styleUrl` to `styleUrls`
})
export class ShopComponent implements OnInit {

  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog)
  // products: Product[] = [];
  Products?: Pagination<Product>;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price : Low-High', value: 'priceAsc' },
    { name: 'Price : High-Low', value: 'priceDesc' },
  ]

  shopParams = new ShopParams();
  pageSizeOptions: number[] = [5, 10, 15, 20]
  ngOnInit(): void {
    this.initializeShop()

  }


  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts()
  }


  onSearchChange() {
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }


  getProducts() {

    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => this.Products = response,
      error: err => console.log(err),
      complete: () => { console.log('complete'); }
    });
  }

  handlePageEvent(event: PageEvent) {

    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();

  }


  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  openFilterDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types
      }
    });

    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.getProducts();
        }
      }
    })
  }
}



