# DemoUi

Dieses Repository soll dabei helfen, eine kleine web Applikation mit Angular zu erstellen.

## Voraussetzungen

* Der Befehl **ng version** darf keinen Fehler zurückgeben und sollte so ähnlich aussehen:
  ![ng --version](/docs/ng_version.png)

  Für mehr Informationen: <https://angular.io/cli>

  Falls dieses Kommando in einer PowerShell nicht funktioniert (in einer CMD aber schon): <https://stackoverflow.com/questions/58032631/why-powershell-does-not-run-angular-commands>

* Auch dieser Befehl **git --version** darf keinen Fehler zurückgeben:

  ![git --version](/docs/git_--version.png)

  (<https://git-scm.com/downloads>)

* Visual Studio Code muss installiert sein. (<https://code.visualstudio.com/download>)

## Repository von Github clonen und starten

Um dieses Repository von Github herunterzuladen und dies zu starten, müssen folgende Schritte ausgeführt werden:

1. In einer Konsole (CMD oder PowerShell) in ein Arbeitsverzeichnis navigieren (mit **cd** kann das Verzeichnis gewechselt werden.)

1. Mit `git clone https://github.com/Tharnas/demo-ui.git` kann dieses Repository auf den lokalen Computer heruntergeladen werden. Hierbei wird ein Ordner im aktuellen Verzeichnis mit **demo-ui** erstellt.
Der Link für das Repository findet man, wenn man oben auf die Grüne **Code** Schaltfläche klickt.
![Github Repository Link](/docs/github_repository_link.png)

1. Mit `cd demo-ui` kann in dieses Verzeichnis gewechselt werden.

1. Anschließen kann mit `code .` das Visual Studio Code mit dem aktuellen Verzeichnis gestartet werden.

1. Durch das Kommando `npm install` (oder kurz `npm i`) werden alle benötigten Abhängigkeiten installiert.

1. Mit `ng serve` (oder kurz `ng s`) wird das Angular Projekt gebaut, bereitgestellt und erneut gebaut, wenn Änderungen gemacht werden.

1. Wenn nun im Browser <http://localhost:4200> aufgerufen wird, wird folgende Seite dargestellt:
![http://localhost:4200](/docs/localhost_4200.png)

## Ein neues Projekt aufsetzen

Um ein Angular Projekt zu erstellen, muss folgendes Kommando in einer Konsole (cmd oder PowerShell) ausgeführt werden:

    ng new demo-ui

Dokumentation: <https://angular.io/cli/new>

Bei der Frage, ob Angular routing verwendet werden möchte, kann dies mit `y` bestätigt werden.
Anschließend kann die gewünschte Sprache für Styles ausgewählt werden. Für kleinere Projekte ist `CSS` ausreichen.

Nun wird das Projekt erstellt und alle Abhängigkeiten installiert.

### **Projekt öffnen und ausprobieren**

Um in das Verzeichnis des neu angelegten Projektes zu navigieren, kann `cd demo-ui` eingegeben werden. Mit `code .` wird das Visual Studio Code gestartet.

Mit `ng serve` (oder kurz `ng s`) wird das Angular Projekt gebaut, bereitgestellt und erneut gebaut, wenn Änderungen gemacht werden. Anschließen kann über die URL <http://localhost:4200> im Browser die Seite betrachtet werden.

### **Erste Komponenten erstellen**

Mit einem Klick der rechten Maustaste auf den Ordner **src\app** kann über das Menü **Open in integrated Terminal** ein Terminal in diesem Verzeichnis gestartet werden. Mit folgenden Kommandos werden drei Komponenten (Components) erstellt:

    ng g c start
    ng g c ProductList
    ng g c EditProduct

Dokumentation: <https://angular.io/cli/generate>

### **Routen einrichten**

In **app.component.html** kann der gesamte Inhalt außer der letzten Zeile gelöscht werden. Somit sollte die Datei wie folgt aussehen:

```html
<router-outlet></router-outlet>
```

In **product-list.component.html** kann am Ende ebenfalls Folgendes hinzugefügt werden:

```html
<router-outlet></router-outlet>
```

Routen werden in **app-routing.module.ts** definiert. Hier wird bei `const routes: Routes = [];` folgendes eingefügt:

```typescript
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  {
    path: 'product',
    component: ProductListComponent,
    children: [
      {
        path: ':productId',
        component: EditProductComponent
      }
    ]
  },
  {
    path: '',
    component: StartComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

Nun werden unter folgenden URLs folgende Komponenten dargestellt:

* <http://loocalhost:4200/> --> StartComponent
* <http://loocalhost:4200/product> --> ProductListComponent
* <http://loocalhost:4200/product/1> --> EditProductComponent (zusätzlich zu ProductListComponent)

Somit kann in **app.component.html**

```html
<ul>
  <li><a routerLink="/product">Products</a></li>
  <li><a routerLink="/product/1">Product one</a></li>
  <li><a routerLink="/">Start</a></li>
</ul>
```

über

```html
<router-outlet></router-outlet>
```

eingefügt werden.

### **Eine List mit Produkten darstellen**

Um eine Liste von Produkten darzustellen, muss zuerst eine Klasse für ein Produkt erstellt werden. Hierfür muss in **app** ein neuer Ordner **models** erstellt werden. Darin wird eine neue Datei mit **product.model.ts** mit folgendem Inhalt eingefügt:

```typescript
export class Product {
    public id: number = -1;
    public name: string = "";
    public description: string = "";
    public price?: number;
}
```

Jetzt kann in **product-list.component.ts** eine Liste mit Produkten erstellt werden:

```typescript
import { Component } from '@angular/core';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  public products: Product[] = [
    {
      id: 1,
      name: "first",
      description: "this is my first product."
    },
    {
      id: 2,
      name: "second",
      description: "this is my second product."
    },
  ];

  public constructor() { }
}
```

Die **product-list.component.html** kann wie folgt angepasst werden und die List der Produkte darzustellen:

```html
<h1>Products</h1>

<ul>
    <li *ngFor="let product of products">
        <a [routerLink]="['/product', product.id]">{{product.name}} - {{product.description}}</a>
    </li>
</ul>

<router-outlet></router-outlet>
```

### **Produkte vom Server laden**

Um die Liste an Produkten nicht hardcodieren zu müssen, können diese über ein API von einem Server geladen werden.

Hierfür wird ein weiteres Modul benötigt, welches in **app.module.ts** wie folgt registriert werden muss:

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  // ...
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
```

Anschließend kann ein neuer Ordner **services** in **app** erstellt werden und in einem Terminal ein neuer Service erstellt werden:

```
ng g s Product
```

In dem neu erstellten Service (**product.service.ts**) wird die Methode, um mehrere Produkte abzurufen, implementiert.

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient: HttpClient) { }

  public getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('/api/product');
  }
}
```

Im Produktservice wurde für die URL nur ein Pfad angegeben und keine vollständige URL. (Mehr Informationen zum Aufbau einer URL: <https://de.wikipedia.org/wiki/Uniform_Resource_Locator>) In diesem Fall verwendet Angular das Schema, Host und Port (z.b. **<http://localhost:4200>**) von der aktuell aufgerufenen Seite und hängt den angegebenen Pfad (**/api/product**) an. Dadurch werden die Daten während dem Entwickeln von dieser URL abgerufen: **<http://localhost:4200/api/product>**, welche auf den Webserver von Angular zeigt.

Damit der Webserver von Angular unsere Produkte zurückgeben kann, muss dieser wie folgt konfiguriert werden:

Im Hauptverzeichnis (wo zum Beispiel auch die Datei **angular.json** liegt) muss die Datei **proxy.conf.json** mit folgendem Inhalt erstellt werden:

```json
{
    "/api/": {
        "target": "http://your.backend.com",
        "secure": false,
        "changeOrigin": true
    }
}
```

Das target muss natürlich mit der URL des Backendservices ersetzt werden.

Diese Datei muss nun in **angular.json** angegeben werden. Hierfür muss unter **projects** > **demo-ui** (Projektname) > **architect** > **serve** folgendes hinzugefügt werden:

```json
"options": {
  "proxyConfig": "proxy.conf.json"
},
```

Damit die Änderungen wirksam werden, muss **ng serve** mit [STRG] + [C] abgebrochen und neu gestartet werden.

Um die Produkte über den erstellten Service zu laden und darzustellen, muss dies in **product-list.component.ts** und **product-list.component.html** geändert werden:

**product-list.component.ts**:

```typescript
import { Component } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  public products: Observable<Product[]>;

  constructor(productService: ProductService) {
    this.products = productService.getProducts()
      .pipe(catchError(() => {
        console.log('Beim Abfragen der Produkte ist ein Fehler aufgetreten.');
        return of([]);
      }));
  }
}
```

**product-list.component.html**:

```html
<h1>Products</h1>

