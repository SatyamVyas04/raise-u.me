// hooks/useLeaders.ts
import { useState, useEffect } from "react";

interface Leader {
	id: string;
	name: string;
	image: string;
	skills: string[];
	summary: string;
}

// Cache object to store API responses
const apiCache: {
	allLeaders?: Leader[];
	leaderDetails: { [key: string]: Leader };
} = {
	leaderDetails: {},
};

export function useLeaders() {
	const [leaders, setLeaders] = useState<Leader[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchLeaders = async () => {
			try {
				// Check if we have cached data
				if (apiCache.allLeaders) {
					setLeaders(apiCache.allLeaders);
					setIsLoading(false);
					return;
				}

				const response = await fetch(
					"http://localhost:5000/api/leaders"
				);
				const data = await response.json();

				// Cache the response
				apiCache.allLeaders = data;
				setLeaders(data);
			} catch (error) {
				console.error("Error fetching leaders:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLeaders();
	}, []);

	return { leaders, isLoading };
}

export function useLeaderDetails(id: string) {
	const [leader, setLeader] = useState<Leader | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchLeaderDetails = async () => {
			if (!id) return;

			try {
				// Check if we have cached data
				if (apiCache.leaderDetails[id]) {
					setLeader(apiCache.leaderDetails[id]);
					setIsLoading(false);
					return;
				}

				const response = await fetch(
					`http://localhost:5000/api/leaders/${id}`
				);
				const data = await response.json();

				// Cache the response
				apiCache.leaderDetails[id] = data;
				setLeader(data);
			} catch (error) {
				console.error("Error fetching leader details:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLeaderDetails();
	}, [id]);

	return { leader, isLoading };
}
