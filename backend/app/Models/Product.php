<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'slug',
        'title',
        'description',
        'price',
        'main_image_url',
        'allergens',
        'allergy_note',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'allergens' => 'array',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];

    /**
     * Scope a query to active products.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Additional product images in display order.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /**
     * Ingredients linked to the product.
     */
    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class)->orderBy('name');
    }

    /**
     * Find related products based on shared ingredients and price proximity.
     */
    public function relatedProducts(int $limit = 3): Collection
    {
        $ingredientIds = $this->ingredients()->pluck('ingredients.id');

        return static::query()
            ->active()
            ->where('id', '!=', $this->id)
            ->with(['images:id,product_id,image_url,sort_order'])
            ->withCount([
                'ingredients as shared_ingredients_count' => function (Builder $query) use ($ingredientIds): void {
                    if ($ingredientIds->isEmpty()) {
                        $query->whereRaw('1 = 0');

                        return;
                    }

                    $query->whereIn('ingredients.id', $ingredientIds);
                },
            ])
            ->orderByDesc('shared_ingredients_count')
            ->orderByRaw('ABS(price - ?) ASC', [$this->price])
            ->latest('id')
            ->limit($limit)
            ->get();
    }
}