<ul>
    <li *ngFor="let product of products | async">
        <a [routerLink]="['/product', product.id]">{{product.name}} - {{product.description}}</a>
    </li>
</ul>

<router-outlet></router-outlet>
```

In `*ngFor` im `li` HTML Element wurde nach products `| async` ergänzt, um Angular mitzuteilen, dass die Produkte verzögert geladen werden

### **Produkte editierbar machen**

Um ein einzelnes Produkt zu laden und wieder speichern, muss folgendes in **product.service.ts** ergänzt werden:

```typescript
public getProduct(id: number): Observable<Product> {
  // Die "Anfürungszeichen" sind backticks ([Umschalt] + [rechts von ß] ->[leertaste])
  return this.httpClient.get<Product>(`/api/product/${id}`);
}

public updateProduct(productId: number, product: Product): Observable<Product> {
  return this.httpClient.put<Product>(`/api/product/${productId}`, product);
}
```

Damit zum Beispiel der Name eines Produktes geändert werden kann, werden Eingabefelder benötigt. Für diese wird ein weiteres Modul in **app.module.ts** benötigt:

```typescript
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // ..
    ReactiveFormsModule,
  ]
}
```

Mehr Informationen zu Reactive forms gibt es unter
<https://angular.io/guide/reactive-forms>.

Anschließen können **edit-product.component.ts** und **edit-product.component.html** wie folgt angepasst werden:

**edit-product.component.ts**:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  public productForm: FormGroup;

  public constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService, formBuilder: FormBuilder) {
    this.productForm = formBuilder.group({
      "id": formBuilder.control(0),
      "name": formBuilder.control('', Validators.required),
      "description": formBuilder.control(''),
      "price": formBuilder.control(0),
    })
  }

  public ngOnInit(): void {
    // this.currentProductId = this.route.snapshot.params['productId'];

    this.route.params.pipe(
      map((allParameters: Params) => Number.parseInt(allParameters['productId'])),
      filter((productId: number | undefined) => !!productId),
      switchMap(productId => this.productService.getProduct(productId as number))
    ).subscribe((product: Product) => {
      this.productForm.setValue(product);
    });
  }

  public onSubmit(): void {
    const product: Product = this.productForm.value;

    this.productService.updateProduct(product.id, product).subscribe((savedProduct: Product) => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/product', savedProduct.id]));
    });
  }
}
```

