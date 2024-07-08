import { inject, Injectable, signal } from '@angular/core';
import { environment as env } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../../../shared/models/recipe';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly apiUrl = env.apiUrl;
  private http = inject(HttpClient);
  private recipesSig = signal<Recipe[]>([]);

  get recipeSignal() {
    return this.recipesSig();
  }

  createRecipe(recipeData: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/recipes`, recipeData).pipe(
      tap((recipe) => {
        this.recipesSig.update(recipes => [...recipes, recipe]);
        // this.recipesSig.set([...this.recipeSignal, recipe]);
      })
    );
  }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`).pipe(
      tap((recipes) => {
        this.recipesSig.set(recipes);
      })
    );
  }

  getRecipeAuthor(recipeId: string): Observable<{ fullname: string; avatar: string; }> {
    return this.http.get<{ fullname: string; avatar: string; }>(`${this.apiUrl}/recipes/${recipeId}/author`);
  }

  getRecipe(recipeId: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/recipes/${recipeId}`);
  }

  updateRecipe(recipeId: string, recipeData: Recipe): Observable<string> {
    return this.http.patch<string>(`${this.apiUrl}/recipes/${recipeId}`, recipeData).pipe(
      tap(() => {
        this.recipesSig.update(recipes => {
          return recipes.map(r => {
            if (r.id === recipeId) {
              return { ...r, ...recipeData };
            }
            return r;
          });
        });
      })
    );
  }

  deleteRecipe(recipeId: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/recipes/${recipeId}`).pipe(
      tap((res) => {
        this.recipesSig.update(recipes => recipes.filter(r => r.id !== recipeId));
      })
    );
  }

  likeRecipe(recipeId: string) {
    return this.http.get<string>(`${this.apiUrl}/recipes/like/${recipeId}`);
  }
}
