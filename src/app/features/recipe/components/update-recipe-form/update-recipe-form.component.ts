import { Subscription } from 'rxjs';
import { Component, inject, Inject, OnDestroy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Recipe } from '../../../../shared/models/recipe';
import { MatRadioModule } from '@angular/material/radio';
import { RecipeService } from '../../../../core/services/recipe/recipe-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-recipe-form',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatFormFieldModule, MatInputModule, MatDialogClose, MatDialogTitle, ReactiveFormsModule, MatButtonModule, MatRadioModule],
  templateUrl: './update-recipe-form.component.html',
  styleUrl: './update-recipe-form.component.scss'
})
export class UpdateRecipeFormComponent implements OnDestroy {
  recipeForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    vegitarian: new FormControl("false", Validators.required)
  });

  private recipe$ = inject(RecipeService);
  private dialogRef = inject(MatDialogRef<UpdateRecipeFormComponent>);
  private _snackbar = inject(MatSnackBar);
  private subscriptions = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) private data: Recipe) { }

  ngOnInit(): void {
    this.recipeForm.setValue({
      title: this.data.title,
      description: this.data.description,
      image: this.data.image,
      vegitarian: this.data.vegitarian + ''
    });
  }

  onSubmit() {
    this.recipe$.updateRecipe(this.data.id!, this.recipeForm.value).subscribe({
      next: () => {
        // Close the dialog after successful update
        this._snackbar.open('Recipe updated successfully!', 'Close', {
          duration: 3000
        });
        this.dialogRef.close();
      },
      error: (error: Error) => {
        // Handle any errors during update
        console.error('Error updating recipe:', error);
        this._snackbar.open('Error: ' + error.message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}