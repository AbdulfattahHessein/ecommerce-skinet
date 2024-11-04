import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Pagination, Product } from '../../shared/models/product';
import { ProductItemComponent } from './product-item/product-item.component';
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { ShopParams } from '../../shared/models/shop-params';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    FormsModule,
    MatPaginator,
    NgIf,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];
  shopParams = new ShopParams();
  private paginator = inject(MatPaginatorIntl);

  ngOnInit(): void {
    this.paginator.itemsPerPageLabel = 'Products per page';
    this.initializeShop();
  }

  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getAllProducts();
  }

  getAllProducts() {
    this.shopService
      .getProducts(this.shopParams)
      .subscribe((data) => (this.products = data));
  }

  openDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      width: '500px',
      data: {
        selectedTypes: this.shopParams.types,
        selectedBrands: this.shopParams.brands,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe(
        (result: { selectedTypes: string[]; selectedBrands: string[] }) => {
          if (result) {
            this.shopParams.types = result.selectedTypes;
            this.shopParams.brands = result.selectedBrands;
            this.resetPageNumber();
            this.getAllProducts();
          }
        }
      );
  }

  applySort(selectedSort: string) {
    this.shopParams.sort = selectedSort;
    this.resetPageNumber();
    this.getAllProducts();
  }

  onPageChange(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getAllProducts();
  }
  resetPageNumber() {
    this.shopParams.pageNumber = 1;
  }

  onSearchChange() {
    this.resetPageNumber();
    this.getAllProducts();
  }

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // ngAfterViewInit() {
  //   this.paginator._intl.itemsPerPageLabel = 'Products per page';
  //   this.paginator._intl.getRangeLabel = this.getRangeDisplayText;
  // }

  // getRangeDisplayText = (page: number, pageSize: number, length: number) => {
  //   const initialText = `Displaying Products`; // customize this line
  //   if (length == 0 || pageSize == 0) {
  //     return `${initialText} 0 of ${length}`;
  //   }
  //   length = Math.max(length, 0);
  //   const startIndex = page * pageSize;
  //   const endIndex =
  //     startIndex < length
  //       ? Math.min(startIndex + pageSize, length)
  //       : startIndex + pageSize;
  //   return `${initialText} ${startIndex + 1} to ${endIndex} of ${length}`; // customize this line
  // };
}
