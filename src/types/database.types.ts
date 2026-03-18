/**
 * Database types for Supabase project: zksnydnjumdesdftajns
 * Tablas: profiles, courses, purchases, progress, reviews, posts
 * Generated manually — run `supabase gen types typescript` to update.
 */

export type UserRole = "superadmin" | "admin" | "instructor" | "user";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type PurchaseStatus = "pending" | "completed" | "refunded" | "failed";

// ─────────────────────────────────────────
// profiles
// ─────────────────────────────────────────
export interface Profile {
	id: string;
	email: string;
	full_name: string | null;
	avatar_url: string | null;
	role: UserRole;
	bio: string | null;
	created_at: string;
	updated_at: string;
}

// ─────────────────────────────────────────
// courses
// ─────────────────────────────────────────
export interface Course {
	id: string;
	slug: string;
	title: string;
	description: string | null;
	thumbnail_url: string | null;
	price: number;
	is_published: boolean;
	level: CourseLevel;
	duration_hours: number | null;
	creator_id: string;
	created_at: string;
	updated_at: string;
}

export interface CourseWithCreator extends Course {
	creator: Pick<Profile, "id" | "full_name" | "avatar_url">;
}

// ─────────────────────────────────────────
// purchases
// ─────────────────────────────────────────
export interface Purchase {
	id: string;
	user_id: string;
	course_id: string;
	status: PurchaseStatus;
	amount_paid: number;
	currency: string;
	paddle_subscription_id: string | null;
	paddle_transaction_id: string | null;
	created_at: string;
	updated_at: string;
}

export interface PurchaseWithCourse extends Purchase {
	course: Course;
}

// ─────────────────────────────────────────
// progress
// ─────────────────────────────────────────
export interface LessonProgress {
	id: string;
	user_id: string;
	course_id: string;
	lesson_id: string;
	completed: boolean;
	completed_at: string | null;
	created_at: string;
	updated_at: string;
}

// ─────────────────────────────────────────
// reviews
// ─────────────────────────────────────────
export interface Review {
	id: string;
	user_id: string;
	course_id: string;
	rating: number; // 1–5
	body: string | null;
	is_published: boolean;
	created_at: string;
	updated_at: string;
}

export interface ReviewWithAuthor extends Review {
	author: Pick<Profile, "id" | "full_name" | "avatar_url">;
}

// ─────────────────────────────────────────
// posts (blog)
// ─────────────────────────────────────────
export interface Post {
	id: string;
	slug: string;
	title: string;
	excerpt: string | null;
	body: string | null;
	cover_url: string | null;
	author_id: string;
	is_published: boolean;
	published_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface PostWithAuthor extends Post {
	author: Pick<Profile, "id" | "full_name" | "avatar_url">;
}

// ─────────────────────────────────────────
// Generic API result type
// ─────────────────────────────────────────
export type ActionResult<T = undefined> =
	| { ok: true; data: T }
	| { ok: false; error: string };
