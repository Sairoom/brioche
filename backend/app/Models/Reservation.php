<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'reservation_number',
        'status',
        'customer_name',
        'customer_phone',
        'reservation_date',
        'reservation_time',
        'guests',
        'comment',
        'agree_personal_data',
        'reserved_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'reservation_date' => 'date',
        'agree_personal_data' => 'boolean',
        'reserved_at' => 'datetime',
    ];
}

