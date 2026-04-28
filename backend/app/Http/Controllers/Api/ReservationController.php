<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ReservationController extends Controller
{
    /**
     * Create a new table reservation.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reservation_date' => ['required', 'date_format:Y-m-d'],
            'reservation_time' => ['required', 'string', 'max:60'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:60', 'regex:/^\+7\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/'],
            'guests' => ['required', 'string', Rule::in(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'])],
            'comment' => ['nullable', 'string', 'max:3000'],
            'agree_personal_data' => ['required', 'accepted'],
        ]);

        $reservation = Reservation::query()->create([
            'reservation_number' => $this->generateReservationNumber(),
            'status' => 'new',
            'reservation_date' => $validated['reservation_date'],
            'reservation_time' => trim((string) $validated['reservation_time']),
            'customer_name' => trim((string) $validated['customer_name']),
            'customer_phone' => trim((string) $validated['customer_phone']),
            'guests' => $validated['guests'],
            'comment' => isset($validated['comment']) ? trim((string) $validated['comment']) : null,
            'agree_personal_data' => (bool) $validated['agree_personal_data'],
            'reserved_at' => now(),
        ]);

        return response()->json([
            'data' => [
                'reservation' => [
                    'id' => $reservation->id,
                    'reservation_number' => $reservation->reservation_number,
                    'status' => $reservation->status,
                    'reserved_at' => optional($reservation->reserved_at)->toISOString(),
                ],
            ],
        ], 201);
    }

    private function generateReservationNumber(): string
    {
        do {
            $candidate = 'RSV-'.now()->format('Ymd').'-'.Str::upper(Str::random(6));
        } while (Reservation::query()->where('reservation_number', $candidate)->exists());

        return $candidate;
    }
}

