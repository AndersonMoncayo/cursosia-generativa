"use server";

import type { ActionResult } from "@/types/database.types";

/**
 * BILLING MODULE — Fase 3 (Paddle)
 * Este módulo está preparado para integración con Paddle.
 * Se implementará en Fase 3 cuando se configure el Paddle sandbox.
 */

// Placeholder — se implementará en Fase 3
export async function createCheckoutSession(
	_courseId: string,
): Promise<ActionResult<{ checkoutUrl: string }>> {
	// TODO Fase 3: Integrar Paddle Checkout
	return { ok: false, error: "Pagos no disponibles aún. Próximamente." };
}

// Placeholder — se implementará cuando llegue el webhook
export async function handlePaddleWebhook(
	_payload: unknown,
): Promise<ActionResult> {
	// TODO Fase 3: Verificar firma criptográfica Paddle + actualizar purchases
	return { ok: false, error: "Webhook not implemented" };
}
