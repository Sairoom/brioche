<?php

namespace Tests\Feature;

use App\Models\Product;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_product_list(): void
    {
        $this->seed(ProductSeeder::class);

        $response = $this->getJson('/api/products');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'slug', 'title', 'price', 'price_value', 'main_image_url'],
                ],
            ]);
    }

    public function test_it_returns_product_details_with_related_products(): void
    {
        $this->seed(ProductSeeder::class);

        $response = $this->getJson('/api/products/benedict-pastrami');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'slug',
                    'title',
                    'description',
                    'allergy_note',
                    'price',
                    'price_value',
                    'main_image_url',
                    'gallery_images',
                    'ingredients',
                    'allergens',
                    'related' => [
                        '*' => ['id', 'slug', 'title', 'price', 'price_value', 'main_image_url'],
                    ],
                ],
            ]);
    }

    public function test_it_decodes_mojibake_text_in_product_payload(): void
    {
        Product::query()->create([
            'slug' => 'mojibake-check',
            'title' => 'РўРµСЃС‚РѕРІС‹Р№ С‚РѕСЂС‚',
            'description' => 'РћРїРёСЃР°РЅРёРµ С‚РѕРІР°СЂР°',
            'allergy_note' => 'РџСЂРёРјРµС‡Р°РЅРёРµ',
            'price' => 1234,
            'main_image_url' => 'https://example.com/cake.jpg',
            'allergens' => ['Р»Р°РєС‚РѕР·Р°'],
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/products/mojibake-check');

        $response
            ->assertOk()
            ->assertJsonPath('data.title', 'Тестовый торт')
            ->assertJsonPath('data.description', 'Описание товара')
            ->assertJsonPath('data.allergy_note', 'Примечание')
            ->assertJsonPath('data.allergens.0', 'лактоза');
    }
}
