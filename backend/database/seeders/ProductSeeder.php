<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Seed the application's products.
     */
    public function run(): void
    {
        $products = [
            [
                'slug' => 'benedict-pastrami',
                'title' => 'Бенедикт с яйцом пашот и пастрами из индейки',
                'description' => 'Тост на бриоши с пастрами, яйцом пашот и голландским соусом.',
                'price' => 1090,
                'main_image_url' => 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => [
                    'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?auto=format&fit=crop&w=1200&q=80',
                ],
                'ingredients' => ['Бриошь', 'Пастрами из индейки', 'Яйцо пашот', 'Голландский соус'],
                'allergens' => ['Глютен', 'Лактоза', 'Горчица', 'Орехи'],
            ],
            [
                'slug' => 'chicken-pate-toast',
                'title' => 'Куриный паштет на бриоши',
                'description' => 'Домашний паштет из курицы, сливовый соус и зелень.',
                'price' => 750,
                'main_image_url' => 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => [
                    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1562059390-a761a084768e?auto=format&fit=crop&w=1200&q=80',
                ],
                'ingredients' => ['Бриошь', 'Куриный паштет', 'Сливовый соус'],
                'allergens' => ['Глютен', 'Яйцо'],
            ],
            [
                'slug' => 'spread-set',
                'title' => 'Сет намазок',
                'description' => 'Ассорти намазок с теплой бриошью и сезонными добавками.',
                'price' => 790,
                'main_image_url' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => [
                    'https://images.unsplash.com/photo-1599021456807-25db0f974333?auto=format&fit=crop&w=1200&q=80',
                ],
                'ingredients' => ['Бриошь', 'Хумус', 'Риет', 'Тапенада'],
                'allergens' => ['Глютен', 'Кунжут'],
            ],
            [
                'slug' => 'machete-steak',
                'title' => 'Стейк Мачете с картофелем',
                'description' => 'Стейк с мятным картофелем и соусом сальса верде.',
                'price' => 2500,
                'main_image_url' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => [
                    'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80',
                ],
                'ingredients' => ['Говядина', 'Картофель', 'Сальса верде'],
                'allergens' => [],
            ],
        ];

        foreach ($products as $payload) {
            $product = Product::query()->updateOrCreate(
                ['slug' => $payload['slug']],
                [
                    'title' => $payload['title'],
                    'description' => $payload['description'],
                    'price' => $payload['price'],
                    'main_image_url' => $payload['main_image_url'],
                    'allergens' => $payload['allergens'],
                    'is_active' => true,
                ]
            );

            $product->images()->delete();

            collect($payload['gallery_images'])
                ->values()
                ->each(function (string $imageUrl, int $index) use ($product): void {
                    $product->images()->create([
                        'image_url' => $imageUrl,
                        'sort_order' => $index,
                    ]);
                });

            $ingredientIds = collect($payload['ingredients'])
                ->map(fn (string $name): string => trim($name))
                ->filter()
                ->unique()
                ->map(fn (string $name): int => Ingredient::query()->firstOrCreate(['name' => $name])->id)
                ->all();

            $product->ingredients()->sync($ingredientIds);
        }
    }
}
