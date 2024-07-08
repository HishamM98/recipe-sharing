import { Component, inject, OnDestroy } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { RecipeService } from '../../../../core/services/recipe/recipe-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-create-recipe-form',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatFormFieldModule, MatInputModule, MatDialogClose, MatDialogTitle, ReactiveFormsModule, MatButtonModule, MatRadioModule, TextFieldModule],
  templateUrl: './create-recipe-form.component.html',
  styleUrl: './create-recipe-form.component.scss'
})
export class CreateRecipeFormComponent implements OnDestroy {
  recipeForm: FormGroup = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
    image: new FormControl<string>('', [Validators.required]),
    vegitarian: new FormControl<string>("0", [Validators.required])
  });

  private recipe$ = inject(RecipeService);
  subscriptions = new Subscription();
  private _snackBar = inject(MatSnackBar);


  onSubmit() {
    this.subscriptions.add(this.recipe$.createRecipe(this.recipeForm.value).subscribe({
      next: (res) => {
        this.openSnackBar("New Recipe Created!");
      },
      error: (err: Error) => { this.openSnackBar("Error Creating Recipe: " + err.message); }
    }));
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Close", {
      duration: 3000
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
