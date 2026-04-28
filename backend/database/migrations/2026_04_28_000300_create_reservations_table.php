<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table): void {
            $table->id();
            $table->string('reservation_number')->unique();
            $table->string('status')->default('new');
            $table->string('customer_name');
            $table->string('customer_phone', 60);
            $table->date('reservation_date');
            $table->string('reservation_time', 60);
            $table->string('guests', 10);
            $table->text('comment')->nullable();
            $table->boolean('agree_personal_data')->default(false);
            $table->timestamp('reserved_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};

