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
        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('status')->default('new');

            $table->string('customer_name');
            $table->string('customer_phone');

            $table->string('recipient_type');
            $table->string('recipient_name')->nullable();
            $table->string('recipient_phone')->nullable();

            $table->string('delivery_method');
            $table->string('delivery_address')->nullable();
            $table->string('delivery_entrance')->nullable();
            $table->string('delivery_floor')->nullable();
            $table->string('delivery_apartment')->nullable();
            $table->date('delivery_date')->nullable();
            $table->string('delivery_time')->nullable();

            $table->text('comment')->nullable();

            $table->decimal('items_subtotal', 10, 2);
            $table->decimal('delivery_price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->string('currency', 3)->default('RUB');
            $table->timestamp('placed_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