**edit-product.component.html**:

```html
<form [formGroup]="productForm" (ngSubmit)="onSubmit()">
    <label for="name">Name: </label>
    <input type="text" id="name" formControlName="name">

    <label for="description">Beschreibung: </label>
    <input type="text" id="description" formControlName="description">

    <label for="price">Preis: </label>
    <input type="number" id="price" formControlName="price" step="0.01">

    <input type="submit" value="Speichern" [disabled]="!productForm.valid">
</form>
```

### **Angular Material implementieren**

Im Moment ist das UI eher funktional wie grafisch ansprechend. Um dies zu ändern, wird Angular Material verwendet. Einen Getting started guide gibt es hier: <https://material.angular.io/guide/getting-started>

Um Angular Material zu installieren, muss im Hauptverzeichniss folgendes im Terminal ausgeführt werden:

    ng add @angular/material

Die folgenden Ja/Nein Fragen können alle mit Ja (bzw. y) beantwortet werden. Bei der Frage nach einem Theme kann **custom** verwendet werden.

Anschließen müssen ein paar Module in **app.module.ts** importiert werden:

```typescript
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
}
```

#### **Seitennavigation**

Um die Navigationslinks in der Hauptkomponente aufzuräumen, kann die Seitennavigation verwendet werden.

Dokumentation: <https://material.angular.io/components/sidenav/overview>

**app.component.html**:

