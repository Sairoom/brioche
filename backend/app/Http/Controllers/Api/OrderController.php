<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Create a new customer order.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:60'],

            'recipient_type' => ['required', 'string', Rule::in(['self', 'gift'])],
            'recipient_name' => ['nullable', 'required_if:recipient_type,gift', 'string', 'max:255'],
            'recipient_phone' => ['nullable', 'required_if:recipient_type,gift', 'string', 'max:60'],

            'delivery_method' => ['required', 'string', Rule::in(['pickup', 'address'])],
            'delivery_address' => ['nullable', 'required_if:delivery_method,address', 'string', 'max:255'],
            'delivery_entrance' => ['nullable', 'string', 'max:30'],
            'delivery_floor' => ['nullable', 'string', 'max:30'],
            'delivery_apartment' => ['nullable', 'string', 'max:30'],
            'delivery_date' => ['required', 'date_format:Y-m-d'],
            'delivery_time' => ['required', 'string', 'max:60'],

            'comment' => ['nullable', 'string', 'max:3000'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['nullable', 'integer', 'min:1'],
            'items.*.slug' => ['required', 'string', 'max:255'],
            'items.*.title' => ['required', 'string', 'max:255'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.options' => ['sometimes', 'array'],
            'items.*.options.*.id' => ['required', 'string', 'max:120'],
            'items.*.options.*.label' => ['required', 'string', 'max:120'],
            'items.*.options.*.value' => ['required', 'string', 'max:255'],
        ]);

        $normalizedItems = collect($validated['items'])
            ->map(function (array $item): array {
                $unitPrice = round((float) $item['unit_price'], 2);
                $quantity = (int) $item['quantity'];
                $lineTotal = round($unitPrice * $quantity, 2);
                $options = collect($item['options'] ?? [])
                    ->map(fn (array $option): array => [
                        'id' => trim($option['id']),
                        'label' => trim($option['label']),
                        'value' => trim($option['value']),
                    ])
                    ->values()
                    ->all();

                return [
                    'product_id' => isset($item['product_id']) ? (int) $item['product_id'] : null,
                    'product_slug' => trim($item['slug']),
                    'product_title' => trim($item['title']),
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'line_total' => $lineTotal,
                    'options' => $options,
                ];
            })
            ->values();

        $itemsSubtotal = round((float) $normalizedItems->sum('line_total'), 2);
        $deliveryPrice = $validated['delivery_method'] === 'address' ? 800.00 : 0.00;
        $totalPrice = round($itemsSubtotal + $deliveryPrice, 2);

        $order = DB::transaction(function () use ($validated, $normalizedItems, $itemsSubtotal, $deliveryPrice, $totalPrice): Order {
            $order = Order::query()->create([
                'order_number' => $this->generateOrderNumber(),
                'status' => 'new',
                'customer_name' => trim($validated['customer_name']),
                'customer_phone' => trim($validated['customer_phone']),
                'recipient_type' => $validated['recipient_type'],
                'recipient_name' => $validated['recipient_type'] === 'gift' ? trim((string) ($validated['recipient_name'] ?? '')) : null,
                'recipient_phone' => $validated['recipient_type'] === 'gift' ? trim((string) ($validated['recipient_phone'] ?? '')) : null,
                'delivery_method' => $validated['delivery_method'],
                'delivery_address' => $validated['delivery_method'] === 'address' ? trim((string) ($validated['delivery_address'] ?? '')) : null,
                'delivery_entrance' => $validated['delivery_method'] === 'address' ? trim((string) ($validated['delivery_entrance'] ?? '')) : null,
                'delivery_floor' => $validated['delivery_method'] === 'address' ? trim((string) ($validated['delivery_floor'] ?? '')) : null,
                'delivery_apartment' => $validated['delivery_method'] === 'address' ? trim((string) ($validated['delivery_apartment'] ?? '')) : null,
                'delivery_date' => $validated['delivery_date'],
                'delivery_time' => trim((string) $validated['delivery_time']),
                'comment' => isset($validated['comment']) ? trim((string) $validated['comment']) : null,
                'items_subtotal' => $itemsSubtotal,
                'delivery_price' => $deliveryPrice,
                'total_price' => $totalPrice,
                'currency' => 'RUB',
                'placed_at' => now(),
            ]);

            $order->items()->createMany(
                $normalizedItems->map(fn (array $item): array => [
                    ...$item,
                    'options' => $item['options'] !== [] ? $item['options'] : null,
                ])->all()
            );

            return $order->load('items');
        });

        return response()->json([
            'data' => [
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'total_price' => (float) $order->total_price,
                    'currency' => $order->currency,
                    'placed_at' => optional($order->placed_at)->toISOString(),
                ],
            ],
        ], 201);
    }

    private function generateOrderNumber(): string
    {
        do {
            $candidate = 'BR-'.now()->format('Ymd').'-'.Str::upper(Str::random(6));
        } while (Order::query()->where('order_number', $candidate)->exists());

        return $candidate;
    }
}

