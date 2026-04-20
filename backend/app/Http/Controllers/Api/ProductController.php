<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * List products for catalog pages.
     */
    public function index(Request $request): JsonResponse
    {
        $limit = max(1, min(100, (int) $request->integer('limit', 30)));

        $productsQuery = Product::query()
            ->with(['images:id,product_id,image_url,sort_order'])
            ->orderBy('title');

        if (! $request->is('api/admin/*')) {
            $productsQuery->active();
        }

        $products = $productsQuery->limit($limit)->get();

        return response()->json([
            'data' => $products->map(fn (Product $product): array => $this->transformProductCard($product))->values(),
        ]);
    }

    /**
     * Show full product details by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::query()
            ->active()
            ->with(['images:id,product_id,image_url,sort_order', 'ingredients:id,name'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'data' => $this->transformProductDetail($product, $product->relatedProducts(3)),
        ]);
    }

    /**
     * Create a product (admin endpoint).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePayload($request);
        $product = $this->persistProduct(new Product(), $validated);

        return response()->json([
            'data' => $this->transformProductDetail($product, $product->relatedProducts(3)),
        ], 201);
    }

    /**
     * Update a product (admin endpoint).
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $this->validatePayload($request, $product->id);
        $updatedProduct = $this->persistProduct($product, $validated);

        return response()->json([
            'data' => $this->transformProductDetail($updatedProduct, $updatedProduct->relatedProducts(3)),
        ]);
    }

    /**
     * Delete a product (admin endpoint).
     */
    public function destroy(Product $product): Response
    {
        $product->delete();

        return response()->noContent();
    }

    /**
     * Validate incoming payload for create/update.
     *
     * @return array<string, mixed>
     */
    private function validatePayload(Request $request, ?int $productId = null): array
    {
        $slugRule = Rule::unique('products', 'slug');

        if ($productId !== null) {
            $slugRule = $slugRule->ignore($productId);
        }

        return $request->validate([
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', $slugRule],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'allergy_note' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'main_image_url' => ['required', 'url', 'max:2048'],
            'gallery_images' => ['sometimes', 'array'],
            'gallery_images.*' => ['required', 'url', 'max:2048', 'distinct'],
            'ingredients' => ['sometimes', 'array'],
            'ingredients.*' => ['required', 'string', 'max:120', 'distinct'],
            'allergens' => ['sometimes', 'array'],
            'allergens.*' => ['required', 'string', 'max:120', 'distinct'],
            'is_active' => ['sometimes', 'boolean'],
        ]);
    }

    /**
     * Persist product and linked entities.
     *
     * @param  array<string, mixed>  $validated
     */
    private function persistProduct(Product $product, array $validated): Product
    {
        $product->fill([
            'slug' => $validated['slug'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'allergy_note' => $validated['allergy_note'] ?? null,
            'price' => $validated['price'],
            'main_image_url' => $validated['main_image_url'],
            'allergens' => $validated['allergens'] ?? [],
            'is_active' => $validated['is_active'] ?? true,
        ]);
        $product->save();

        $this->syncGalleryImages($product, $validated['gallery_images'] ?? []);
        $this->syncIngredients($product, $validated['ingredients'] ?? []);

        return $product->fresh(['images:id,product_id,image_url,sort_order', 'ingredients:id,name']);
    }

    /**
     * Replace gallery images for the product.
     *
     * @param  array<int, string>  $imageUrls
     */
    private function syncGalleryImages(Product $product, array $imageUrls): void
    {
        $product->images()->delete();

        collect($imageUrls)
            ->values()
            ->each(function (string $url, int $index) use ($product): void {
                $product->images()->create([
                    'image_url' => $url,
                    'sort_order' => $index,
                ]);
            });
    }

    /**
     * Sync product ingredients by name.
     *
     * @param  array<int, string>  $ingredientNames
     */
    private function syncIngredients(Product $product, array $ingredientNames): void
    {
        $normalizedNames = collect($ingredientNames)
            ->map(fn (string $name): string => trim($name))
            ->filter()
            ->unique()
            ->values();

        $ingredientIds = $normalizedNames
            ->map(fn (string $name): int => Ingredient::query()->firstOrCreate(['name' => $name])->id)
            ->all();

        $product->ingredients()->sync($ingredientIds);
    }

    /**
     * Product payload for list/related cards.
     *
     * @return array<string, mixed>
     */
    private function transformProductCard(Product $product): array
    {
        return [
            'id' => $product->id,
            'slug' => $product->slug,
            'title' => $product->title,
            'price' => $this->formatPrice($product->price),
            'price_value' => (float) $product->price,
            'main_image_url' => $product->main_image_url,
        ];
    }

    /**
     * Full product payload.
     *
     * @param  Collection<int, Product>  $relatedProducts
     * @return array<string, mixed>
     */
    private function transformProductDetail(Product $product, Collection $relatedProducts): array
    {
        return [
            'id' => $product->id,
            'slug' => $product->slug,
            'title' => $product->title,
            'description' => $product->description,
            'allergy_note' => $product->allergy_note,
            'price' => $this->formatPrice($product->price),
            'price_value' => (float) $product->price,
            'main_image_url' => $product->main_image_url,
            'gallery_images' => $product->images
                ->pluck('image_url')
                ->filter()
                ->unique()
                ->values()
                ->all(),
            'ingredients' => $product->ingredients
                ->pluck('name')
                ->values()
                ->all(),
            'allergens' => array_values($product->allergens ?? []),
            'related' => $relatedProducts
                ->map(fn (Product $related): array => $this->transformProductCard($related))
                ->values(),
        ];
    }

    /**
     * Format numeric price for frontend UI.
     */
    private function formatPrice(float|string $price): string
    {
        return number_format((float) $price, 0, '.', ' ').' ₽';
    }
}
