import { nanoid } from "nanoid";

export const shortid = (size?: number) => nanoid(size);

export function clone<T>(item: T): T {
	if (item === null || item === undefined) return item; // null, undefined check

	if (Array.isArray(item)) {
		return item.map((child) => clone(child)) as unknown as T;
	}

	if (item instanceof Date) {
		return new Date(item.getTime()) as unknown as T;
	}

	if (item instanceof Error) {
		// Copy error stack and message for proper cloning of Error objects
		const clonedError = new (item.constructor as { new (message: string): Error })(item.message);
		clonedError.stack = item.stack;
		return clonedError as unknown as T;
	}

	if (typeof item === "object") {
		const result: Record<string | symbol, unknown> = {};
		for (const key of Object.keys(item)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(result as any)[key] = clone((item as any)[key]);
		}
		return result as T;
	}

	// Primitive types are returned as is
	return item;
}