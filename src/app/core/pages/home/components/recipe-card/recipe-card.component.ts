import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UpdateRecipeFormComponent } from '../../../../../features/recipe/components/update-recipe-form/update-recipe-form.component';
import { Recipe } from '../../../../../shared/models/recipe';
import { RecipeService } from '../../../../services/recipe/recipe-service.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})

export class RecipeCardComponent implements OnInit, OnDestroy {
  private recipe$ = inject(RecipeService);
  recipe = input.required<Recipe>();
  // @Input() recipe! :Recipe;
  readonly dialog = inject(MatDialog);
  subscriptions = new Subscription();
  private _snackbar = inject(MatSnackBar);
  recipeAuthor!: { fullname: string; avatar: string; };


  ngOnInit(): void {
    this.subscriptions.add(this.recipe$.getRecipeAuthor(this.recipe().id!).subscribe({
      next: res => { this.recipeAuthor = res; },
      error: (err: Error) => console.error(err.message)
    }));
  }

  openEditRecipeForm(): void {
    this.dialog.open(UpdateRecipeFormComponent, {
      data: this.recipe(),
      autoFocus: true,
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      hasBackdrop: true,
      restoreFocus: true
    });
  }


  deleteRecipe() {
    this.subscriptions.add(this.recipe$.deleteRecipe(this.recipe().id!).subscribe({
      next: () => {
        this._snackbar.open('Recipe Deleted!', "Close", {
          duration: 3000
        });
      },
      error: (err: Error) => {
        this._snackbar.open('Error Deleting Recipe: ' + err.message, "Close", {
          duration: 3000
        });
        console.error(err);
      }
    }));
  }

  likeRecipe() {
    this.subscriptions.add(this.recipe$.likeRecipe(this.recipe().id!).subscribe({
      next: () => {
        this._snackbar.open('Recipe Liked!', "Close", {
          duration: 3000
        });
      },
      error: (err: Error) => {
        this._snackbar.open('Error: ' + err.message, "Close", {
          duration: 3000
        });
        console.error(err);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
