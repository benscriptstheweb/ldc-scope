declare global {
	namespace App {
		interface Locals {
			user: {
				uid: string;
				email: string | undefined;
				isAdmin: boolean;
				assignedRegion: number;
			} | null
		}
	}
}

export { };
