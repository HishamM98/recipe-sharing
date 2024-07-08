import { ChangeDetectionStrategy, Component, inject, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { RecipeCardComponent } from './components/recipe-card/recipe-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CreateRecipeFormComponent } from '../../../features/recipe/components/create-recipe-form/create-recipe-form.component';
import { AuthService } from '../../services/auth/auth-service.service';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe/recipe-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipeCardComponent, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnChanges, OnDestroy {
  private auth$ = inject(AuthService);
  recipe$ = inject(RecipeService);
  private router = inject(Router);
  subscriptions = new Subscription();

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    if (!this.auth$.isLoggedIn()) {
      this.router.navigateByUrl('/auth');
    }

    this.subscriptions.add(this.recipe$.getAllRecipes().subscribe());
  }

  openCreateRecipeForm(): void {
    this.dialog.open(CreateRecipeFormComponent, {
      autoFocus: true,
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      hasBackdrop: true,
      restoreFocus: true
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subscriptions.add(this.recipe$.getAllRecipes().subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
