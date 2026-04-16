<?php

namespace Tests\Feature;

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
}