```html
<div class="demo-ui-container" [class.demo-ui-is-mobile]="mobileQuery.matches">
  <mat-toolbar color="primary" class="demo-ui-toolbar">
    <button mat-icon-button (click)="snav.toggle()">
      <!-- https://fonts.google.com/icons -->
      <mat-icon>menu</mat-icon>
    </button>
    <h1 class="demo-ui-app-name">Demo UI</h1>
  </mat-toolbar>

  <mat-sidenav-container class="demo-ui-sidenav-container" [style.marginTop.px]="mobileQuery.matches ? 56 : 0">
    <!-- position="end" -->
    <mat-sidenav #snav [mode]="mobileQuery.matches ? 'over' : 'side'" [fixedInViewport]="mobileQuery.matches"
      opened="true" fixedTopGap="56">
      <mat-nav-list>
        <a mat-list-item routerLink="/">Start</a>
        <a mat-list-item routerLink="/product">Products</a>
        <a mat-list-item routerLink="/product/1">Product one</a>
      </mat-nav-list>
    </mat-sidenav>

    <mat-sidenav-content>
      <div class="outlet">
        <router-outlet></router-outlet>
      </div>
    </mat-sidenav-content>
  </mat-sidenav-container>
</div>
```

**app.component.ts**:

```typescript
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  public constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  public ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
```

**app.component.css**:

```CSS
.demo-ui-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  
  .demo-ui-is-mobile .demo-ui-toolbar {
    position: fixed;
    /* Make sure the toolbar will stay on top of the content as it scrolls past. */
    z-index: 2;
  }
  
  h1.demo-ui-app-name {
    margin-left: 8px;
  }
  
  .demo-ui-sidenav-container {
    /* When the sidenav is not fixed, stretch the sidenav container to fill the available space. This
       causes `<mat-sidenav-content>` to act as our scrolling element for desktop layouts. */
    flex: 1;

}

.demo-ui-is-mobile .demo-ui-sidenav-container {
    /* When the sidenav is fixed, don't constrain the height of the sidenav container. This allows the
    `<body>` to be our scrolling element for mobile layouts. */
    flex: 1 0 auto;
}
```

#### **Listenansicht**

Die Liste mit Produkten kann mit der Liste von Angular Material ersetzt werden.

Dokumentation: <https://material.angular.io/components/list/overview>

**product-list.component.html**:

```html
<h1>Products</h1>

<div class="product-list-body">
    <mat-nav-list>
        <a mat-list-item [routerLink]="['/product', product.id]" *ngFor="let product of products | async">
            <h4 mat-line>{{product.name}}</h4>
            <p mat-line> {{product.description}} </p>
        </a>
    </mat-nav-list>

    <router-outlet></router-outlet>
</div>
```

**product-list.component.css**:

```CSS
.product-list-body {
    display: flex;
    flex-direction: row;
}

:host {
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
```

### **Eingabefelder**

Die Eingabefelder in der edit-produkt Komponente kann mit Form Felder bzw. Eingabefelder von Angular Material ersetzt werden:

Dokumentationen:

<https://material.angular.io/components/form-field/overview>
<https://material.angular.io/components/input/overview>

**edit-product.component.html**:

```html
<form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="demo-ui-form">
    <mat-form-field class="demo-ui-full-width">
        <mat-label>Name</mat-label>
        <input type="text" matInput formControlName="name" placeholder="Name des Produkts">
        <mat-error *ngIf="productForm.controls['name'].touched && productForm.controls['name'].hasError('required')">
            Der Name ist ein Pflichtfeld.
        </mat-error>
    </mat-form-field>

    <mat-form-field class="demo-ui-full-width">
        <mat-label>Beschreibung</mat-label>
        <input type="text" matInput formControlName="description" placeholder="Beschreibung des Produkts">
    </mat-form-field>

    <mat-form-field class="demo-ui-full-width">
        <mat-label>Preis</mat-label>
        <input type="number" matInput formControlName="price" placeholder="Preis des Produkts" step="0.01">
    </mat-form-field>

    <button mat-flat-button color="primary" [disabled]="!productForm.valid">Speichern</button>
</form>
```

**edit-product.component.css**:

```css
:host {
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.demo-ui-form {
    min-width: 150px;
    max-width: 500px;
    width: 100%;
}

.demo-ui-full-width {
    width: 100%;
}
```
