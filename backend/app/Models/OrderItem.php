<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'order_id',
        'product_id',
        'product_slug',
        'product_title',
        'unit_price',
        'quantity',
        'line_total',
        'options',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'unit_price' => 'decimal:2',
        'line_total' => 'decimal:2',
        'options' => 'array',
    ];

    /**
     * Parent order.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Linked product at the time of ordering.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}

