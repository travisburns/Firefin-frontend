import type { RecipeIngredient } from "@/types/api";

export function IngredientTable({ ingredients }: { ingredients: RecipeIngredient[] }) {
  if (ingredients.length === 0) {
    return <p className="empty">No ingredients recorded for this version yet.</p>;
  }

  const total = ingredients.reduce((sum, i) => sum + i.grams, 0);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Ingredient</th>
          <th className="grams">Grams</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {ingredients.map((i) => (
          <tr key={i.id}>
            <td>{i.name}</td>
            <td className="grams">{i.grams}</td>
            <td>{i.notes ?? ""}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th>Total</th>
          <th className="grams">{total}</th>
          <th />
        </tr>
      </tfoot>
    </table>
  );
}
