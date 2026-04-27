<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'order_number',
        'status',
        'customer_name',
        'customer_phone',
        'recipient_type',
        'recipient_name',
        'recipient_phone',
        'delivery_method',
        'delivery_address',
        'delivery_entrance',
        'delivery_floor',
        'delivery_apartment',
        'delivery_date',
        'delivery_time',
        'comment',
        'items_subtotal',
        'delivery_price',
        'total_price',
        'currency',
        'placed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'delivery_date' => 'date',
        'placed_at' => 'datetime',
        'items_subtotal' => 'decimal:2',
        'delivery_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    /**
     * Items in the order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}

